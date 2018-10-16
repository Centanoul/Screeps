const ROLE_HARVESTER = "Harvester"
const ROLE_HAULER = "Hauler"
const ROLE_UPGRADER = "Upgrader"
const ROLE_LOGISTICS = "Logistics"
const HEALTH_EMERGENCY = 1
const HEALTH_STRUGGLING = 2
const HEALTH_HEALTHY = 3

StructureSpawn.prototype.SpawnCreeps = function (){
	var health = this.assessHealth();
	var NRGBP = {ROLE_HARVESTER: this.NRGBreakpoints(health, ROLE_HARVESTER),
				ROLE_HAULER: this.NRGBreakpoints(health, ROLE_HAULER),
				ROLE_UPGRADER: this.NRGBreakpoints(health, ROLE_UPGRADER),
				ROLE_LOGISTICS: this.NRGBreakpoints(health, ROLE_LOGISTICS)};
	var creepsInRoom = room.find(FIND_MY_CREEPS);
	console.log("got here")
	switch(true){
		case (this.energyAvailable >= NRGBP[ROLE_HARVESTER] &&
				this.assessRoleCaps(ROLE_HARVESTER)): 
				SpawnCustom(ROLE_HARVESTER);
		break;
		case (this.energyAvailable >= NRGBP[ROLE_HAULER] &&
				this.assessRoleCaps(ROLE_HAULER)):  
				SpawnCustom(ROLE_HAULER);
		break;
		case (this.energyAvailable >= NRGBP[ROLE_UPGRADER] &&
				this.assessRoleCaps(ROLE_UPGRADER)):  
				SpawnCustom(ROLE_UPGRADER);
		break;
		case (this.energyAvailable >= NRGBP[ROLE_LOGISTICS] &&
				this.assessRoleCaps(ROLE_LOGISTICS)): 
				SpawnCustom(ROLE_LOGISTICS);
		break;
		default:
		break;
}

StructureSpawn.prototype.assessHealth = function (){
	let hp = _.sum(creepsInRoom, (c) => c.memory.role == ROLE_HARVESTER);
	let tmp = Math.log10((this.room.storage.store[RESOURCE_ENERGY])-3);
	if (tmp > 0) { hp += Math.trunc(tmp) };
	return hp;
}

StructureSpawn.prototype.NRGBreakpoints = function (health, role){
	switch (role){
		case ROLE_HARVESTER:
			switch (health){
				case HEALTH_EMERGENCY: return 300; break;
				case HEALTH_STRUGGLING: return (this.energyCapacity / 2); break;
				case HEALTH_HEALTHY: return this.energyCapacity; break;
				default: return this.energyAvailable; break;
			}
		break;
		default: return this.energyCapacity; break;
}

StructureSpawn.prototype.assessRoleCaps = function (role){
	let roleCaps = {ROLE_HARVESTER: 0, ROLE_HAULER: 0, ROLE_UPGRADER: 0, ROLE_LOGISTICS: 0}
	switch (role){
		case ROLE_HARVESTER:
		//HARVESTER CAP MATH
        let sources = room.find(FIND_SOURCES);
		roleCaps[ROLE_HARVESTER] = _.count(sources) * 2;
        for (let source of sources) {
            if (!_.some(creepsInRoom, c => c.memory.role == ROLE_HARVESTER && c.memory.affinity == source.id)) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                });
                if (containers.length > 0) {
                    roleCaps[ROLE_HARVESTER] -= 1;
                }
            }
        }
		if(_.sum(creepsInRoom, (c) => c.memory.role == ROLE_HARVESTER) < roleCaps[ROLE_HARVESTER]){ return true; } else { return false; }
		
		case ROLE_HAULER:
		//HAULER CAP MATH
		let dropEnergy = this.room.find(FIND_DROPPED_RESOURCES, {
			filter: (d) => (d.amount >= 50 && d.resourceType == "energy")
		});
		let janitor = 0;
		if (dropEnergy.length) {janitor = 1;}
		roleCaps[ROLE_HAULER] = containers.length + Math.trunc((this.room.controller.level / 2) - 2) + janitor;
		if(_.sum(creepsInRoom, (c) => c.memory.role == ROLE_HAULER) < roleCaps[ROLE_HAULER]){ return true; } else { return false; }
		
		case ROLE_UPGRADER:
		//UPGRADER CAP MATH
		roleCaps[ROLE_UPGRADER] = Math.trunc((this.room.controller.level / 2) + 2);
		if(_.sum(creepsInRoom, (c) => c.memory.role == ROLE_UPGRADER) < roleCaps[ROLE_UPGRADER]){ return true; } else { return false; }
		
		case ROLE_LOGISTICS:
		//LOGISTICS CAP MATH
		if (!_.some(FIND_STRUCTURES, w => w.hits < w.hitsMax && (w.structureType == STRUCTURE_WALL && w.structureType == STRUCTURE_RAMPART))) {
			roleCaps[ROLE_LOGISTICS] += 1;}
		if (!_.some(FIND_STRUCTURES, s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART))) {
			roleCaps[ROLE_LOGISTICS] += 1;}
		if (this.room.find(FIND_CONSTRUCTION_SITES).length > 0){ roleCaps[ROLE_LOGISTICS] += 1; }
		if (this.room.find(FIND_CONSTRUCTION_SITES).length > 5){ roleCaps[ROLE_LOGISTICS] += 1; }
		if(_.sum(creepsInRoom, (c) => c.memory.role == ROLE_LOGISTICS) < roleCaps[ROLE_LOGISTICS]){ return true; } else { return false; }
	}
}

StructureSpawn.prototype.SpawnCustom = function (role){
	let body = [];
	let mem = {role: "", task: ""}


	switch (role){
		case ROLE_HARVESTER:
			let miner = "";
			let harv = "";
            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory.role == ROLE_HARVESTER && c.memory.sourceId == source.id)) {
                    let containers = source.getContainer;
                    if (containers.length > 0) {
                        miner = source.id;
                    } else {
						if (!_.sum(creepsInRoom, c=> c.memory.role == ROLE_HARVESTER && c.memory.sourceId == source.id < 2)){
							harv = source.id;
						}
					}
                }
            }
			if (miner!=""){
				for (let i=0, i<=Math.trunc((this.energyAvailable-50)/100) && i<7, i++){
					body.push(WORK);
				}
				body.push(MOVE);
				mem = {role: ROLE_HARVESTER, task: "gather", affinity: miner};
			} else {
				let x=0;
				for (let i=0, i<=Math.trunc(this.energyAvailable/150), i++){
					body.push(WORK);
					x++;
				}
				for (let i=0, i<=x, i++){
					body.push(MOVE);
				}
				mem = {role: ROLE_HARVESTER, task: "gather", affinity: harv}
			}
		break;
		
		case ROLE_HAULER:
			let hauler = "";
            for (let source of sources) {
                if (!_.some(creepsInRoom, c => c.memory.role == ROLE_HAULER && c.memory.can != undefined)) {
                    hauler = source.getContainer();
				} else { hauler = "none"; }
            }
			for (let i=0, i<=Math.trunc((this.energyAvailable)/100), i++){
				body.push(CARRY);
				body.push(MOVE);
			}
			mem = {role: ROLE_HAULER, task: "gather", affinity: hauler};
		break;
		
		case ROLE_UPGRADER:
			for (let i=0, i<=Math.trunc((this.energyAvailable)/200), i++){
				body.push(WORK);
				body.push(CARRY);
				body.push(MOVE);
			}		
			mem = {role: ROLE_UPGRADER, task: "gather"};
		break;
		
		case ROLE_LOGISTICS:
			for (let i=0, i<=Math.trunc((this.energyAvailable)/200), i++){
				body.push(WORK);
				body.push(CARRY);
				body.push(MOVE);
			}		
			mem = {role: ROLE_LOGISTICS, task: "gather"};
		break;	
	}

	this.createCreep(body, this.NameSchema(role), mem);
}

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
	}
}

StructureSpawn.prototype.RepairCreeps = function (){
	let room = this.room;
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    let nearCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, {
		filter: c => (c.ticksToLive <= 500)
	});
	if (nearCreep!=undefined){
		let tmp = nearCreep.ticksToLive;
		if(!this.renewCreep(nearCreep)){nearCreep.say("🔧")};
	}
}