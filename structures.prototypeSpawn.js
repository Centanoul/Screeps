const ROLE_HARVESTER = "Harvester";
const ROLE_HAULER = "Hauler";
const ROLE_UPGRADER = "Upgrader";
const ROLE_LOGISTICS = "Logistics";
const ROLE_ZERGLING = "Zergling";
const HEALTH_EMERGENCY = 1;
const HEALTH_STRUGGLING = 2;
const HEALTH_HEALTHY = 3;

StructureSpawn.prototype.SpawnCreeps = function (){
	var health = this.assessHealth();
	var NRGBP = {"Harvester": this.NRGBreakpoints(health, ROLE_HARVESTER),
				"Hauler": this.NRGBreakpoints(health, ROLE_HAULER),
				"Upgrader": this.NRGBreakpoints(health, ROLE_UPGRADER),
				"Logistics": this.NRGBreakpoints(health, ROLE_LOGISTICS)};
	let creepsInRoom = this.room.find(FIND_MY_CREEPS);
	switch(true) {
		case Game.flags.Rally != undefined:
			this.War();
			break;
        case (this.room.energyAvailable >= NRGBP[ROLE_HARVESTER] &&
            this.assessRoleCaps(ROLE_HARVESTER)):
            this.SpawnCustomCreep(ROLE_HARVESTER);
            break;
        case (this.room.energyAvailable >= NRGBP[ROLE_HAULER] &&
            this.assessRoleCaps(ROLE_HAULER)):
            this.SpawnCustomCreep(ROLE_HAULER);
            break;
        case (this.room.energyAvailable >= NRGBP[ROLE_UPGRADER] &&
            this.assessRoleCaps(ROLE_UPGRADER)):
            this.SpawnCustomCreep(ROLE_UPGRADER);
            break;
        case (this.room.energyAvailable >= NRGBP[ROLE_LOGISTICS] &&
            this.assessRoleCaps(ROLE_LOGISTICS)):
            this.SpawnCustomCreep(ROLE_LOGISTICS);
            break;
        default:
            break;
    }
};

StructureSpawn.prototype.assessHealth = function (){
    let creepsInRoom = this.room.find(FIND_MY_CREEPS);
	let hp = _.sum(creepsInRoom, (c) => c.memory.role == ROLE_HARVESTER);
	let tmp;
	if (this.room.storage != undefined) {
        tmp = Math.log10((this.room.storage.store[RESOURCE_ENERGY]) - 3);
    }
	if (tmp > 0) { hp += Math.trunc(tmp); }
	return hp;
};

StructureSpawn.prototype.NRGBreakpoints = function (health, role){
	switch (role) {
        case ROLE_HARVESTER:
            switch (health) {
				case 0:
					return 300;
					break;
                case HEALTH_EMERGENCY:
                    return 300;
                    break;
                case HEALTH_STRUGGLING:
                    return (this.room.energyCapacityAvailable / 2);
                    break;
                case HEALTH_HEALTHY:
                    return Math.trunc(this.room.energyCapacityAvailable / 1.50);
                    break;
                default:
                    return this.room.energyAvailable;
                    break;
            }
            break;
        default:
            return this.room.energyCapacityAvailable;
    }
};

StructureSpawn.prototype.assessRoleCaps = function (role, returnCap){
	let creepsInRoom = this.room.find(FIND_MY_CREEPS);
    let containers;
    let sources = this.room.find(FIND_SOURCES);
    var roleCaps = {"Harvester": 0,
        "Hauler": 0,
        "Upgrader": 0,
        "Logistics": 0};
	switch (role) {
        case ROLE_HARVESTER:
            //HARVESTER CAP MATH
            roleCaps[ROLE_HARVESTER] = sources.length * 2;
            for (let source of sources) {
                containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                });
                if (containers.length > 0) {
                    roleCaps[ROLE_HARVESTER] -= 1;
                }
            }
            if (returnCap == true) {
                return roleCaps[role];
            } else {
                return _.sum(creepsInRoom, (c) => c.memory.role == ROLE_HARVESTER) < roleCaps[ROLE_HARVESTER];
            }
		case ROLE_HAULER:
		//HAULER CAP MATH
		let dropEnergy = this.room.find(FIND_DROPPED_RESOURCES, {
			filter: (d) => (d.amount >= 50 && d.resourceType == "energy")
		});
		let janitor = 0;

		if (dropEnergy.length) {janitor = 1;}
		for (let source of sources) {
            containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });
            if (containers.length > 0) {
                roleCaps[ROLE_HAULER]++;
            }
        }
        roleCaps[ROLE_HAULER] += janitor;
            if (returnCap == true) {
                return roleCaps[role];
            } else {
                return _.sum(creepsInRoom, (c) => c.memory.role == ROLE_HAULER) < roleCaps[ROLE_HAULER];
            }

		case ROLE_UPGRADER:
		//UPGRADER CAP MATH
			if(this.room.controller.level > 4) {
                roleCaps[ROLE_UPGRADER] = Math.trunc((this.room.controller.level)/4 + 2);
            } else {
                roleCaps[ROLE_UPGRADER] = Math.trunc(2);
			}

            if (returnCap == true) {
                return roleCaps[role];
            } else {
                return _.sum(creepsInRoom, (c) => c.memory.role == ROLE_UPGRADER) < roleCaps[ROLE_UPGRADER];
            }

		case ROLE_LOGISTICS:
		//LOGISTICS CAP MATH
		if (!_.some(FIND_STRUCTURES, w => w.hits < w.hitsMax && (w.structureType == STRUCTURE_WALL && w.structureType == STRUCTURE_RAMPART))){
			roleCaps[ROLE_LOGISTICS] += 1;}
		if (!_.some(FIND_STRUCTURES, s => s.hits < s.hitsMax && (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART))){
			roleCaps[ROLE_LOGISTICS] += 1;}
		if (this.room.find(FIND_CONSTRUCTION_SITES).length > 0){ roleCaps[ROLE_LOGISTICS] += 1; }
		if (this.room.find(FIND_CONSTRUCTION_SITES).length > 5){ roleCaps[ROLE_LOGISTICS] += 1; }
		let returnValue;
		if (returnCap == true) {
			return roleCaps[role];
		} else {
			return _.sum(creepsInRoom, (c) => c.memory.role == ROLE_LOGISTICS) < roleCaps[ROLE_LOGISTICS];
		}
	}
};

StructureSpawn.prototype.SpawnCustomCreep = function (role){
	let body = [];
	let mem = {role: "", task: ""};
    let creepsInRoom = this.room.find(FIND_MY_CREEPS);
    let x = 0;
    let sources = this.room.find(FIND_SOURCES);
	switch (role){
		case ROLE_HARVESTER:
			let miner = undefined;
			let harv = undefined;
            let containers;
            let mcan;
            for (let source of sources) {
                containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                });

                if (miner == undefined && harv == undefined) {
                	if (containers.length > 0) {
                    	if (_.sum(creepsInRoom, c => c.memory.role == ROLE_HARVESTER && c.memory.affinity == source.id) < 1) {
                    	    miner = source.id;
                            mcan = containers[0].id;
                    	}
                	} else {
                    	if (_.sum(creepsInRoom, c => c.memory.role == ROLE_HARVESTER && c.memory.affinity == source.id) < 2) {
                    	    harv = source.id;
                    	}
                	}
            	}
            }
			if (miner!=undefined) {
                let comp = 0;
                for (let i = 0; i < Math.trunc((this.room.energyAvailable - 50) / 100) && i < 7; i++) {
                    body.push(WORK);
                    comp++
                }
                if (comp != 0) {
                	body.push(MOVE);
                	mem = {role: ROLE_HARVESTER, task: "gather", affinity: miner, canid: mcan};
            	}
			} else {
				for (let i=0; i<Math.trunc(this.room.energyAvailable/200); i++){
					body.push(WORK);
					x++;
				}
				for (let i=0; i<x; i++){
					body.push(CARRY);
				}
                for (let i=0; i<x; i++){
                    body.push(MOVE);
                }
				mem = {role: ROLE_HARVESTER, task: "gather", affinity: harv};
			}
		break;
		
		case ROLE_HAULER:
			let hauler = "";
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory.role == ROLE_HAULER && c.memory.can != undefined)) {
                    hauler = source.getContainer();
				} else { hauler = "none"; }
            }
			for (let i=0; i<Math.trunc((this.room.energyAvailable)/100); i++){
				body.push(CARRY);
				x++;
			}
            for (let i=0; i<x; i++){
                body.push(MOVE);
            }
			mem = {role: ROLE_HAULER, task: "gather"};
		break;
		
		case ROLE_UPGRADER:
			for (let i=0; i<Math.trunc((this.room.energyAvailable)/200); i++){
				body.push(WORK);
				x++;
			}
            for (let i=0; i<x; i++){
                body.push(CARRY);
            }
            for (let i=0; i<x; i++){
                body.push(MOVE);
            }
			mem = {role: ROLE_UPGRADER, task: "gather"};
		break;
		
		case ROLE_LOGISTICS:
			for (let i=0; i<Math.trunc((this.room.energyAvailable)/200); i++){
                body.push(WORK);
                x++;
            }
            for (let i=0; i<x; i++){
                body.push(CARRY);
            }
            for (let i=0; i<x; i++){
                body.push(MOVE);
            }
			mem = {role: ROLE_LOGISTICS, task: "gather"};
		break;	
	}
	this.createCreep(body, this.NameSchema(role), mem);
};

StructureSpawn.prototype.NameSchema = function (role){
	let IDTag = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < 5; i++){
		IDTag += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	switch (role){
		case ROLE_HARVESTER:
			return "Drone "+IDTag;
		case ROLE_HAULER:
			return "Overlord "+IDTag;
		case ROLE_UPGRADER:
			return "Mutator "+IDTag;
		case ROLE_LOGISTICS:
			return "Queen "+IDTag;
		case ROLE_ZERGLING:
			return "Ling "+IDTag;
	}
};

StructureSpawn.prototype.RepairCreeps = function (){
    let creepsInRoom = this.room.find(FIND_MY_CREEPS);
    let nearCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, {
		filter: c => (c.ticksToLive <= 500)
	});
	if (nearCreep!=undefined){
		let tmp = nearCreep.ticksToLive;
		if(!this.renewCreep(nearCreep)){
			nearCreep.say("🔧");
        }
	}
};

StructureSpawn.prototype.War = function (){
	this.createCreep([ATTACK, MOVE], this.NameSchema(ROLE_ZERGLING), {role: ROLE_ZERGLING});
};