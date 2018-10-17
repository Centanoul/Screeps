require('creeps.actionDeliverEnergy');
require('creeps.actionGetEnergy');

module.exports = {
	run: function (creep) {
        if (!creep.changeRoom()) {
            switch (creep.memory.task) {
                case "gather":
                    if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
                        creep.memory.task = "unload";
                        break;
                    }
                    creep.actionGetEnergy(creep);
                    break;
                case "unload":
                    if (creep.carry[RESOURCE_ENERGY] == 0) {
                        creep.memory.task = "gather";
                        break;
                    }
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                    break;
            }
        }
    }
};