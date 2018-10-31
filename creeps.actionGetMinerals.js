require('structures.prototypeSource');

//Test each function for availability, if valid energy is found use it as a function lookup.
Creep.prototype.actionGetMinerals = function (creep) {
	switch(1){
		case dropMIN(creep): return true;
		case canMIN(creep): return true;
		default: return false;
	}
};

function dropMIN(creep){
	//If Not Hauler, return invalid
	if (creep.memory.role != "Hauler"){ return 0; }
	//Find Dropped Energy
	let dropMinerals = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (d) => (d.amount >= 50)
    });
	//If Dropped Energy Exists, Try to get it
    if (dropMinerals.length>0) {
        let pickupMin = creep.pickup(dropMinerals[0]);

		//If Dropped Energy Exists, but couldn't get it, go to it.
   	 	if (pickupMin == ERR_NOT_IN_RANGE) {
   	 		creep.moveTo(dropMinerals[0]);
   	 	}
            return 1;
    } else { return 0; }
}

		
function canMIN(creep){
	//Find Container with more than 250 Minerals
    let canMinerals = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER && _.sum(c.store) > c.store[RESOURCE_ENERGY]});
    console.log(canMinerals != undefined);
	if (canMinerals != undefined) {
		//If Found, Try to withdraw from it
        let res = ["H", "O", "U", "L", "K", "Z", "X", "G", RESOURCE_ENERGY];
        for (x=0; x<9; x++) {
            let transferCan = creep.withdraw(canMinerals, res[x]);
            //If Failed, Move to it
            if (transferCan == ERR_NOT_IN_RANGE) {
                creep.moveTo(canMinerals.pos);
                return 1;
            }
        }
    } else { return 0; }
}