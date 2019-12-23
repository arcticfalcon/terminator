import {FitAddon} from "xterm-addon-fit";
import {Terminal} from "xterm";
import LocalEchoController from 'local-echo/LocalEchoController';
import '!style-loader!css-loader!xterm/css/xterm.css'
import {parse} from "shell-quote"

const internalCommands = [
    {
        name: "help",
        description: "[INTERNAL] List available commands",
        parameters: [],
        handler: (params, terminator, abortSignal) => {
            // List commands
            terminator.println("Commands")
            const maxLength = terminator.commands.reduce((max, command) => Math.max(max, command.name.length), 0)
            terminator.commands.sort().forEach(com => terminator.println(`  ${com.name.padEnd(maxLength)}  ${com.description}`))
            terminator.done()
        }
    },
    {
        name: "history",
        description: "[INTERNAL] List executed commands",
        parameters: [],
        handler: (params, terminator, abortSignal) => {
            const max = terminator.history.length.toString().length
            terminator.history.forEach((h, i) => h ? terminator.println(`  ${i.toString().padEnd(max)}  ${h}`) : false)
            terminator.done()
        }
    },
    {
        name: "clear",
        description: "[INTERNAL] Clear console",
        parameters: [],
        handler: (params, terminator, abortSignal) => {
            terminator.xterm.reset()
            terminator.done()
        }
    },
]

export default class Terminator {
    promptSymbol = '~$ '
    xterm
    localEcho
    history = [""]
    commands
    args = {}
    abortSignal

    constructor(commands, promptSymbol, theme, args) {
        commands.sort(function (a, b) {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        this.commands = [...internalCommands, ...commands];
        this.promptSymbol = promptSymbol
        this.args = args

        const options = Object.assign({
            scrollback: 1000,
            theme: {
                background: theme.background,
                foreground: theme.foreground,
            }
        })
        this.fitAddon = new FitAddon();
        this.xterm = new Terminal(options);
        this.xterm.loadAddon(this.fitAddon);
    }

    attach(container) {
        this.xterm.open(container);
        this.fitAddon.fit()
        this.localEcho = new LocalEchoController(this.xterm);
        this.localEcho.addAutocompleteHandler((i,t)=>this.autocomplete(i,t))
        this.prompt()
    }

    prompt() {
        this.localEcho.read(this.promptSymbol)
            .then(input => {
                this.execute(input)
            })
            .catch(error => {
                this.prompt()
            });
    }
    promptCancel() {
        this.localEcho.read("")
            .then(input => {
                this.promptCancel()
            })
            .catch(reason => {
                if(reason === "aborted") {
                    this.abort()
                }
            });
    }

    print(content) {
        this.xterm.write(content)
    }
    println(content) {
        this.xterm.writeln(content)
    }

    execute(commandInput) {
        commandInput = commandInput.trim()
        if (commandInput === "") {
            this.prompt()
            return
        }

        // Event command
        if (commandInput.startsWith("!")) {
            const index = Number(commandInput.replace("!", ""))
            if (isFinite(index)) {
                if (index <= 0 || index >= this.history.length) {
                    // Error
                    this.println(`${commandInput}: event not found`)
                    this.prompt()
                    return
                }
                // Execute from history
                commandInput = this.history[index]
            }
        }

        // Add to history
        this.history.push(commandInput)

        // Grab first word
        let commandParts = parse(commandInput)
        const commandStr = commandParts.shift() || ""
        // Find command
        const command = this.commands.filter(com => com.name === commandStr).shift()
        if (!command) {
            // Error
            this.println(`${commandStr}: command not found`)
            this.prompt()
            return
        }

        // Find help flag
        const wantsHelp = commandParts.find(p => p === '-h' || p === '--help')
        if (wantsHelp) {
            // Show command usage
            const paramsString = command.parameters.map(p => {
                if (p.is_boolean) {
                    return `[--${p.name}|-${p.name[0]}]`
                }
                if (p.required) {
                    return `<${p.name}>`
                }
                return `[--${p.name}=<${p.name}>]`
            })
            this.println(`usage: ${command.name} ${paramsString.join(' ')}`)
            this.println('')
            const maxLength = command.parameters.reduce((max, param) => Math.max(max, param.name.length), 0)
            command.parameters.forEach(p => {
                this.println(`\t${p.name.padEnd(maxLength)} : ${p.description}`)
            })
            this.println(``)
            this.prompt()
            return
        }

        // Parse parameters
        let {missingParameters, parameters} = this.parseParams(command, commandParts);
        console.log(missingParameters, parameters)
        if (parameters.find(p => p === false) !== undefined || missingParameters.length > 0) { // error parsing parameters
            this.println(`invalid arguments. try \`${command.name} -h to see usage\``)
            this.prompt()
            return
        }

        // Execute command
        this.promptCancel()
        command.handler(parameters, this, new Promise((resolve, reject) => this.abortSignal = resolve))
    }

    parseParams(command, commandParts) {
        let requiredParameters = command.parameters.filter(p => p.required)
        const parameters = commandParts.map(part => {
            let name = '', value = ''
            // Optional parameters
            if (part.startsWith('-')) {
                const foundBoolean = command.parameters.find(p => p.is_boolean && (`--${p.name}` === part || `-${p.name[0]}` === part))
                // Boolean argument
                if (foundBoolean) {
                    name = foundBoolean.name
                    return {name}
                }
                // Non boolean arguments
                const paramParts = part.split('=')
                const found = command.parameters.find(p => `--${p.name}` === paramParts[0])
                if (found) {
                    name = found.name
                    value = paramParts[1]
                    // Validate value
                    const validator = new RegExp(found.param_validator_regex);
                    if (!validator.test(value)) {
                        return false
                    }
                    return {name, value}
                }

                return false
            }
            // Required parameters
            if (requiredParameters.length === 0) {
                return false
            }
            const param = requiredParameters.shift()
            // Validate value
            const validator = new RegExp(param.param_validator_regex);
            if (!validator.test(part)) {
                return false
            }
            name = param.name
            value = part

            return {name, value}
        })
        return {missingParameters: requiredParameters, parameters};
    }

    autocomplete(index, tokens) {
        if (index !== 0) {
            return []
        }
        if (tokens.length === 0) {
            return []
        }
        const input = tokens.shift()

        const commands = this.commands.filter(com => com.name.startsWith(input))
        return commands.map(c => c.name)
    }

    done() {
        this.localEcho.abortRead("done")
        this.abortSignal = null
        this.prompt()
    }

    abort() {
        this.abortSignal()
        this.done()
    }
}
