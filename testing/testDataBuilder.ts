class Employee {
    constructor (public name: string, public age: number, public email: string, public salary: number) {}

    log() {
        console.log(`Name: ${this.name}`);
        console.log(`Age: ${this.age}`);
        console.log(`E-mail: ${this.email}`);
        console.log(`Salary: ${this.salary}`);
    }
}

class TestEmployeeBuilder {
    public name: string = 'Victor';
    public age: number = 23;
    public email: string = 'victor@example.mail';
    public salary: number = 12000;

    withSalary(salary: number) {
        this.salary = salary;
        return this;
    }

    withEmail(email: string) {
        this.email = email;
        return this;
    }

    build() {
        return new Employee(this.name, this.age, this.email, this.salary);
    }
}

const employeeBuilder = new TestEmployeeBuilder();
const employee1 = employeeBuilder.build();
employee1.log();

const employee2 = employeeBuilder
    .withEmail('test@email.com')
    .withSalary(14500)
    .build();
employee2.log();