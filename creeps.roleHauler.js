require('creeps.actionDeliverEnergy');
require('creeps.actionGetEnergy');
require('creeps.actionDeliverMinerals');
require('creeps.actionGetMinerals');
require('creeps.actionGetLab');
var invTypes = ["H", "O", "U", "L", "K", "Z", "X", "G"];

module.exports = {
	run: function (creep) {
        if (!creep.changeRoom()) {
            if (creep.memory.task != "gatherLab") {
                let xLabs = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType = STRUCTURE_LAB
                });
                for (let i = 0; i < xLabs.length; i++) {
                    if (xLabs[i].memory != undefined) {
                        if (xLabs[i].memory.input != undefined) {
                            if (xLabs[i].mineralAmount < 1000 && (creep.room.terminal.store[xLabs[i].memory.input] + xLabs[i].mineralAmount) >= 1000) {
                                creep.memory.task = "gatherLab";
                                creep.memory.taskTarget = xLabs[i].id;
                                creep.memory.taskTargetMin = xLabs[i].memory.input;
                            }
                        }
                        if (xLabs[i].memory.output != undefined){
                            if (xLabs[i].mineralAmount > 0){
                                creep.memory.task = "deliverLab";
                                creep.memory.taskTarget = xLabs[i].id;
                                creep.memory.taskTargetMin = xLabs[i].memory.output;
                            }
                        }
                    }
                    if (creep.memory.taskTarget != undefined){ break;}
                }
            }

            switch (creep.memory.task) {
                case "gather":
                    if (_.sum(creep.carry) == creep.carryCapacity) {
                        creep.memory.task = "unload";
                        break;
                    }
                    if (!creep.actionGetEnergy(creep)) {
                        let creepsInRoom = creep.room.find(FIND_MY_CREEPS);
                        if (_.sum(creepsInRoom, c => c.memory.role == "Hauler" && c.memory.task == "gatherMin") == 0) {
                            creep.memory.task = "gatherMin";
                        }
                    }
                    break;
                case "gatherMin":
                    if (_.sum(creep.carry) == creep.carryCapacity) {
                        creep.memory.task = "unload";
                        break;
                    }
                    if (!creep.actionGetMinerals(creep)) {
                        creep.memory.task = "gather";
                    }
                    break;
                case "gatherLab":
                    if ((_.sum(creep.carry) > 0)){ // creep.carryCapacity) || (creep.carry[creep.memory.taskTargetMin] + Game.getObjectById(creep.memory.taskTarget).mineralAmount) == 1000){
                        creep.actionGetLab(creep, "deliver", "stock");
                    } else {
                        creep.actionGetLab(creep, "gather", "stock");
                    }
                    break;
                case "deliverLab":
                    if ((_.sum(creep.carry) == creep.carryCapacity) || Game.getObjectById(creep.memory.taskTarget).mineralAmount == 0){
                        creep.actionGetLab(creep, "deliver", "store");
                    } else {
                        creep.actionGetLab(creep, "gather", "store");
                    }
                    break;
                case "unload":
                    if (_.sum(creep.carry) == 0) {
                        creep.memory.task = "gather";
                        break;
                    }
                    if (creep.carry[RESOURCE_ENERGY] > 0) {
                        creep.actionDeliverEnergy(creep);
                        break;
                    } else {
                        for (let i = 0; i < 8; i++) {
                            if (creep.carry[invTypes[i]] > 0) {
                            creep.actionDeliverMinerals(creep, invTypes[i]);
                            break;
                            }
                        }
                        break;
                    }
                case "manual":
                break;
                }
            }
        }
};