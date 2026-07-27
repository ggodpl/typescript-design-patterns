interface Vehicle {
    drive(): void;
}

enum VehicleType {
    Car,
    Truck
}

class Car implements Vehicle {
    drive() {
        console.log('Driving a car');
    }
}

class Truck implements Vehicle {
    drive() {
        console.log('Driving a truck');
    }
}

class VehicleFactory {
    createVehicle(type: VehicleType) {
        switch (type) {
            case VehicleType.Car:
                return new Car();
            case VehicleType.Truck:
                return new Truck();
        }
    }
}

const factory = new VehicleFactory();
const car = factory.createVehicle(VehicleType.Car);
const truck = factory.createVehicle(VehicleType.Truck);

car.drive();
truck.drive();