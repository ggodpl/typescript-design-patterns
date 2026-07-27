import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

const worker = new Worker(join(import.meta.dirname, 'guardedSuspension.worker'), {
    workerData: shared
});

worker.postMessage({
    type: 'save'
});

worker.postMessage({
    type: 'save'
});

setTimeout(async () => {
    await worker.terminate();
}, 5000);