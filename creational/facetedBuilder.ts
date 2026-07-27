class Person {
    constructor (
        public firstName: string,
        public lastName: string,
        public address: string,
        public city: string,
        public occupation: string,
        public company: string,
    ) {}

    static builder() {
        return new PersonBuilder();
    }

    static builder2() {
        return new PersonBuilder2();
    }
}

class PersonFacet {
    constructor (protected builder: PersonBuilder) {}

    and() {
        return this.builder;
    }
}

class PersonBuilder {
    private firstName?: string;
    private lastName?: string;
    private address?: string;
    private city?: string;
    private occupation?: string;
    private company?: string;

    named() {
        return new class NameFacet extends PersonFacet {
            firstName(firstName: string): this {
                this.builder.firstName = firstName;
                return this;
            }

            lastName(lastName: string): this {
                this.builder.lastName = lastName;
                return this;
            }
        }(this);
    }

    lives() {
        return new class AddressFacet extends PersonFacet {
            at(address: string): this {
                this.builder.address = address;
                return this;
            }

            in(city: string): this {
                this.builder.city = city;
                return this;
            }
        }(this);
    }

    works() {
        return new class OccupationFacet extends PersonFacet {
            at(company: string): this {
                this.builder.company = company;
                return this;
            }

            as(occupation: string): this {
                this.builder.occupation = occupation;
                return this;
            }
        }(this);
    }

    build() {
        if (
            this.firstName === undefined
            || this.lastName === undefined
            || this.address === undefined
            || this.city === undefined
            || this.occupation === undefined
            || this.company === undefined
        ) throw new Error('Not all parameters were supplied');

        return new Person(this.firstName, this.lastName, this.address, this.city, this.occupation, this.company);
    }
}

const person = Person.builder()
    .named()
        .firstName('John')
        .lastName('Johns')
        .and()
    .lives()
        .at('12 Main St')
        .in('London')
        .and()
    .works()
        .at('Google')
        .as('Engineer')
        .and()
    .build();

console.log(person);

class PersonBuilder2 {
    private person: Partial<Person> = {};

    named() {
        return new class extends PersonBuilder2 {
            constructor (person: Partial<Person>) {
                super();
                this.person = person;
            }
            
            firstName(firstName: string) {
                this.person.firstName = firstName;
                return this;
            }

            lastName(lastName: string) {
                this.person.lastName = lastName;
                return this;
            }
        }(this.person);
    }

    lives() {
        return new class extends PersonBuilder2 {
            constructor (person: Partial<Person>) {
                super();
                this.person = person;
            }
            
            at(address: string) {
                this.person.address = address;
                return this;
            }

            in(city: string) {
                this.person.city = city;
                return this;
            }
        }(this.person);
    }

    works() {
        return new class extends PersonBuilder2 {
            constructor (person: Partial<Person>) {
                super();
                this.person = person;
            }
            
            at(company: string) {
                this.person.company = company;
                return this;
            }

            as(occupation: string) {
                this.person.occupation = occupation;
                return this;
            }
        }(this.person);
    }

    build() {
        if (
            this.person.firstName === undefined
            || this.person.lastName === undefined
            || this.person.address === undefined
            || this.person.city === undefined
            || this.person.occupation === undefined
            || this.person.company === undefined
        ) throw new Error('Not all parameters were supplied');

        return new Person(this.person.firstName, this.person.lastName, this.person.address, this.person.city, this.person.occupation, this.person.company);
    }
}

const person2 = Person.builder2()
    .named()
        .firstName('John')
        .lastName('Johns')
    .lives()
        .at('12 Main St')
        .in('London')
    .works()
        .at('Google')
        .as('Engineer')
    .build();

console.log(person2);