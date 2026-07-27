const partial = <A, B extends unknown[], R>(fn: (arg: A, ...args: B) => R, firstArg: A) => (...lastArgs: B) => fn(firstArg, ...lastArgs);

const list = (lastSeparator: string, ...items: string[]) => `${items.slice(0, -1).join(', ')} ${lastSeparator} ${items.at(-1)}`;
const listAnd = partial(list, 'and');
const listWith = partial(list, 'with');

console.log(listAnd('a', 'b', 'c'));
console.log(listWith('a', 'b', 'c'));