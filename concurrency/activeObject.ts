import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

type ActiveCalculatorMethod = 'add' | 'multiply' | 'factorial';

interface Task {
    id: number;
    method: ActiveCalculatorMethod;
    args: number[];
}

interface PendingTask {
    resolve: (result: number) => void;
    reject: (error: Error) => void;
}

// This pattern can also be nicely combined with the Thread Pool pattern,
// allowing multiple threads to work at once
class ActiveCalculator {
    private worker: Worker;
    private taskId: number = 1;
    private pending: Map<number, PendingTask> = new Map();
    private tasks: Task[] = [];
    private busy: boolean = false;

    constructor (workerPath: string) {
        this.worker = new Worker(workerPath);

        this.worker.on('message', (message) => {
            const { id, result, error } = message;

            const pending = this.pending.get(id);
            if (!pending) return;

            if (error) {
                pending.reject(new Error(error));
            } else {
                pending.resolve(result);
            }

            this.pending.delete(id);

            this.busy = false;
            this.schedule();
        });
    }

    // Invokes a method on the worker and returns a Promise, which can be awaited for the result
    // Since we have the add, multiply, and factorial methods, this method can be private
    // This also prevents the client from invoking a method that does not exist
    private invoke(method: ActiveCalculatorMethod, ...args: number[]) {
        return new Promise<number>((resolve, reject) => {
            const id = this.taskId++;

            const task = {
                id,
                method,
                args
            };

            this.pending.set(id, { resolve, reject });
            this.tasks.push(task);

            this.schedule();
        });
    }

    // Tries to send the next queued task to the worker
    // This implementation also uses the Balking pattern (this.busy)
    private schedule() {
        if (this.busy) return;
        if (this.tasks.length === 0) return;

        this.busy = true;

        const request = this.tasks.shift();
        this.worker.postMessage(request);
    }

    // A nice interface so we can easily execute these methods
    add(a: number, b: number) {
        return this.invoke('add', a, b);
    }

    multiply(a: number, b: number) {
        return this.invoke('multiply', a, b);
    }

    factorial(n: number) {
        return this.invoke('factorial', n);
    }

    // Terminates the worker
    // This is not really a production implementation, as it does not allow for graceful closing
    // You can find more information about this in comments of the Thread Pool pattern
    async close() {
        await this.worker.terminate();
    }
}

async function calculate() {
    const calculator = new ActiveCalculator(join(import.meta.dirname, 'activeObject.worker'));

    const results = await Promise.all([
        calculator.add(10, 20),
        calculator.multiply(500, 700),
        calculator.factorial(10) 
    ]);

    console.log(results);

    await calculator.close();
}

calculate();