import { workerData, parentPort, threadId } from 'node:worker_threads';

if (!parentPort) throw new Error('This file can only run as a worker');

class Semaphore {
    constructor (private permits: Int32Array) {}

    acquire() {
        while (true) {
            // We check how many permits there are
            const current = Atomics.load(this.permits, 0);

            // If there are permits available and we can successfully
            // decrement by one, we have successfully acquired a semaphore
            if (current > 0 && Atomics.compareExchange(this.permits, 0, current, current - 1) === current) return;

            // We wait as long as there are no permits available
            Atomics.wait(this.permits, 0, 0);
        }
    }

    release() {
        // We release our permit
        Atomics.add(this.permits, 0, 1);
        // And wake up exactly 1 worker that is waiting for the semaphore
        Atomics.notify(this.permits, 0, 1);
    }
}

async function process() {
    console.log(`Thread #${threadId} is currently processing`);
    await new Promise(resolve => setTimeout(resolve, 1000));
}

const view = new Int32Array(workerData)
const semaphore = new Semaphore(view);

semaphore.acquire();
await process();
semaphore.release();