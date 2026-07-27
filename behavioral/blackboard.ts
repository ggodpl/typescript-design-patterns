class Blackboard {
    // unknown ignores type safety a little bit
    // A better solution would be to use an interface with all fact types
    // or assume a unified type for all facts
    private facts: Map<string, unknown> = new Map();

    getFact(name: string): unknown {
        return this.facts.get(name);
    }

    // Adds a new fact and returns true if anything was changed
    addFact(name: string, value: unknown): boolean {
        if (this.facts.get(name) === value) {
            return false;
        }

        this.facts.set(name, value);
        return true;
    }

    getFacts() {
        return Array.from(this.facts.entries());
    }
}

interface Expert {
    // Processes the current blackboard by reading and adding facts
    // Returns true if anything was changed
    process(board: Blackboard): boolean;
}

class CoveringExpert implements Expert {
    process(board: Blackboard): boolean {
        if (board.getFact('covering') === 'feathers') {
            return board.addFact('class', 'bird');
        } else if (board.getFact('covering') === 'fur') {
            return board.addFact('class', 'mammal');
        }
        return false;
    }
}

class FlightCapacityExpert implements Expert {
    process(board: Blackboard): boolean {
        if (board.getFact('class') === 'bird') {
            return board.addFact('canFly', true);
        } else if (board.getFact('class') === 'mammal') {
            return board.addFact('canFly', false);
        }

        return false;
    }
}

class BirdIdentificationExpert implements Expert {
    process(board: Blackboard): boolean {
        if (board.getFact('class') === 'bird') {
            if (board.getFact('color') === 'black') {
                return board.addFact('animal', 'crow');
            } else if (board.getFact('color') === 'white') {
                return board.addFact('animal', 'chicken');
            }
        }

        return false;
    }
}

class MammalIdentificationExpert implements Expert {
    process(board: Blackboard): boolean {
        if (board.getFact('class') === 'mammal') {
            if (board.getFact('retractableClaws') === true) {
                return board.addFact('animal', 'cat');
            } else if (board.getFact('ancestor') === 'wolf') {
                return board.addFact('animal', 'dog');
            }
        }

        return false;
    }
}

class Controller {
    constructor (private experts: Expert[]) {}

    // Repeatedly ask all experts for opinions until no further changes are being made
    // This implementation asks all experts every single time
    // A more production-ready implementation would add a way for experts to declare 
    // facts they are interested in, and the controller would notify them accordingly
    solve(board: Blackboard) {
        let changed = true;
        while (changed) {
            changed = false;
            for (const expert of this.experts) {
                changed ||= expert.process(board);
            }
        }
    }
}

const crowBlackboard = new Blackboard();
crowBlackboard.addFact('covering', 'feathers');
crowBlackboard.addFact('color', 'black');

const chickenBlackboard = new Blackboard();
chickenBlackboard.addFact('covering', 'feathers');
chickenBlackboard.addFact('color', 'white');

const catBlackboard = new Blackboard();
catBlackboard.addFact('covering', 'fur');
catBlackboard.addFact('retractableClaws', true);

const dogBlackboard = new Blackboard();
dogBlackboard.addFact('covering', 'fur');
dogBlackboard.addFact('ancestor', 'wolf');

const controller = new Controller([
    new CoveringExpert(),
    new FlightCapacityExpert(),
    new BirdIdentificationExpert(),
    new MammalIdentificationExpert(),
]);

controller.solve(crowBlackboard);
console.log(crowBlackboard.getFacts());

controller.solve(chickenBlackboard);
console.log(chickenBlackboard.getFacts());

controller.solve(catBlackboard);
console.log(catBlackboard.getFacts());

controller.solve(dogBlackboard);
console.log(dogBlackboard.getFacts());