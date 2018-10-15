require('actionGetEnergy.js');

module.exports = {
	run: function (creep) {	

		switch (creep.memory.task)
			case "gather":
				if (creep.carry.energy == creep.carryCapacity){creep.memory.task = "unload"; break;}
				creep.actionGetEnergy();
			break;
			case "unload":
				if (creep.carry.energy == 0){creep.memory.task = "gather"; break;}
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			break;
}