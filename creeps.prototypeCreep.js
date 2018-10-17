//Define roles and path to role logic
var roles = {
    Harvester: require("creeps.roleHarvester"),
    Hauler: require("creeps.roleHauler"),
    Logistics: require("creeps.roleLogistics"),
    Upgrader: require("creeps.roleUpgrader"),
    Zergling: require("creeps.attack.zerglings")
};
//Try call 'role'+roleName+'.js', if undefined break for current creep.
Creep.prototype.runRole = function () {
	if(this.memory.role !== undefined){
		roles[this.memory.role].run(this);
	}
};

Creep.prototype.changeRoom = function () {
    if (this.memory.target == undefined || this.memory.target == ""){
        return false;
    }
    if (this.room.name != this.memory.target){
        let exit = this.room.findExitTo(this.memory.target);
        this.travelTo(this.pos.findClosestByRange(exit));
        return true;
    } else {
        return false;
    }
};