require('creeps.actionDeliverEnergy');
require('creeps.actionGetEnergy');

module.exports = {
    run: function (creep) {
        if (!creep.changeRoom()) {

            let logiPriority = [{"task": "build", "coeff": undefined, "exclude1": undefined, "exclude2": undefined},
                {"task": "repair", "coeff": 0.50, "exclude1": STRUCTURE_WALL, "exclude2": STRUCTURE_RAMPART},
                {"task": "repair", "coeff": 1.00, "exclude1": STRUCTURE_WALL, "exclude2": STRUCTURE_RAMPART},
                {"task": "repair", "coeff": 1.00, "exclude1": STRUCTURE_WALL, "exclude2": undefined},
                {"task": "repair", "coeff": 1.00, "exclude1": undefined, "exclude2": undefined}];
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
                    let repStruc = undefined;
                    let bldStruc = undefined;
                    for (i = 0; i < 5; i++) {
                        switch (logiPriority[i]["task"]) {
                            case "repair":
                                repStruc = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < (s.hitsMax * logiPriority[i]["coeff"]) && s.structureType != logiPriority[i]["exclude1"] && s.structureType != logiPriority[i]["exclude2"]});
                                break;
                            case "build":
                                bldStruc = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                                break;
                        }
                        if (repStruc != undefined) {
                            if (creep.repair(repStruc) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(repStruc);
                            }
                        }
                        if (bldStruc != undefined) {
                            if (creep.build(bldStruc) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(bldStruc);
                            }
                        }
                    }
                    break;
            }
        }
    }
};