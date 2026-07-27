interface TrafficLightState {
    advance(light: TrafficLight): void;
    getColor(): string;
}

class TrafficLight {
    constructor (private state: TrafficLightState) {}

    setState(state: TrafficLightState) {
        this.state = state;
    }

    advance() {
        this.state.advance(this);
    }

    getColor() {
        return this.state.getColor();
    }
}

class RedState implements TrafficLightState {
    advance(light: TrafficLight) {
        console.log('advancing to red/amber state');
        light.setState(new RedAmberState());
    }

    getColor(): string {
        return 'red';
    }
}

class RedAmberState implements TrafficLightState {
    advance(light: TrafficLight) {
        console.log('advancing to green state');
        light.setState(new GreenState());
    }

    getColor(): string {
        return 'red and amber';
    }
}

class GreenState implements TrafficLightState {
    advance(light: TrafficLight) {
        console.log('advancing to amber state');
        light.setState(new AmberState());
    }

    getColor(): string {
        return 'green';
    }
}

class AmberState implements TrafficLightState {
    advance(light: TrafficLight) {
        console.log('advancing to red state');
        light.setState(new RedState());
    }

    getColor(): string {
        return 'amber';
    }
}

const trafficLight = new TrafficLight(new RedState());
trafficLight.advance();
trafficLight.advance();
trafficLight.advance();
trafficLight.advance();
trafficLight.advance();

console.log(trafficLight.getColor());