// Represents a specific state
class Memento {
    constructor (private readonly state: string) {}

    getState() {
        return this.state;
    }
}

class Originator {
    // Current state
    private state: string = '';

    // Overwrites the current state with a new one
    setState(state: string) {
        console.log('New state: ' + state);
        this.state = state;
    }

    // Saves the current state as an immutable memento
    save() {
        console.log('Storing state to memento: ' + this.state);
        return new Memento(this.state);
    }

    // Restores it from the memento
    restore(memento: Memento) {
        console.log('Loading state from memento: ' + memento.getState());
        this.setState(memento.getState());
    }
}

// Stores the history of snapshots
class Caretaker {
    private history: Memento[] = [];

    add(snapshot: Memento) {
        this.history.push(snapshot);
    }

    get(index: number) {
        return this.history[index];
    }
}

const caretaker = new Caretaker();
const originator = new Originator();

originator.setState('1');
originator.setState('2');

caretaker.add(originator.save());

originator.setState('3');

caretaker.add(originator.save());

originator.restore(caretaker.get(0));