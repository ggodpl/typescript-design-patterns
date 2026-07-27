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
    // The command can perform any action we want it to
    // And can take anything in its constructor
    constructor (private device: Device) {}

    // It just has to have an execute function
    // which will be ran by the remote controller
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

// Holds a command and executes it
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

// The remote controller can execute any command
// This allows it to easily control both the TV and the radio
// Without knowing about either's internals
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