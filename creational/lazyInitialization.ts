class Fruit {
    static types: Map<string, Fruit> = new Map();
    
    private constructor (private type: string) {}

    static getFruit(type: string) {
        // Lazy initialization happens here
        if (!this.types.has(type)) {
            this.types.set(type, new Fruit(type));
        }

        return this.types.get(type)!;
    }

    static printCurrentTypes() {
        console.log('Number of instances created: ' + this.types.size);
        for (const type of this.types.keys()) {
            console.log(type);
        }
    }
}

Fruit.getFruit('Apple');
Fruit.printCurrentTypes();

Fruit.getFruit('Banana');
Fruit.printCurrentTypes();

Fruit.getFruit('Apple');
Fruit.printCurrentTypes();