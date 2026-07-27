class Employee {
    constructor (public id: string, public name: string) {}
}

class EmployeeRegistry {
    private employees: Map<string, Employee> = new Map();

    register(employee: Employee) {
        this.employees.set(employee.id, employee);
    }

    get(id: string) {
        this.employees.get(id);
    }
}

const registry = new EmployeeRegistry();
registry.register(new Employee('ID-1', 'Oscar'));
registry.register(new Employee('ID-2', 'Anthony'));
registry.register(new Employee('ID-3', 'Peter'));

console.log(registry.get('ID-2'));