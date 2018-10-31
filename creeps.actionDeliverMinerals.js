Creep.prototype.actionDeliverMinerals = function (creep, mineral) {
		switch(1){
            case termMIN(creep, mineral): return 1;
            case storageMIN(creep, mineral): return 1;
			default: return 0;
	}
};

function termMIN(creep, mineral){
    let terminal = creep.room.terminal;
    if (terminal != undefined){
        if (creep.transfer(terminal, mineral) == ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal);
        }
        return 1;
    } else { return 0; }
}

function storageMIN(creep, mineral){
	let storage = creep.room.storage;
	if (storage != undefined){
		if (creep.transfer(storage, mineral) == ERR_NOT_IN_RANGE) {
			creep.moveTo(storage);
		}
		return 1;
	} else { return 0; }
}