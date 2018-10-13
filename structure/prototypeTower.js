require('../alliance/allies.js');

StructureTower.prototype.defend = function () {
    //Find Hostile Creep
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //If Valid Target and Not Ally
    if (target != undefined && isAlly(target) == false) {
        //Shoot It
        this.attack(target);
    }
}

StructureTower.prototype.repair = function () {
	//Find damaged structures that are NOT walls or ramparts
    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (o) => o.hits < o.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
    });
	//Sort by damage
    targets.sort((a,b) => a.hits - b.hits);
	//If there is a valid target, and energy is over 50%, repair it
    if(targets.length > 0 && this.energy > (this.energyCapacity/2) {
        this.repair(targets[0]);
    }
}