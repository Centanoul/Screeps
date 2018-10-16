require("structures.prototypeSource");
require('actionDeliverEnergy.js');
require('actionGetEnergy.js');

module.exports = {
	run: function (creep) {
		//Get source affinity
        let source = Game.getObjectById(creep.memory.affinity);
		//If source has container
		if (source.memory.can != undefined){
			//Refresh container ID into object
			let container = Game.getObjectById(source.memory.can);
			//If on container
			if (creep.pos.isEqualTo(container.pos)) {
				//Harvest
				creep.harvest(source);
			} else {
				//Move to container
				creep.moveTo(container);
			}
		} else {
			switch (creep.carry[RESOURCE_ENERGY]){
				//If energy max, cycle job to unloading.
				case creep.carryCapacity:
					creep.memory.task = "unload";
				break;
				//If energy min, cycle job to gathering.
				case 0:
					creep.memory.task = "gather";
				break;
			}
			let harv;
			switch (creep.memory.task){
				//If job is unload, deliver energy.
				case "unload":
					creep.actionDeliverEnergy();
				break;
				//If job is gather, harvest energy. Move to source if needed.
				case "gather":
					harv = creep.harvest(source);
					if (harv == ERR_NOT_IN_RANGE){
						creep.moveTo(source);
					}
				break;
				default: break;
			}
		}
	}
};