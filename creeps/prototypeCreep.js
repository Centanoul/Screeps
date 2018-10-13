//Define roles and path to role logic
var roles = {
    harvester: require('roleHarvester'),
    hauler: require('roleHauler'),
    logistics: require('roleLogistics'),
    upgrader: require('roleUpgrader')
}

//Try call 'role'+roleName+'.js', if undefined break for current creep.
Creep.prototype.runRole = function () {
	if(this.memory.role != undefined){
		roles[this.memory.role].run(this);
	}
}
