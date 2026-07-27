import { workerData, parentPort, threadId } from 'node:worker_threads';

if (!parentPort) throw new Error('This file can only run as a worker');

class Semaphore {
    constructor (private permits: Int32Array) {}

    acquire() {
        while (true) {
            const current = Atomics.load(this.permits, 0);

            if (current > 0 && Atomics.compareExchange(this.permits, 0, current, current - 1) === current) return;

            Atomics.wait(this.permits, 0, 0);
        }
    }

    release() {
        Atomics.add(this.permits, 0, 1);
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