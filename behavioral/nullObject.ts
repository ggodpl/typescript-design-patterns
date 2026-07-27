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

// Instead of relying on null checks, we implement a safe null object
// Which uses no-ops for all of its implemented methods
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
            // Instead of returning a null or throwing an error, we return the null vehicle
            // This is great for swallowing errors and keeping the service running,
            // but it's also its biggest downside - errors are swallowed and not logged
            // This means that without explicit logging it can be very hard to find
            // a bug that causes the vehicleType to be incorrect
            return new NullVehicle();
    }
}

const car = getVehicle('car');
car.drive();
const truck = getVehicle('truck');
truck.drive();
const nullVehicle = getVehicle('nonExistentVehicle');
// We don't have to check for null or try-catch since a vehicle is guaranteed
nullVehicle.drive(); // This call does absolutely nothing, which is better than getting a runtime error