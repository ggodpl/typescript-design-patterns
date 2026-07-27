interface Coffee {
    getCost(): number;
    getIngredients(): string;
}

// If we want to change behavior of simple coffee without affecting existing instances...
class SimpleCoffee implements Coffee {
    getCost(): number {
        return 3.99;
    }

    getIngredients(): string {
        return 'Coffee';
    }
}

// ...we can create a decorator...
class CoffeeDecorator implements Coffee {
    // ...which takes an instance of the original class...
    constructor (private coffee: Coffee) {}

    getCost(): number {
        return this.coffee.getCost();
    }

    getIngredients(): string {
        return this.coffee.getIngredients();
    }
}

class CoffeeWithMilk extends CoffeeDecorator {
    // ...and allows us to modify its behavior
    override getCost(): number {
        return super.getCost() + 1;
    }

    override getIngredients(): string {
        return super.getIngredients() + ', Milk';
    }
}

function printInformation(coffee: Coffee) {
    console.log(`Cost: ${coffee.getCost()}, Ingredients: ${coffee.getIngredients()}`);
}

// This pattern is very useful and it allows us to have both a regular instance...
const coffee = new SimpleCoffee();
printInformation(coffee);

// ...and a decorated one
const coffeeWithMilk = new CoffeeWithMilk(coffee);
printInformation(coffeeWithMilk);