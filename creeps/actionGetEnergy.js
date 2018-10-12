require('../structure/prototypeSource.js');

Creep.prototype.getEnergy = function () {
	switch(1){
		case dropNRG(): dropNRG(1); break;
		case graveNRG(): graveNRG(1); break;
		case storeNRG(): storeNRG(1); break;
		case canNRG(): canNRG(1); break;
		default: srcNRG(1); break;
	}
}

function dropNRG(live){
	if (this.memory.role != "hauler"){ return 0; }
	var dropEnergy = this.room.find(FIND_DROPPED_RESOURCES, {
        filter: (d) => (d.amount >= 50 && d.resourceType == "energy")
    });
    if (dropEnergy.length) {
        var pickupEnergy = this.pickup(dropEnergy[0]);
    } else { return 0; }
    if (dropEnergy.length > 0 && pickupEnergy == ERR_NOT_IN_RANGE) {
        if (live == 1){
			this.moveTo(dropEnergy[0]);
		} else { return 1; }
    }
}
	
function graveNRG(live){
	if (this.memory.role != "hauler"){ return 0; } 
	var graveEnergy = this.room.find(FIND_TOMBSTONES, {
		filter: (t) => (t.store[RESOURCE_ENERGY] >= 50 && t.creep.my == true)
	)};
	if (graveEnergy.length) {
		var transferGrave = this.withdraw(graveEnergy, RESOURCE_ENERGY);
	} else { return 0; }
	if (graveEnergy.length > 0 && transferGrave == ERR_NOT_IN_RANGE) {
		if (live == 1){
			this.moveTo(graveEnergy[0]);
		} else { return 1; }
	}
}	
	
function storeNRG(live){
	var storeEnergy = this.room.storage;
	if (storeEnergy != undefined && storeEnergy.store[RESOURCE_ENERGY] >= 250) {
		var transferStore = this.withdraw(storeEnergy, RESOURCE_ENERGY);
		if (transferStore == ERR_NOT_IN_RANGE) {
			if (live == 1){
				this.moveTo(storeEnergy);
			} else { return 1; }
		}
	} else { return 0; }
}
		
function canNRG(live){
	var canEnergy = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: c => (c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 250
	});
	if (canEnergy != undefined ) {
		var transferCan == this.withdraw(canEnergy, RESOURCE_ENERGY);
		if (transferCan == ERR_NOT_IN_RANGE) {
			if (live == 1){
				this.moveTo(canEnergy);
			} else { return 1; }
		}
	} else { return 0; }
}
        
function srcNRG(live){
	var srcNRG = this.room.find(FIND_SOURCES);
	srcNRG.forEach(function(src){
		var creepList = this.room.find(FIND_MY_CREEPS, {
			filter: (r) => r.memory.affinity == src.id
		});
		if (creepList.length < src.getAccessPoints && this.memory.affinity == undefined){
			this.memory.affinity = src.id
		}
	}
	if (this.memory.affinity != undefined){
		var harvestSrc = this.harvest(Game.getObjectByID(this.memory.affinity);
		if (harvestSrc == ERR_NOT_IN_RANGE){
			this.moveTo(Game.getObjectByID(this.memory.affinity);
		}
	}
}