require('actionDeliverEnergy');
require('actionGetEnergy');

module.exports = {
    run: function (creep) {

        let logiPriority = [{
            "task": "repair",
            "coeff": 0.25,
            "exclude1": STRUCTURE_WALL,
            "exclude2": STRUCTURE_RAMPARTS
        },
            {"task": "build", "coeff": undefined, "exclude1": undefined, "exclude2": undefined},
            {"task": "repair", "coeff": 0.50, "exclude1": STRUCTURE_WALL, "exclude2": STRUCTURE_RAMPARTS},
            {"task": "repair", "coeff": 1.00, "exclude1": STRUCTURE_WALL, "exclude2": STRUCTURE_RAMPARTS},
            {"task": "repair", "coeff": 1.00, "exclude1": STRUCTURE_WALL, "exclude2": undefined},
            {"task": "repair", "coeff": 1.00, "exclude1": undefined, "exclude2": undefined}];
        switch (creep.memory.task) {
            case "gather":
                if (creep.carry.energy == creep.carryCapacity) {
                    creep.memory.task = "unload";
                    break;
                }
                creep.actionGetEnergy();
                break;
            case "unload":
                if (creep.carry.energy == 0) {
                    creep.memory.task = "gather";
                    break;
                }
                for (i = 0; i < 6 && repStruc == undefined && bldStruc == undefined; i++) {
                    switch (logiPriority[i]["task"]) {
                        case "repair":
                            let repStruc = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < (s.hitsMax * logiPriority[i]["coeff"]) && s.structureType != logiPriority[i]["exclude1"] && s.structureType != logiPriority[i]["exclude2"]});
                            break;
                        case "build":
                            let bldStruc = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
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
};