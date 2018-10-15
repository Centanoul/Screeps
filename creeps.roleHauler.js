require('actionDeliverEnergy.js');
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
				creep.actionDeliverEnergy();
			break;
}