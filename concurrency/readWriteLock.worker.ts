import { workerData, parentPort, threadId } from 'node:worker_threads';

if (!parentPort) throw new Error('This file can only run as a worker');

class RwLock {
    constructor (private state: Int32Array) {}

    readLock() {
        while (true) {
            // If the write flag is set, wait
            while (Atomics.load(this.state, 1) === 1)
                Atomics.wait(this.state, 1, 1);

            // Add a reader
            Atomics.add(this.state, 0, 1);

            // If the write flag is not set, we can read
            if (Atomics.load(this.state, 1) === 0) return;

            // Otherwise we subtract a reader
            Atomics.sub(this.state, 0, 1);
        }
    }

    readUnlock() {
        // We subtract a reader and notify if there are no more readers left
        if (Atomics.sub(this.state, 0, 1) === 1)
            Atomics.notify(this.state, 0);
    }

    writeLock() {
        while (true) {
            // Set the write flag if it's not set
            if (Atomics.compareExchange(this.state, 1, 0, 1) === 0) {
                // We wait until there are no readers left...
                while (Atomics.load(this.state, 0) !== 0) 
                    Atomics.wait(this.state, 0, Atomics.load(this.state, 0));

                // ...and the write lock is set up
                return;
            }

            // Otherwise, we wait for the write lock to be released
            Atomics.wait(this.state, 1, 1);
        }
    }

    writeUnlock() {
        // We reset the write flag
        Atomics.store(this.state, 1, 0);

        // And notify both writers and readers
        Atomics.notify(this.state, 1);
        Atomics.notify(this.state, 0);
    }
}

const rwLock = new RwLock(new Int32Array(workerData));

rwLock.readLock();
console.log(`Reading at thread #${threadId}`);
rwLock.readUnlock();
console.log(`Reading finished (#${threadId})`);

rwLock.writeLock();
console.log(`Writing at thread #${threadId}`);
rwLock.writeUnlock();
console.log(`Writing finished (#${threadId})`);