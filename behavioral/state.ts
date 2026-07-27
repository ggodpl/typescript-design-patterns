interface TrafficLightState {
    advance(light: TrafficLight): void;
    getColor(): string;
}

class TrafficLight {
    constructor (private state: TrafficLightState) {}

    setState(state: TrafficLightState) {
        this.state = state;
    }

    // Both the advance...
    advance() {
        this.state.advance(this);
    }

    // ...and the getColor functions are delegated to the state
    // which implements both of them
    // This means that changing the state can change the behavior
    // of the TrafficLight without having to explicitly check what it is
    getColor() {
        return this.state.getColor();
    }
}

class RedState implements TrafficLightState {
    advance(light: TrafficLight) {
        // RedState decides what the next state will be
        // This means that we can add a new state into the cycle
        // by just changing the previous state, without having
        // to modify TrafficLight
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