require("structures.prototypeSource");
require('creeps.actionDeliverEnergy');
require('creeps.actionGetEnergy');

module.exports = {
	run: function (creep) {
        if (!creep.changeRoom()) {
            //Get source affinity
            let source = Game.getObjectById(creep.memory.affinity);
            let containers = Game.getObjectById(creep.memory.canid);
            if (containers != undefined) {
                //If on container
                if (creep.pos.isEqualTo(containers.pos)) {
                    //Harvest
                    creep.harvest(source);
                } else {
                    //Move to container
                    creep.moveTo(containers);
                }
            } else {
                switch (creep.carry[RESOURCE_ENERGY]) {
                    //If energy max, cycle job to unloading.
                    case creep.carryCapacity:
                        creep.memory.task = "unload";
                        break;
                    //If energy min, cycle job to gathering.
                    case 0:
                        creep.memory.task = "gather";
                        break;
                }
                switch (creep.memory.task) {
                    //If job is unload, deliver energy.
                    case "unload":
                        creep.actionDeliverEnergy(creep);
                        break;
                    //If job is gather, harvest energy. Move to source if needed.
                    case "gather":
                        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }
                        break;
                }
            }
        }
    }
};