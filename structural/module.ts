interface Counter {
    increment(): void;
    decrement(): void;
    currentValue(): number;
}

// We can group multiple connected elements...
const counter: Counter = (() => {
    // ...including private...
    let value = 0;

    const logValue = () => {
        console.log(`Current value: ${value}`);
    }

    // ...as well as public (revealed) ones...
    return {
        increment() {
            value += 1;
            logValue();
        },
        decrement() {
            value -= 1;
            logValue();
        },
        currentValue(): number {
            return value;
        }
    }
})();

// ...into a single entity
counter.increment();
counter.decrement();
console.log(counter.currentValue());