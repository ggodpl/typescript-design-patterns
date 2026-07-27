enum TaskType {
    Add,
    Multiply,
    Factorial
}

type Task =
    | { type: TaskType.Add; a: number; b: number }
    | { type: TaskType.Multiply; a: number; b: number }
    | { type: TaskType.Factorial; n: number };

interface TaskResult {
    resolve(result: number): void;
}

class TaskExecutor {
    private factorial(n: number): number {
        if (n < 2) return 1;
        return n * this.factorial(n - 1);
    }

    execute(task: Task) {
        switch (task.type) {
            case TaskType.Add:
                return task.a + task.b;
            case TaskType.Multiply:
                return task.a * task.b;
            case TaskType.Factorial:
                return this.factorial(task.n);
        }
    }
}

class Scheduler {
    private tasks: Task[] = [];
    private results: Map<Task, TaskResult> = new Map();

    constructor (private executor: TaskExecutor) {}

    enqueue(task: Task) {
        // We return a new promise so the task can be awaited
        // This ignores the possibility that the task failed (because, in this example, it actually can't)
        // and can only resolve. For an example of a scheduler that can actually reject,
        // view the Thread Pool example
        return new Promise(resolve => {
            // We store the Promise resolution function,
            this.results.set(task, {
                resolve
            });

            // Push the task into the queue,
            this.tasks.push(task);

            // And schedule
            this.schedule();
        });
    }
    
    schedule() {
        if (this.tasks.length === 0) return;

        // We take the first task (FIFO)...
        const task = this.tasks.shift()!;
        const result = this.results.get(task);
        if (!result) return;
        
        // ...execute it...
        const calculated = this.executor.execute(task);
        // ...resolve the Promise...
        result.resolve(calculated);

        // ...and schedule again
        this.schedule();
    }
}

const executor = new TaskExecutor();
const scheduler = new Scheduler(executor);

const task1 = scheduler.enqueue({
    type: TaskType.Factorial,
    n: 10
});

const task2 = scheduler.enqueue({
    type: TaskType.Add,
    a: 10,
    b: 20
});

const task3 = scheduler.enqueue({
    type: TaskType.Multiply,
    a: 30,
    b: 40
});

console.log(await task1);
console.log(await task2);
console.log(await task3);