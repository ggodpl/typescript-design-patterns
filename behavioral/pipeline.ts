interface Operation<T> {
    transform(data: T): T;
}

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

simpleStringPipeline.attach(
    new CallbackOperation(data => {
        console.log('Replacing "e" with "a"');
        return data.replaceAll('e', 'a');
    })
);

console.log(simpleStringPipeline.transform('   test   '));

const advancedStringPipeline = new Pipeline<string>([
    simpleStringPipeline,
    new CallbackOperation(data => {
        console.log('Adding "world!"');
        return data + ' world!';
    })
]);

console.log(advancedStringPipeline.transform('   hello   '));