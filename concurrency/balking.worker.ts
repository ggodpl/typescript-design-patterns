import { parentPort } from 'node:worker_threads';

if (parentPort === null) throw new Error('This file can only run as a worker');

async function saveToDatabase() {
    console.log('Saving to the database...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Saved');
}

let saving = false;

parentPort.on('message', async (message) => {
    if (message.type !== 'save') return;
    if (saving) return; // Worker busy, we balk and return early

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