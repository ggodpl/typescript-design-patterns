// Instead of having a function that takes multiple arguments we can have a chain of functions with each taking one
const add = (a: number) => (b: number) => a + b;

const result = add(4)(5);
console.log(result);

// This makes the functions way more reusable
const add4 = add(4);
console.log(add4(3));
console.log(add4(4));
console.log(add4(5));
console.log(add4(6));