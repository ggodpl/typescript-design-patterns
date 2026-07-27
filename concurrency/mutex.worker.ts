import { workerData, parentPort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

class Mutex {
    constructor (private view: Int32Array) {}

    lock() {
        // Set the mutex flag if it's not set yet
        while (Atomics.compareExchange(this.view, 0, 0, 1) !== 0) {
            // Otherwise, wait for it to be unlocked
            Atomics.wait(this.view, 0, 1);
        }
    }

    unlock() {
        // Reset the mutex flag
        Atomics.store(this.view, 0, 0);
        // And notify about the unlock
        Atomics.notify(this.view, 0, 1);
    }

    access() {
        return this.view;
    }
}

// For demonstration purposes, the client can request that the worker works either without mutexes...
if (!workerData.withMutex) {
    const view = new Int32Array(workerData.shared);

    for (let i = 0; i < 100_000; i++) {
        // This is actually 3 different operations: load, add, and store
        // If 2 threads load at the same time, an increment will be lost
        view[1]++;
    }

    parentPort.postMessage('Finished!');
} else {
    // ...or with them
    const mutex = new Mutex(new Int32Array(workerData.shared));

    for (let i = 0; i < 100_000; i++) {
        // We lock the shared state
        mutex.lock();

        // Now we can access and modify it however we want
        // Other threads attempting to acquire the mutex will be blocked until we release
        const view = mutex.access();
        // Since this is just an increment it could itself be replaced by a single atomic operation
        // But this is just a demonstration of the mutex, which would work even if this was a more complex example
        view[1]++;

        // We unlock the state to let others mutate
        // An alternative solution would be locking before the loop and unlocking afterwards, 
        // but this serializes the loop, which means only one thread can work at a time
        mutex.unlock();
    }

    parentPort.postMessage('Finished!');
}