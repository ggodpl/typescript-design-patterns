interface Observer {
    update(): void;
}

class Subject {
    private state: string = '';
    private observers: Set<Observer> = new Set();

    setState(state: string) {
        this.state = state;
        this.notify();
    }

    getState() {
        return this.state;
    }

    attach(observer: Observer) {
        this.observers.add(observer);
    }

    detach(observer: Observer) {
        this.observers.delete(observer);
    }

    notify() {
        for (const observer of this.observers) {
            observer.update();
        }
    }
}

class CallbackObserver implements Observer {
    constructor (private callback: () => void) {}

    update() {
        this.callback();
    }
}

const subject = new Subject();
const observer1 = new CallbackObserver(() => {
    console.log('New state observed in Observer 1: ' + subject.getState());
});
const observer2 = new CallbackObserver(() => {
    console.log('New state observed in Observer 2: ' + subject.getState());
});

subject.setState('1'); // No observers attached, nothing is logged

subject.attach(observer1);
subject.attach(observer2);

subject.setState('2'); // Both observers notified
subject.setState('3'); // Both observers notified

subject.detach(observer1);

subject.setState('4'); // Only observer 2 notified