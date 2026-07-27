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
        return new Promise(resolve => {
            this.results.set(task, {
                resolve
            });

            this.tasks.push(task);

            this.schedule();
        });
    }
    
    schedule() {
        if (this.tasks.length === 0) return;

        const task = this.tasks.shift()!;
        const result = this.results.get(task);
        if (!result) return;
        
        const calculated = this.executor.execute(task);
        result.resolve(calculated);

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