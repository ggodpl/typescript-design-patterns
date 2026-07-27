import { Worker } from 'node:worker_threads';
import { join } from 'node:path';

interface Task<T, R> {
    id: number;
    data: T;
    resolve: (result: R) => void;
    reject: (error: Error) => void;
}

type Result<R> =
    | { id: number; error: string }
    | { id: number; result: R; error: undefined };

class ThreadPool<T, R> {
    private busyThreads: Map<Worker, Task<T, R>> = new Map();
    private idleThreads: Worker[] = [];
    private taskQueue: Task<T, R>[] = [];
    private taskId: number = 1;
    private closed: boolean = false;

    constructor (private size: number, private workerPath: string) {
        this.spawnThreads();
    }

    private spawnThreads() {
        for (let i = 0; i < this.size; i++) {
            this.spawnThread();    
        }
    }

    private spawnThread() {
        const thread = new Worker(this.workerPath);

        thread.on('message', (message) => {
            this.finishTask(thread, message as Result<R>);
        });

        thread.on('error', (err: Error) => {
            this.replace(thread, err);
        });

        thread.on('exit', () => {
            this.replace(thread);
        });

        this.idleThreads.push(thread);
    }

    // We replace dead threads with new ones to keep the original pool size
    private replace(thread: Worker, error?: Error) {
        const task = this.busyThreads.get(thread);

        if (task) {
            task.reject(error ?? new Error('Thread exited'));
            this.busyThreads.delete(thread);
        }

        this.spawnThread();
    }

    execute(data: T) {
        if (this.closed) throw new Error('ThreadPool is already closed');

        return new Promise<R>((resolve, reject) => {
            const task: Task<T, R> = {
                id: this.taskId++,
                data,
                resolve,
                reject
            }

            this.taskQueue.push(task);
            this.schedule();
        });
    }

    private finishTask(thread: Worker, message: Result<R>) {
        const task = this.busyThreads.get(thread)!;
        
        // Important:
        // Return the thread to the pool before invoking callback
        //
        // The callback may synchronously call back into the pool
        // and schedule more work (in which case the thread would appear busy)
        // or close the pool entirely (and we would miss that thread when
        // terminating). Instead, we keep an internally consistent state
        // before handling any client code to avoid reentrance bugs
        this.busyThreads.delete(thread);
        this.idleThreads.push(thread);

        if (message.error !== undefined) {
            task.reject(new Error(message.error));
        } else {
            task.resolve(message.result);
        }

        this.schedule();
    }

    private schedule() {
        while (this.idleThreads.length > 0 && this.taskQueue.length > 0) {
            const thread = this.idleThreads.pop()!;
            const task = this.taskQueue.shift()!;

            console.log(`Handing task #${task.id} to thread #${thread.threadId}`);
            
            this.busyThreads.set(thread, task);

            thread.postMessage({
                id: task.id,
                data: task.data
            });
        }
    }

    // This could be improved by adding a graceful option
    // Which would prevent adding new tasks first (this.closed = true),
    // then drain all the remaining tasks,
    // and after they are all finished, terminate all workers
    async close() {
        this.closed = true;
        await Promise.all([...this.idleThreads, ...this.busyThreads.keys()].map(t => t.terminate()));
    }
}

async function startPool() {
    const threadPool = new ThreadPool<number, number>(3, join(import.meta.dirname, 'threadPool.worker'));

    const jobs = [];

    for (let i = 0; i < 10; i++) {
        jobs.push(threadPool.execute(i * 10_000_000));
    }

    const results = await Promise.all(jobs);

    console.log(results);

    await threadPool.close();
}

startPool();