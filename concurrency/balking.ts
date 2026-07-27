import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const worker = new Worker(join(import.meta.dirname, 'balking.worker'));

worker.postMessage({
    type: 'save'
});

worker.postMessage({
    type: 'save'
});

setTimeout(async () => {
    await worker.terminate();
}, 5000);