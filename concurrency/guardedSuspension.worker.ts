import { parentPort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

async function saveToDatabase() {
    console.log('Saving to the database...');
    await sleep(2000);
    console.log('Saved');
}

function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

let saving = false;

parentPort.on('message', async (message) => {
    if (message.type !== 'save') return;

    // If the worker is busy
    while (saving) {
        // We just wait and try again
        await sleep(100);
    }
    
    // We mark the worker as busy...
    saving = true;

    try {
        // ...do what we were supposed to do...
        await saveToDatabase();
    } finally {
        // ...and unmark it
        saving = false;
    }
});