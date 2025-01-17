import { parentPort } from 'worker_threads'
import { CommandInteraction, Message } from 'discord.js'

parentPort?.on('message', async (task: { interaction: CommandInteraction | Message; execute: (interaction: CommandInteraction | Message) => Promise<void> }) => {
    try {
        await task.execute(task.interaction)
        parentPort?.postMessage('done')
    } catch (err) {
        console.error('Erro ao executar tarefa no worker:', err)
        parentPort?.postMessage('error')
    }
})