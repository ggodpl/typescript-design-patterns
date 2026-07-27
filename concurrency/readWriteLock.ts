import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2);

async function startWorkers() {
    const workers = 9;

    for (let i = 0; i < workers; i++) {
        new Worker(join(import.meta.dirname, 'readWriteLock.worker'), {
            workerData: shared
        });
    }
}

startWorkers();