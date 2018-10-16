//Define roles and path to role logic
var roles = {
    Harvester: require("creeps.roleHarvester"),
    Hauler: require("creeps.roleHauler"),
    Logistics: require("creeps.roleLogistics"),
    Upgrader: require("creeps.roleUpgrader")
}

//Try call 'role'+roleName+'.js', if undefined break for current creep.
Creep.prototype.runRole = function () {
		roles[this.memory.role].run(this);
	}
}