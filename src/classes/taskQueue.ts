import { Worker } from 'worker_threads'

export type Task = {
    interactionData: any,
    execute: (interactionData: any) => Promise<void>
}

export class TaskQueue {
    private queue: Task[] = []
    private MAX_WORKERS = 4
    private activeTasks = 0

    public addTask(task: Task) {
        this.queue.push(task)
        this.processQueue()
    }

    private async processQueue() {
        if (this.queue.length === 0 || this.activeTasks >= this.MAX_WORKERS) return

        const task = this.queue.shift()
        if (!task) return

        this.activeTasks++

        const worker = new Worker('./worker.js', {
            workerData: task.interactionData, // Envia apenas dados simples
        })

        worker.on('message', async (result) => {
            try {
                await task.execute(result)
            } finally {
                this.activeTasks--
                this.processQueue()
            }
        })

        worker.on('error', (err) => {
            console.error('Erro no worker:', err)
            this.activeTasks--
            this.processQueue()
        })

        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker finalizou com código ${code}`)
            this.activeTasks--
            this.processQueue()
        })
    }
}