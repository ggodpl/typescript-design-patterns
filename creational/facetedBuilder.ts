class Person {
    constructor (
        public firstName: string,
        public lastName: string,
        public address: string,
        public city: string,
        public occupation: string,
        public company: string,
    ) {}

    // This pattern has 2 examples: with escape hatches
    static builder() {
        return new PersonBuilder();
    }

    // And without escape hatches
    static builder2() {
        return new PersonBuilder2();
    }
}

// Base facet for all builder facets
class PersonFacet {
    constructor (protected builder: PersonBuilder) {}

    // Escape hatch which returns the control to the builder itself
    and() {
        return this.builder;
    }
}

class PersonBuilder {
    // This can also be done using a Partial like in the second example
    private firstName?: string;
    private lastName?: string;
    private address?: string;
    private city?: string;
    private occupation?: string;
    private company?: string;

    named() {
        // We return a new anonymous class that creates a name facet
        // This allows us to modify private fields in the PersonBuilder class without setters 
        // (since the entire class is inside of the PersonBuilder)
        // It also keeps the class close to the builder and avoids polluting the code at the cost of debug visibility
        return new class NameFacet extends PersonFacet {
            firstName(firstName: string): this {
                // This actually works, even on strict TypeScript settings
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
        // We check if all fields are set...
        if (
            this.firstName === undefined
            || this.lastName === undefined
            || this.address === undefined
            || this.city === undefined
            || this.occupation === undefined
            || this.company === undefined
        ) throw new Error('Not all parameters were supplied');

        // ...and return a new Person, like a regular Builder would
        return new Person(this.firstName, this.lastName, this.address, this.city, this.occupation, this.company);
    }
}

const person = Person.builder()
    .named()
        .firstName('John')
        .lastName('Johns')
        // This implementation requires an escape hatch after every facet...
        .and()
    // ...to get back to the actual builder
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
        // Every facet returns a new anonymous class that is itself a child of the entire builder
        // This means that it still has access to named, lives, and works methods
        // while firstName, at, and other methods are still only accessible in their respective facet
        return new class extends PersonBuilder2 {
            constructor (person: Partial<Person>) {
                super();
                // Since this is a new builder, we pass the current values
                // This method also allows us to keep the builder data as private
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

    // Same as above
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

// Now we have a really nice fluent API which allows us to use facets without any escape hatches
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