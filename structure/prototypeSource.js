//Returns Int:AdjacentFreeTiles
Source.prototype.getAccessPoints = function () {
	let points = 0;
	for (let x = -1; x < 2; x++) {
		for (let y = -1; y < 2; y++){
			let roomMap = Game.map.getRoomTerrain(this.room);
			if(roomMap.get(this.pos["x"]-x, this.pos["y"]-y) = 0 && (x*100 + y*10) != 0){
				points++;
			}
		}
	}
	return points;
}

//Returns Obj:Container
Source.prototype.getContainer = function () {
	if (this.memory.can != undefined){
		var can = this.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: c => (c.structureType == STRUCTURE_CONTAINER
		});
		if (can != undefined){
			this.memory.can = can.id;
			return Game.getObjectByID(this.memory.can);
		}
	} else { return Game.getObjectByID(this.memory.can); }