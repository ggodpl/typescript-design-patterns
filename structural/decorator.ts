interface Coffee {
    getCost(): number;
    getIngredients(): string;
}

class SimpleCoffee implements Coffee {
    getCost(): number {
        return 3.99;
    }

    getIngredients(): string {
        return 'Coffee';
    }
}

class CoffeeDecorator implements Coffee {
    constructor (private coffee: Coffee) {}

    getCost(): number {
        return this.coffee.getCost();
    }

    getIngredients(): string {
        return this.coffee.getIngredients();
    }
}

class CoffeeWithMilk extends CoffeeDecorator {
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

const coffee = new SimpleCoffee();
printInformation(coffee);

const coffeeWithMilk = new CoffeeWithMilk(coffee);
printInformation(coffeeWithMilk);