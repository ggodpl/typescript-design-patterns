type Payload =
    | { type: 'BalanceSet'; value: number }
    | { type: 'AccountNameSet'; value: string };

interface Event {
    eventId: number;
    accountId: number;
    validDate: number;
    payload: Payload;
}

type StoredEvent = Event & {
    transactionDate: number;
    storePosition: number;
    transactionId: number;
}

class EventStore {
    private events: StoredEvent[] = [];
    private storePosition: number = 1;
    private transactionId: number = 1;

    enter(...events: Event[]) {
        // When we enter events they all get the same transaction date...
        const now = Date.now();
        // ...and transaction ID
        const transaction = this.transactionId++;

        for (const event of events) {
            const storedEvent = {
                ...event,
                transactionDate: now,
                transactionId: transaction,
                storePosition: this.storePosition++
            };

            this.events.push(storedEvent);
        }
    }

    // We can either sort events by the transaction date (when they were entered)...
    byTransaction() {
        return [...this.events].sort((a, b) => a.transactionId === b.transactionId ? a.storePosition - b.storePosition : a.transactionId - b.transactionId);
    }

    // ...or by their valid date (when they became valid)
    // This is lets us achieve bitemporal modeling...
    byValid() {
        return [...this.events].sort((a, b) => a.validDate === b.validDate ? a.storePosition - b.storePosition : a.validDate - b.validDate);
    }
}

const store = new EventStore();

const event1: Event = {
    payload: {
        type: 'AccountNameSet',
        value: 'John'
    },
    eventId: 1,
    accountId: 1,
    validDate: Date.now()
};

const erroneousEvent: Event = {
    payload: {
        type: 'BalanceSet',
        value: 100
    },
    eventId: 2,
    accountId: 1,
    validDate: Date.now()
};

store.enter(event1, erroneousEvent);

await new Promise(resolve => setTimeout(resolve, 100));

// ...which is very useful when correcting past events
// Since events are immutable, we create a correction event in a later transaction...
const correctionEvent: Event = {
    payload: {
        type: 'BalanceSet',
        value: 200
    },
    eventId: 3,
    accountId: 1,
    // ...that has the same valid date as the erroneous event
    validDate: erroneousEvent.validDate
};

store.enter(correctionEvent);

console.log(store.byTransaction());