import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

const view = new Int32Array(shared);
view[0] = 3;

async function startWorkers() {
    const workers = 9;

    for (let i = 0; i < workers; i++) {
        new Worker(join(import.meta.dirname, 'semaphore.worker'), {
            workerData: shared
        });
    }
}

startWorkers();