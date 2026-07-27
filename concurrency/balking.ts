import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const worker = new Worker(join(import.meta.dirname, 'balking.worker'));

// This message will get processed 
// because the worker is not currently busy
worker.postMessage({
    type: 'save'
});

// This message will get ignored
worker.postMessage({
    type: 'save'
});

setTimeout(async () => {
    await worker.terminate();
}, 5000);