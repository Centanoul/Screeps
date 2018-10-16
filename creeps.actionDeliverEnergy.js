Creep.prototype.actionDeliverEnergy = function () {
		switch(1){
		case spawnNRG(): spawnNRG(1); break;
		case extNRG(): extNRG(1); break;
		case storageNRG(): storageNRG(1); break;
	//	case upgNRG(): upgNRG(1); break;
		default: this.say("🚬"); break;
	}
};

function spawnNRG(live){
	let nearSpawn = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_SPAWN && c.store[RESOURCE_ENERGY] < 300)});
	if (nearSpawn.length){
		if (live = true){
			if (this.transfer(nearSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(nearSpawn);
			}
		} else { return 1; }
	} else { return 0; }
}

function extNRG(live){
	let nearExt = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_EXTENSION && c.store[RESOURCE_ENERGY] < 50)});
	if (nearExt.length){
		if (live = true){
			if (this.transfer(nearExt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(nearExt);
			}
		} else { return 1; }
	} else { return 0; }
}

function storageNRG(live){
	let storeEnergy = this.room.storage;
	if (storage != undefined){
		if (live = true){
			if (this.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.moveTo(storage);
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