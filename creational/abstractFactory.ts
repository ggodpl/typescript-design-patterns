interface Car {
    drive(): void;
}

interface Motorcycle {
    ride(): void;
}

// This factory is the Abstract factory
// It can create families of similar products...
interface VehicleFactory {
    createCar(): Car;
    createMotorcycle(): Motorcycle;
}

class BMWCar implements Car {
    drive() {
        console.log('Driving a BMW car');
    }
}

class BMWMotorcycle implements Motorcycle {
    ride() {
        console.log('Riding a BMW motorcycle');
    }
}

class HondaCar implements Car {
    drive() {
        console.log('Driving a Honda car');
    }
}

class HondaMotorcycle implements Motorcycle {
    ride() {
        console.log('Riding a Honda motorcycle')
    }
}

// ...such as BMW vehicles...
class BMWFactory implements VehicleFactory {
    createCar(): Car {
        return new BMWCar();
    }

    createMotorcycle(): Motorcycle {
        return new BMWMotorcycle();
    }
}

// ...or Honda ones
class HondaFactory implements VehicleFactory {
    createCar(): Car {
        return new HondaCar();
    }

    createMotorcycle(): Motorcycle {
        return new HondaMotorcycle();
    }
}

// We can use it to create different products from the same family
function useFactory(factory: VehicleFactory) {
    const car = factory.createCar();
    const motorcycle = factory.createMotorcycle();

    car.drive();
    motorcycle.ride();
}

enum Brand {
    BMW,
    Honda
}

function selectFactory(brand: Brand): VehicleFactory {
    switch (brand) {
        case Brand.BMW:
            return new BMWFactory();
        case Brand.Honda:
            return new HondaFactory();
    }
}

// This creates just BMW vehicles
useFactory(selectFactory(Brand.BMW));
// Or just Honda vehicles
useFactory(selectFactory(Brand.Honda));