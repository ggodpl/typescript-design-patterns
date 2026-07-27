import { parentPort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

parentPort.on('message', async ({ id, method, args }) => {
    try {
        let result;

        switch (method) {
            case 'add':
                await sleep(1000);
                result = args[0] + args[1];
                break;
            case 'multiply':
                await sleep(1500);
                result = args[0] * args[1];
                break;
            case 'factorial':
                result = factorial(args[0]);
                break;
            default:
                throw new Error('Invalid method');
        }

        parentPort!.postMessage({
            id,
            result
        });
    } catch (error) {
        parentPort!.postMessage({
            id,
            error
        });
    }
});

function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function factorial(n: number): number {
    if (n < 2) return 1;
    return n * factorial(n - 1);
}