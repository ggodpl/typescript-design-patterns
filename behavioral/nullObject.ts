interface Vehicle {
    drive(): void;
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

class NullVehicle implements Vehicle {
    drive() {
        // do nothing
    }
}

function getVehicle(vehicleType: string) {
    switch (vehicleType) {
        case 'car':
            return new Car();
        case 'truck':
            return new Truck();
        default:
            return new NullVehicle();
    }
}

const car = getVehicle('car');
car.drive();
const truck = getVehicle('truck');
truck.drive();
const nullVehicle = getVehicle('nonExistentVehicle');
nullVehicle.drive();