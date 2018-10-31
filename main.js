 // import modules
require('creeps.prototypeCreep');
require('structures.prototypeTower');
require('structures.prototypeSpawn');
require('structures.prototypeLab');
require('hud');
var Traveler = require('Traveler');
module.exports.loop = function() {
    Game.getObjectById("5bcc085e1aeeaa1bf693492e").runReaction(Game.getObjectById("5bcbd0707976796b9dc404ca"),Game.getObjectById("5bcbd4472699b2594a0255e0"));
    // check for memory entries of dead creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    // for each creeps
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }

    // find all towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
		tower.repairBuildings();
    }
    // for each spawn
    /*
    var isSpawning = null;
    for (let spawnName in Game.spawns) {
        // run spawn logic
        if (isSpawning == null) {
            isSpawning = Game.spawns[spawnName].SpawnCreeps();
        }
    } */
    for (let roomName in Game.rooms) {
        let roomSpawn = Game.rooms[roomName].find(FIND_MY_SPAWNS);
        if (roomSpawn.length > 0){
            roomSpawn[0].SpawnCreeps();
        }
    }
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].RepairCreeps();
        Game.spawns[spawnName].room.HUD(spawnName);
    }
};