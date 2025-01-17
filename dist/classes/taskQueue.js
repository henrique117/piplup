"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
class TaskQueue {
    queue = [];
    isProcessing = false;
    addTask(task, parameter) {
        this.queue.push({ execute: task, parameter: parameter });
        this.processQueue();
    }
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        const task = this.queue.shift();
        if (task) {
            try {
                await task.execute(task.parameter);
            }
            catch (err) {
                console.error('Erro ao processar tarefa:', err);
            }
        }
        this.isProcessing = false;
        this.processQueue();
    }
}
exports.TaskQueue = TaskQueue;
