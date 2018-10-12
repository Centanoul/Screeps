var roles = {
    harvester: require('roleHarvester'),
    hauler: require('roleHauler'),
    logistics: require('roleLogistics'),
    upgrader: require('roleUpgrader')
}

Creep.prototype.runRole = function () {
	if(this.memory.role != undefined){
		roles[this.memory.role].run(this);
	}
}
