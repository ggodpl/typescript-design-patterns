import { parentPort, threadId } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

parentPort.on('message', async ({ id, data }) => {
    try {
        console.log(`Doing task #${id} in thread #${threadId}`);
        const result = someCalculation(data);

        parentPort!.postMessage({
            id,
            result
        });
    } catch (err) {
        parentPort!.postMessage({
            id,
            error: (err as Error).message
        });
    }
});

function someCalculation(n: number) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += Math.sqrt(i);
    }

    return sum;
}