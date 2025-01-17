"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
const worker_threads_1 = require("worker_threads");
class TaskQueue {
    queue = [];
    MAX_WORKERS = 4;
    activeTasks = 0;
    addTask(task) {
        this.queue.push(task);
        this.processQueue();
    }
    async processQueue() {
        if (this.queue.length === 0 || this.activeTasks >= this.MAX_WORKERS)
            return;
        const task = this.queue.shift();
        if (!task)
            return;
        this.activeTasks++;
        const worker = new worker_threads_1.Worker('./worker.js', {
            workerData: task.interactionData, // Envia apenas dados simples
        });
        worker.on('message', async (result) => {
            try {
                await task.execute(result);
            }
            finally {
                this.activeTasks--;
                this.processQueue();
            }
        });
        worker.on('error', (err) => {
            console.error('Erro no worker:', err);
            this.activeTasks--;
            this.processQueue();
        });
        worker.on('exit', (code) => {
            if (code !== 0)
                console.error(`Worker finalizou com código ${code}`);
            this.activeTasks--;
            this.processQueue();
        });
    }
}
exports.TaskQueue = TaskQueue;
