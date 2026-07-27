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
        const now = Date.now();
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

    byTransaction() {
        return [...this.events].sort((a, b) => a.transactionId === b.transactionId ? a.storePosition - b.storePosition : a.transactionId - b.transactionId);
    }

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

const correctionEvent: Event = {
    payload: {
        type: 'BalanceSet',
        value: 200
    },
    eventId: 3,
    accountId: 1,
    validDate: erroneousEvent.validDate
};

store.enter(correctionEvent);

console.log(store.byTransaction());