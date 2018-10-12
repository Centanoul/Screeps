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