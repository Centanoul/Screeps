require('structures.prototypeSource');

//Test each function for availability, if valid energy is found use it as a function lookup.
Creep.prototype.actionGetEnergy = function (creep) {
	switch(1){
		case dropNRG(creep): break;
		case graveNRG(creep): break;
		case storeNRG(creep, 1): break;
		case canNRG(creep): break;
		case storeNRG(creep, 0): break;
		default: srcNRG(creep); break;
	}
};

function dropNRG(creep){
	//If Not Hauler, return invalid
	if (creep.memory.role != "Hauler"){ return 0; }
	//Find Dropped Energy
	let dropEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (d) => (d.amount >= 50 && d.resourceType == "energy")
    });
	//If Dropped Energy Exists, Try to get it
    if (dropEnergy.length>0) {
        let pickupEnergy = creep.pickup(dropEnergy[0]);

		//If Dropped Energy Exists, but couldn't get it, go to it.
   	 	if (pickupEnergy == ERR_NOT_IN_RANGE) {
   	 		creep.moveTo(dropEnergy[0]);
   	 	}
            return 1;
    } else { return 0; }
}
	
function graveNRG(creep){
	//If Not Hauler, return invalid
	if (creep.memory.role != "Hauler"){ return 0; }
	//Find Tombstones
	let graveEnergy = creep.room.find(FIND_TOMBSTONES, {filter: (t) => t.energy >= 50 && t.creep.my == true});
	//If Tombstone Exists, Try to withdraw from it.
	//If Tombstone Exists
	if (graveEnergy != undefined && creep.withdraw(graveEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
		creep.moveTo(graveEnergy[0]);
		return 1;
    } else { return 0; }
}	
	
function storeNRG(creep, failIfHauler){
	//Find Storage
	if (creep.memory.role == "Hauler" && failIfHauler == 1){return 0;}
	if (creep.memory.role != "Hauler" && failIfHauler == 0){return 0;}
	let storeEnergy = creep.room.storage;
	//If Storage Found & Energy > 250
	if (storeEnergy != undefined && storeEnergy.store[RESOURCE_ENERGY] >= 250) {
		//Withdraw Energy
		let transferStore = creep.withdraw(storeEnergy, RESOURCE_ENERGY);
		//If Failed, Move to Storage
		if (transferStore == ERR_NOT_IN_RANGE) {
			creep.moveTo(storeEnergy);
		}
            return 1;
	} else { return 0; }
}
		
function canNRG(creep){
	//Find Container with more than 250 Energy
	let canEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 250});
	if (canEnergy != undefined ) {
		//If Found, Try to withdraw from it
		let transferCan = creep.withdraw(canEnergy, RESOURCE_ENERGY);
		//If Failed, Move to it
		if (transferCan == ERR_NOT_IN_RANGE) {
				creep.moveTo(canEnergy);
        }
        	return 1;
    } else { return 0; }
}
        
function srcNRG(creep){
	//Get all sources in the room
	let srcNRG = creep.room.find(FIND_SOURCES);
	//For Each Source
    for (let src of srcNRG) {
        //Find Creeps Associated with it
        let creepList = creep.room.find(FIND_MY_CREEPS, {
            filter: (r) => r.memory.affinity == src.id
        });
        //If there are less creeps associated than there are spots to sit and mine
        //And if this creep is not already assigned to a source
        //Assign this source
        if (creepList.length < src.getAccessPoints() && creep.memory.affinity == undefined) {
            creep.memory.affinity = src.id;
        }
    };
    if (creep.memory.affinity == undefined){
    	creep.memory.affinity = srcNRG[Math.trunc(Math.random()*2)].id;
	}
		//If assigned to source
	if (creep.memory.affinity != undefined){
		//Harvest source
		let harvestSrc = creep.harvest(Game.getObjectById(creep.memory.affinity));
		//If Failed, move to it
		if (harvestSrc == ERR_NOT_IN_RANGE){
			creep.moveTo(Game.getObjectById(creep.memory.affinity));
		}
	}
};