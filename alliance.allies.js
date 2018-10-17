Creep.prototype.isAlly = function (unknownObject) {

	return ["Centanoul", "Isktrasow"].indexOf(unknownObject.owner.username) >= 0;
};