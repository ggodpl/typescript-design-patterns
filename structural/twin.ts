// If the language we are working with does not support multiple inheritance (like JS and TS),
// we can use the Twin pattern...
class EntityLogical {
    private health: number = 100;
    private dead: boolean = false;
    // ...where instead of using inheritance we use composition and hold instances of other partial classes
    public visualTwin!: EntityVisual;
    public attackingTwin!: EntityAttacking;

    constructor (public name: string) {}

    setVisualTwin(visualTwin: EntityVisual) {
        this.visualTwin = visualTwin;
    }

    setAttackingTwin(attackingTwin: EntityAttacking) {
        this.attackingTwin = attackingTwin;
    }

    takeDamage(damage: number) {
        if (damage >= this.health) {
            this.dead = true;
            this.health = 0;
            // We can still use functions from other twins without issues...
            this.visualTwin.playDeathAnimation();
            return;
        }
        this.health -= damage;
        this.visualTwin.playHurtAnimation();
    }

    getHealth(): number {
        return this.health;
    }

    isDead() {
        return this.dead;
    }
}

class EntityVisual {
    public logicalTwin!: EntityLogical;
    
    setLogicalTwin(logicalTwin: EntityLogical) {
        this.logicalTwin = logicalTwin;
    }

    playHurtAnimation() {
        // ...even inside of other twins
        console.log(`${this.logicalTwin.name}: Playing hurt animation. Health: ${this.logicalTwin.getHealth()}`);
    }

    playDeathAnimation() {
        console.log(`${this.logicalTwin.name}: Playing death animation. Dead: ${this.logicalTwin.isDead()}`);
    }

    playAttackAnimation() {
        console.log(`${this.logicalTwin.name}: Playing attack animation`);
    }
}

class EntityAttacking {
    public logicalTwin!: EntityLogical;
    public visualTwin!: EntityVisual;

    setLogicalTwin(logicalTwin: EntityLogical) {
        this.logicalTwin = logicalTwin;
    }

    setVisualTwin(visualTwin: EntityVisual) {
        this.visualTwin = visualTwin;
    }

    attack(other: EntityLogical) {
        console.log(`${this.logicalTwin.name} is attacking ${other.name}!`);
        this.visualTwin.playAttackAnimation();
        other.takeDamage(10);
    }
}

const zombie = new EntityLogical('Zombie');
const zombieVisual = new EntityVisual();
const zombieAttacking = new EntityAttacking();

zombie.setVisualTwin(zombieVisual);
zombie.setAttackingTwin(zombieAttacking);
zombieVisual.setLogicalTwin(zombie);
zombieAttacking.setLogicalTwin(zombie);
zombieAttacking.setVisualTwin(zombieVisual);

const player = new EntityLogical('Player');
const playerVisual = new EntityVisual();
const playerAttacking = new EntityAttacking();

player.setVisualTwin(playerVisual);
player.setAttackingTwin(playerAttacking);
playerVisual.setLogicalTwin(player);
playerAttacking.setLogicalTwin(player);
playerAttacking.setVisualTwin(playerVisual);

player.attackingTwin.attack(zombie);
zombie.attackingTwin.attack(player);