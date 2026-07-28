// A class can only have one base class, which is a problem when a behavior cuts across the hierarchy
type Constructor<T = {}> = new (...args: any[]) => T;

class Animal {
    constructor(public readonly name: string) {}

    talk(): void {
        console.log(`${this.name} makes a sound`);
    }
}

// A mixin is a function that takes a class and returns a subclass of it extended with
// some behavior. The base is a type parameter, not a fixed class, so a single mixin can be
// applied anywhere in the hierarchy; its constraint declares what the mixin requires of that
// base, which is what makes `this.name` below type safe even though the base is unknown
function CanFly<TBase extends Constructor<{ name: string }>>(Base: TBase) {
    return class extends Base {
        // Mixins can add state, not just methods
        altitude: number = 0;

        fly(meters: number): void {
            this.altitude += meters;
            console.log(`${this.name} flies up to ${this.altitude}m`);
        }
    };
}

function CanSwim<TBase extends Constructor<{ name: string }>>(Base: TBase) {
    return class extends Base {
        blub(): void {
            console.log(`${this.name} says blub`);
        }
    };
}

class Fish extends CanSwim(Animal) {}
class Bird extends CanFly(Animal) {}

new Fish('Nemo').blub();
new Bird('Zazu').fly(120);

// Mixins compose by nesting, so a duck can do both without either behavior knowing about the other
class Duck extends CanSwim(CanFly(Animal)) {
    // Everything a mixin adds is inherited normally, so it can be overridden...
    override talk(): void {
        console.log(`${this.name} quacks`);
    }
}

const duck = new Duck('Donald');
duck.talk();
duck.fly(30);
duck.blub();

// ...or built upon
class Bat extends CanFly(Animal) {
    useEcholocation(): void {
        console.log(`${this.name} navigates at ${this.altitude}m using echolocation`);
    }
}

const bat = new Bat('Batrick');
bat.fly(15);
bat.useEcholocation();