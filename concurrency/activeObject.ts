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

    private schedule() {
        if (this.busy) return;
        if (this.tasks.length === 0) return;

        this.busy = true;

        const request = this.tasks.shift();
        this.worker.postMessage(request);
    }

    add(a: number, b: number) {
        return this.invoke('add', a, b);
    }

    multiply(a: number, b: number) {
        return this.invoke('multiply', a, b);
    }

    factorial(n: number) {
        return this.invoke('factorial', n);
    }

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