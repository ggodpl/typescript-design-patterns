// If we have a function that takes arguments, we can partially apply some arguments
// For example, the function below will take any function and the first argument,
// and will return a new function that already has the first argument applied
const partial = <A, B extends unknown[], R>(fn: (arg: A, ...args: B) => R, firstArg: A) => (...lastArgs: B) => fn(firstArg, ...lastArgs);

// This is especially useful if we have functions whose first argument is the config...
const list = (lastSeparator: string, ...items: string[]) => `${items.slice(0, -1).join(', ')} ${lastSeparator} ${items.at(-1)}`;
// ...meaning we can store preconfigured version of such function as separate functions...
const listAnd = partial(list, 'and');
const listWith = partial(list, 'with');

// ...and use them easily
console.log(listAnd('a', 'b', 'c'));
console.log(listWith('a', 'b', 'c'));