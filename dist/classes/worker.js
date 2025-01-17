"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
worker_threads_1.parentPort?.on('message', async (task) => {
    try {
        await task.execute(task.interaction);
        worker_threads_1.parentPort?.postMessage('done');
    }
    catch (err) {
        console.error('Erro ao executar tarefa no worker:', err);
        worker_threads_1.parentPort?.postMessage('error');
    }
});
