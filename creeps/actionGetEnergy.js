require('../structure/prototypeSource.js');

//Test each function for availability, if valid energy is found use it as a function lookup.
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
	//If Not Hauler, return invalid
	if (this.memory.role != "hauler"){ return 0; }
	//Find Dropped Energy
	var dropEnergy = this.room.find(FIND_DROPPED_RESOURCES, {
        filter: (d) => (d.amount >= 50 && d.resourceType == "energy")
    });
	//If Dropped Energy Exists, Try to get it
    if (dropEnergy.length) {
        var pickupEnergy = this.pickup(dropEnergy[0]);
    } else { return 0; }
	//If Dropped Energy Exists, but couldn't get it, go to it.
    if (dropEnergy.length > 0 && pickupEnergy == ERR_NOT_IN_RANGE) {
        if (live == 1){
			this.moveTo(dropEnergy[0]);
		} else { return 1; }
    }
}
	
function graveNRG(live){
	//If Not Hauler, return invalid
	if (this.memory.role != "hauler"){ return 0; } 
	//Find Tombstones
	var graveEnergy = this.room.find(FIND_TOMBSTONES, {
		filter: (t) => (t.store[RESOURCE_ENERGY] >= 50 && t.creep.my == true)
	)};
	//If Tombstone Exists, Try to withdraw from it.
	if (graveEnergy.length) {
		var transferGrave = this.withdraw(graveEnergy, RESOURCE_ENERGY);
	} else { return 0; }
	//If Tombstone Exists
	if (graveEnergy.length > 0 && transferGrave == ERR_NOT_IN_RANGE) {
		if (live == 1){
			this.moveTo(graveEnergy[0]);
		} else { return 1; }
	}
}	
	
function storeNRG(live){
	//Find Storage
	var storeEnergy = this.room.storage;
	//If Storage Found & Energy > 250
	if (storeEnergy != undefined && storeEnergy.store[RESOURCE_ENERGY] >= 250) {
		//Withdraw Energy
		var transferStore = this.withdraw(storeEnergy, RESOURCE_ENERGY);
		//If Failed, Move to Storage
		if (transferStore == ERR_NOT_IN_RANGE) {
			if (live == 1){
				this.moveTo(storeEnergy);
			} else { return 1; }
		}
	} else { return 0; }
}
		
function canNRG(live){
	//Find Container with more than 250 Energy
	var canEnergy = this.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: c => (c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 250
	});
	if (canEnergy != undefined ) {
		//If Found, Try to withdraw from it
		var transferCan == this.withdraw(canEnergy, RESOURCE_ENERGY);
		//If Failed, Move to it
		if (transferCan == ERR_NOT_IN_RANGE) {
			if (live == 1){
				this.moveTo(canEnergy);
			} else { return 1; }
		}
	} else { return 0; }
}
        
function srcNRG(live){
	//Get all sources in the room
	var srcNRG = this.room.find(FIND_SOURCES);
	//For Each Source
	srcNRG.forEach(function(src){
		//Find Creeps Associated with it
		var creepList = this.room.find(FIND_MY_CREEPS, {
			filter: (r) => r.memory.affinity == src.id
		});
		//If there are less creeps associated than there are spots to sit and mine
		//And if this creep is not already assigned to a source
		//Assign this source
		if (creepList.length < src.getAccessPoints && this.memory.affinity == undefined){
			this.memory.affinity = src.id
		}
	}
		//If assigned to source
	if (this.memory.affinity != undefined){
		//Harvest source
		var harvestSrc = this.harvest(Game.getObjectByID(this.memory.affinity);
		//If Failed, move to it
		if (harvestSrc == ERR_NOT_IN_RANGE){
			this.moveTo(Game.getObjectByID(this.memory.affinity);
		}
	}
}