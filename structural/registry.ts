// If we have a lot of objects that we will need to look up later...
class Employee {
    constructor (public id: string, public name: string) {}
}

class EmployeeRegistry {
    // ...we can create a registry...
    private employees: Map<string, Employee> = new Map();

    // ...where we can register said objects...
    register(employee: Employee) {
        this.employees.set(employee.id, employee);
    }

    // ...or look them up
    get(id: string) {
        this.employees.get(id);
    }
}

const registry = new EmployeeRegistry();
registry.register(new Employee('ID-1', 'Oscar'));
registry.register(new Employee('ID-2', 'Anthony'));
registry.register(new Employee('ID-3', 'Peter'));

console.log(registry.get('ID-2'));