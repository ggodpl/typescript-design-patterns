interface Car {
    drive(): void;
}

interface Motorcycle {
    ride(): void;
}

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

class BMWFactory implements VehicleFactory {
    createCar(): Car {
        return new BMWCar();
    }

    createMotorcycle(): Motorcycle {
        return new BMWMotorcycle();
    }
}

class HondaFactory implements VehicleFactory {
    createCar(): Car {
        return new HondaCar();
    }

    createMotorcycle(): Motorcycle {
        return new HondaMotorcycle();
    }
}

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

useFactory(selectFactory(Brand.BMW));
useFactory(selectFactory(Brand.Honda));