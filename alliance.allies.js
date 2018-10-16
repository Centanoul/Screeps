module.exports.isAlly = function(unknownObject) {
	if (["Centanoul", "Isktrasow"].indexOf(unknownObject.owner.username) >= 0){
		return true;
	} else { return false; }
};