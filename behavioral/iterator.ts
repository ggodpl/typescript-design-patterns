// An aggregate creates iterators
interface Aggregate<T> {
    createIterator(): IterableIterator<T>;
}

class Employee {
    constructor (public name: string, public salary: number) {}
}

// Iterators let us iterate over them by returning the next value
class EmployeeIterator implements IterableIterator<Employee> {
    private currentIndex: number = 0;

    constructor (private employees: Employee[]) {}

    // This symbol allows us to use this iterator as an actual JavaScript iterator
    [Symbol.iterator](): this {
        return this;
    }

    // Returns the next value
    next(): IteratorResult<Employee> {
        // If there are employees left...
        if (this.currentIndex < this.employees.length) {
            // ...we just return the value and we tell the engine that iteration is not done yet
            return {
                done: false,
                value: this.employees[this.currentIndex++]
            }
        } else {
            // Otherwise, the iteration is done and there are no more values
            return {
                done: true,
                value: undefined
            }
        }
    }
}

class Company implements Aggregate<Employee> {
    constructor (private employees: Employee[]) {}

    createIterator(): IterableIterator<Employee> {
        return new EmployeeIterator(this.employees);
    }
}

const employees = [
    new Employee('John', 10000),
    new Employee('Sarah', 12000),
    new Employee('Bob', 23000)
]

const company = new Company([...employees]);
const iterator = company.createIterator();

// We keep iterating until there are no more employees left
let employee = iterator.next();
while (!employee.done) {
    const { name, salary } = employee.value;
    console.log(`${name} - ${salary} USD`);
    employee = iterator.next();
}

const iterator2 = company.createIterator();

// We can also use for loops
for (const employee of iterator2) {
    const { name, salary } = employee;
    console.log(`${name} - ${salary} USD`);
}