import {observable} from 'mobx'
import {COMMAND, RESULT} from "./components/OutputList";


export default class Terminator {
    @observable items = []
    @observable executing = false
    @observable fullScreenMode = false
    commands
    @observable input = ""
    @observable fullScreenContent = ""
    abortSignal

    constructor(commands) {
        this.commands = commands;
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

        const commandParts = commandInput.trim().split(" ")
        // Grab first word
        const commandStr = commandParts.shift() || ""

        this.addExecution(commandStr)
        if (commandStr === "") {
            return
        }
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
