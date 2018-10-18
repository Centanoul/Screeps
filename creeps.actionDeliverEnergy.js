Creep.prototype.actionDeliverEnergy = function (creep) {
		switch(1){
		case spawnNRG(creep): break;
		case extNRG(creep): break;
		case twrNRG(creep): break;
		case storageNRG(creep): break;
	//	case upgNRG(): upgNRG(1); break;
	}
};

function spawnNRG(creep){
	let nearSpawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_SPAWN && c.energy < 300)});
	if (nearSpawn != undefined){
			if (creep.transfer(nearSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(nearSpawn);
            }
        return 1;
    } else { return 0; }
}

function extNRG(creep){
	let nearExt = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_EXTENSION && c.energy < 50)});
	if (nearExt != undefined){
			if (creep.transfer(nearExt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(nearExt);
            }
        return 1;
    } else { return 0; }
}

function twrNRG(creep){
    let nearTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => (c.structureType == STRUCTURE_TOWER && c.energy < 950)});
    if (nearTower != undefined){
            if (creep.transfer(nearTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearTower);
            }
        return 1;
    } else { return 0; }
}

function storageNRG(creep){
	let storage = creep.room.storage;
	if (storage != undefined){
		if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(storage);
		}
		return 1;
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