interface Counter {
    increment(): void;
    decrement(): void;
    currentValue(): number;
}

const counter: Counter = (() => {
    let value = 0;

    const logValue = () => {
        console.log(`Current value: ${value}`);
    }

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

counter.increment();
counter.decrement();
console.log(counter.currentValue());