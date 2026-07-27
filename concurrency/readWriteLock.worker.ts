import { workerData, parentPort, threadId } from 'node:worker_threads';

if (!parentPort) throw new Error('This file can only run as a worker');

class RwLock {
    constructor (private state: Int32Array) {}

    readLock() {
        while (true) {
            while (Atomics.load(this.state, 1) === 1)
                Atomics.wait(this.state, 1, 1);

            Atomics.add(this.state, 0, 1);

            if (Atomics.load(this.state, 1) === 0) return;

            Atomics.sub(this.state, 0, 1);
        }
    }

    readUnlock() {
        if (Atomics.sub(this.state, 0, 1) === 1)
            Atomics.notify(this.state, 0);
    }

    writeLock() {
        while (true) {
            if (Atomics.compareExchange(this.state, 1, 0, 1) === 0) {
                while (Atomics.load(this.state, 0) !== 0) 
                    Atomics.wait(this.state, 0, Atomics.load(this.state, 0));

                return;
            }

            Atomics.wait(this.state, 1, 1);
        }
    }

    writeUnlock() {
        Atomics.store(this.state, 1, 0);

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