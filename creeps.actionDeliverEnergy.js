Creep.prototype.actionDeliverEnergy = function (creep) {
		switch(1){
		case spawnNRG(creep, 0): spawnNRG(creep, 1); break;
		case extNRG(creep, 0): extNRG(creep, 1); break;
		case storageNRG(creep, 0): storageNRG(creep, 1); break;
	//	case upgNRG(): upgNRG(1); break;
	}
};

function spawnNRG(creep, live){
	let nearSpawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_SPAWN && c.energy < 300)});
	if (nearSpawn != undefined){
		if (live = true){
			if (creep.transfer(nearSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(nearSpawn);
			}
		} else { return 1; }
	} else { return 0; }
}

function extNRG(creep, live){
	let nearExt = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_EXTENSION && c.energy < 50)});
	if (nearExt != undefined){
		if (live = true){
			if (creep.transfer(nearExt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(nearExt);
			}
		} else { return 1; }
	} else { return 0; }
}

function storageNRG(creep, live){
	let storage = creep.room.storage;
	if (storage != undefined){
		if (live = true){
			if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(storage);
			}
		} else { return 1; }
	} else { return 0; }
}
/*
function upgNRG(live){
	let upgCan = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_CONTAINER) && memory: {type: "UpgradeCan"}});
	if (upgCan.length) {
		if (live = true){
			if (this.transfer(upgCan, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(UpgCan);
			}
		} else { return 1; }
	} else { return 0; }	
} */