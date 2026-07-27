import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

// The first value will be a mutex flag, the second will be our counter
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2);

const view = new Int32Array(shared);

function startWorker(withMutex: boolean) {
    return new Promise<void>(resolve => {
        const worker = new Worker(join(import.meta.dirname, 'mutex.worker'), {
            workerData: {
                shared,
                withMutex
            }
        });

        worker.on('message', async () => {
            await worker.terminate();
            resolve();
        });
    });
}

async function startNoMutex(workers: number) {
    view[1] = 0;

    await Promise.all(Array(workers).fill(0).map(_ => startWorker(false)));

    console.log(view[1]);
}

async function startWorkers() {
    const workers = 5;

    await Promise.all(Array(workers).fill(0).map(_ => startWorker(true)));

    // The mutexes guarantee that the result will be equal to workers * 100_000
    console.log(view[1]);

    view[1] = 0;

    // If we try the same thing without mutexes...
    await startNoMutex(workers);
    await startNoMutex(workers);
    await startNoMutex(workers);
    await startNoMutex(workers);
    // ...the result is no longer consistent because of race conditions
}

startWorkers();