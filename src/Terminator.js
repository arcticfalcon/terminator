import {observable} from 'mobx'
import {COMMAND, RESULT} from "./components/OutputList";

const internalCommands = [
    {
        "name": "help",
        "description": "List available commands",
        "handler": (params, terminator, abortSignal) => {
            terminator.addResult("Commands")
            terminator.commands.forEach(com => terminator.addResult(`  ${com.name}\t\t${com.description}`))
            terminator.done()
        }
    },
    {
        "name": "history",
        "description": "List executed commands",
        "handler": (params, terminator, abortSignal) => {
            terminator.history.forEach((h, i) => h ? terminator.addResult(`  ${i}  ${h}`) : false)
            terminator.done()
        }
    },
]

export default class Terminator {
    history = [""]
    historyCurrent = 0
    @observable items = []
    @observable executing = false
    @observable fullScreenMode = false
    commands
    @observable input = ""
    @observable fullScreenContent = ""
    abortSignal

    constructor(commands) {
        this.commands = [...internalCommands, ...commands];
    }

    addExecution(content) {
        this.items.push({
            type: COMMAND,
            content
        })
    }

    addResult(content) {
        this.items.push({
            type: RESULT,
            content
        })
    }

    startFullScreenMode() {
        this.fullScreenMode = true
    }

    setFullScreenContent(content) {
        this.fullScreenContent = content
    }

    execute(commandInput) {
        if (this.executing) {
            return
        }
        commandInput = commandInput.trim()
        this.addExecution(commandInput)
        if (commandInput === "") {
            return
        }

        // Event command
        if(commandInput.startsWith("!")) {
            const index = Number(commandInput.replace("!", ""))
            if(isFinite(index)) {
                if(index <= 0 || index >= this.history.length) {
                    // Error
                    this.addExecution(commandInput)
                    this.addResult(`${commandInput}: event not found`)
                    this.input = ""
                    return
                }
                // Execute from history
                commandInput = this.history[index]
                this.addResult(commandInput)
            }
        }

        // Add to history
        this.history.push(commandInput)

        // Grab first word
        const commandParts = commandInput.split(" ")
        const commandStr = commandParts.shift() || ""
        // Find command
        const command = this.commands.filter(com => com.name === commandStr).shift()
        if (!command) {
            // Error
            this.addResult(`${commandStr}: command not found`)
        }

        // execute command
        if (command) {
            this.executing = true
            command.handler([], this, new Promise((resolve, reject) => this.abortSignal = resolve)) // ToDo add command params
        }

        this.input = ""
    }

    autocomplete() {
        if (this.input === "") {
            return
        }

        const commands = this.commands.filter(com => com.name.startsWith(this.input))
        // Multiple matches, show command list
        if (commands.length > 1) {
            this.addExecution(this.input)
            this.addResult(commands.map(c => `${c.name}\n`))
        }
        // Complete command
        if (commands.length === 1) {
            this.setInput(`${commands.shift().name} `)
        }
    }

    historyUp() {
        if (this.historyCurrent === 0) {
            this.historyCurrent = this.history.length
        }
        this.historyCurrent = this.historyCurrent <= 1 ? this.historyCurrent : this.historyCurrent - 1
        this.setInput(this.history[this.historyCurrent])
    }
    historyDown() {
        if (this.historyCurrent === 0) {
            return
        }
        this.historyCurrent = this.historyCurrent >= this.history.length - 1 ? 0 : this.historyCurrent + 1
        this.setInput(this.history[this.historyCurrent])
    }

    setInput(str) {
        if (this.executing) {
            return
        }
        this.input = str
    }

    done() {
        this.executing = false
        this.abortSignal = null
        this.fullScreenMode = false
        this.fullScreenContent = ''
    }

    abort() {
        this.abortSignal()
        this.done()
    }
}
