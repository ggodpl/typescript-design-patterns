import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

const view = new Int32Array(shared);
// We set the initial number of permits
// This is the amount of threads that can work simultaneously 
view[0] = 3;

async function startWorkers() {
    const workers = 9;

    // We spawn 9 workers
    // Despite that, only 3 workers will be able to work at the same time
    for (let i = 0; i < workers; i++) {
        new Worker(join(import.meta.dirname, 'semaphore.worker'), {
            workerData: shared
        });
    }
}

startWorkers();