class Person {
    constructor (
        public name: string,
        public age: number,
        public address?: string,
        public phoneNumber?: string,
        public email?: string,
    ) {};

    static builder() {
        return new PersonBuilder();
    }
}

class PersonBuilder {
    private name!: string;
    private age!: number;
    private address?: string;
    private phoneNumber?: string;
    private email?: string;

    setName(name: string) {
        this.name = name;
    }

    setAge(age: number) {
        this.age = age;
    }

    setAddress(address: string) {
        this.address = address;
    }

    setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }

    setEmail(email: string) {
        this.email = email;
    }

    build() {
        if (this.name === undefined) throw new Error('Name is missing!');

        if (this.age === undefined) throw new Error('Age is missing!');

        return new Person(this.name, this.age, this.address, this.phoneNumber, this.email);
    }
}

const personBuilder = Person.builder();
personBuilder.setName('John Smith');
personBuilder.setAddress('Albuquerque, New Mexico');
personBuilder.setAge(32);
personBuilder.setEmail('john.smith@example.mail');
personBuilder.setPhoneNumber('123-456-789');
const person = personBuilder.build();
console.log(person);