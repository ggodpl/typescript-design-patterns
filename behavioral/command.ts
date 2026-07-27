interface Command {
    execute(): void;
}

interface Device {
    turnOn(): void;
    turnOff(): void;
}

class TV implements Device {
    turnOn() {
        console.log('TV is now on');
    }

    turnOff() {
        console.log('TV is now off')
    }
}

class Radio implements Device {
    turnOn() {
        console.log('Radio is now on');
    }

    turnOff() {
        console.log('Radio is now off')
    }

    changeFrequency() {
        console.log('Changed frequency');
    }
}

class TurnOnCommand implements Command {
    constructor (private device: Device) {}

    execute() {
        this.device.turnOn();
    }
}

class TurnOffCommand implements Command {
    constructor (private device: Device) {}

    execute() {
        this.device.turnOff();
    }
}

class ChangeFrequencyCommand implements Command {
    constructor (private radio: Radio) {}

    execute() {
        this.radio.changeFrequency();
    }
}

class RemoteController {
    private command?: Command;

    setCommand(command: Command) {
        this.command = command;
    }

    run() {
        if (this.command) {
            this.command.execute();
        } else {
            console.log('No command assigned to the remote controller');
        }
    }
}

const remoteController = new RemoteController();
const tv = new TV();
const radio = new Radio();

remoteController.setCommand(new TurnOnCommand(tv));
remoteController.run();

remoteController.setCommand(new TurnOnCommand(radio));
remoteController.run();

remoteController.setCommand(new ChangeFrequencyCommand(radio));
remoteController.run();

remoteController.setCommand(new TurnOffCommand(tv));
remoteController.run();