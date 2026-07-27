interface Aggregate<T> {
    createIterator(): IterableIterator<T>;
}

class Employee {
    constructor (public name: string, public salary: number) {}
}

class EmployeeIterator implements IterableIterator<Employee> {
    private currentIndex: number = 0;

    constructor (private employees: Employee[]) {}

    [Symbol.iterator](): this {
        return this;
    }

    next(): IteratorResult<Employee> {
        if (this.currentIndex < this.employees.length) {
            return {
                done: false,
                value: this.employees[this.currentIndex++]
            }
        } else {
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

let employee = iterator.next();
while (!employee.done) {
    const { name, salary } = employee.value;
    console.log(`${name} - ${salary} USD`);
    employee = iterator.next();
}

const iterator2 = company.createIterator();

for (const employee of iterator2) {
    const { name, salary } = employee;
    console.log(`${name} - ${salary} USD`);
}