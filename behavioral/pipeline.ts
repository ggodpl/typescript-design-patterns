// All pipeline operations and the pipeline itself implement the same interface
// This way we can later chain pipelines
interface Operation<T> {
    transform(data: T): T;
}

// A simple operation that uses a callback so we don't have to use classes
class CallbackOperation<T> implements Operation<T> {
    constructor (private callback: (data: T) => T) {}

    transform(data: T): T {
        return this.callback(data);
    }
}

class Pipeline<T> implements Operation<T> {
    constructor (private operations: Operation<T>[]) {}

    attach(operation: Operation<T>) {
        this.operations.push(operation);
    }

    transform(data: T): T {
        // The data is transformed by transforming it using every pipeline operation one-by-one
        let current = data;
        for (const operation of this.operations) {
            current = operation.transform(current);
        }

        return current;
    }
}

const simpleStringPipeline = new Pipeline<string>([
    new CallbackOperation(data => {
        console.log('Trimming');
        return data.trim();
    }),
    new CallbackOperation(data => {
        console.log('Reversing');
        return data.split('').reverse().join('');
    })
]);

// We can attach pipeline operations later
simpleStringPipeline.attach(
    new CallbackOperation(data => {
        console.log('Replacing "e" with "a"');
        return data.replaceAll('e', 'a');
    })
);

console.log(simpleStringPipeline.transform('   test   '));

// We can also use existing pipelines as operations of new pipelines
const advancedStringPipeline = new Pipeline<string>([
    simpleStringPipeline,
    new CallbackOperation(data => {
        console.log('Adding "world!"');
        return data + ' world!';
    })
]);

console.log(advancedStringPipeline.transform('   hello   '));