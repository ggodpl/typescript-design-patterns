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

// If we combine the Builder pattern with the Fluent Interface pattern, we get a Fluent Builder
class PersonBuilder {
    private name!: string;
    private age!: number;
    private address?: string;
    private phoneNumber?: string;
    private email?: string;

    // By retuning itself on every setter method, it allows method chaining
    setName(name: string): this {
        this.name = name;
        return this;
    }

    setAge(age: number): this {
        this.age = age;
        return this;
    }

    setAddress(address: string): this {
        this.address = address;
        return this;
    }

    setPhoneNumber(phoneNumber: string): this {
        this.phoneNumber = phoneNumber;
        return this;
    }

    setEmail(email: string): this {
        this.email = email;
        return this;
    }

    build() {
        // After some runtime validation...
        if (this.name === undefined) throw new Error('Name is missing!');

        if (this.age === undefined) throw new Error('Age is missing!');

        // ...we can return the constructed Person instance
        return new Person(this.name, this.age, this.address, this.phoneNumber, this.email);
    }
}

const person = Person.builder()
    .setName('John Smith')
    .setAddress('Albuquerque, New Mexico')
    .setAge(32)
    .setEmail('john.smith@example.mail')
    .setPhoneNumber('123-456-789')
    .build();

console.log(person);