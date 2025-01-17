import { CommandInteraction, Message } from 'discord.js'

export type Task = {
    execute: (interaction: CommandInteraction | Message) => Promise<void>
    parameter: CommandInteraction | Message
}

export class TaskQueue {
    private queue: Task[] = []
    private isProcessing = false

    public addTask(task: (interaction: CommandInteraction | Message) => Promise<void>, parameter: CommandInteraction | Message) {
        this.queue.push({ execute: task, parameter: parameter })
        this.processQueue()
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return

        this.isProcessing = true
        
        const task = this.queue.shift()

        if(task) {
            try {
                await task.execute(task.parameter)
            } catch (err) {
                console.error('Erro ao processar tarefa:', err)
            }
        }

        this.isProcessing = false
        this.processQueue()
    }
}