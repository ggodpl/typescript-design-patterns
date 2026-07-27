class Fruit {
    static types: Map<string, Fruit> = new Map();
    
    private constructor (private type: string) {}

    static getFruit(type: string) {
        // Lazy initialization happens here
        if (!this.types.has(type)) {
            // If this type of fruit does not exist when requested,
            // we create it...
            this.types.set(type, new Fruit(type));
        }

        // ...and return it when needed
        // This implementation is also a proper example of the Multiton pattern
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