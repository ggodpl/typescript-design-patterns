import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

const worker = new Worker(join(import.meta.dirname, 'guardedSuspension.worker'), {
    workerData: shared
});

// This message will get processed
worker.postMessage({
    type: 'save'
});

// And so will this one
worker.postMessage({
    type: 'save'
});

setTimeout(async () => {
    await worker.terminate();
}, 5000);