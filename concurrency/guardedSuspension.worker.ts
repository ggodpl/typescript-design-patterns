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

    while (saving) {
        await sleep(100);
    }
    
    saving = true;

    try {
        await saveToDatabase();
    } finally {
        saving = false;
    }
});