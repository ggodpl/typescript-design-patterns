import { workerData, parentPort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

class Mutex {
    constructor (private view: Int32Array) {}

    lock() {
        while (Atomics.compareExchange(this.view, 0, 0, 1) !== 0) {
            Atomics.wait(this.view, 0, 1);
        }
    }

    unlock() {
        Atomics.store(this.view, 0, 0);
        Atomics.notify(this.view, 0, 1);
    }

    access() {
        return this.view;
    }
}

if (!workerData.withMutex) {
    const view = new Int32Array(workerData.shared);

    for (let i = 0; i < 100_000; i++) {
        view[1]++;
    }

    parentPort.postMessage('Finished!');
} else {
    const mutex = new Mutex(new Int32Array(workerData.shared));

    for (let i = 0; i < 100_000; i++) {
        mutex.lock();

        const view = mutex.access();
        view[1]++;

        mutex.unlock();
    }

    parentPort.postMessage('Finished!');
}