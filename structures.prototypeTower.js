require('alliance.allies');

StructureTower.prototype.defend = function () {
    //Find Hostile Creep
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //If Valid Target and Not Ally
    if (target != undefined && target.isAlly(target) == false) {
        //Attack
        this.attack(target);
    }
};

StructureTower.prototype.repairBuildings = function () {
	//Find damaged structures that are NOT walls or ramparts
    let targets = this.room.find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
    });
	//Sort by damage
    targets.sort((a,b) => a.hits - b.hits);
	//If there is a valid target, and energy is over 50%, repair it
    if(targets.length > 0 && this.energy > (this.energyCapacity/2)){
        this.repair(targets[0]);
    }
};