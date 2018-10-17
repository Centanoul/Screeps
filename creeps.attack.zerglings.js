module.exports = {
    run: function (creep) {
        let roomTarget = Game.flags.Attack;
        let roomRally = Game.flags.Rally;
        let commenceAttack = Game.flags.War;
        let targetCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: !{owner: {username: "Isktrasow"}} &&
                !{owner: {username: "Centanoul"}}
        });

        let targetStruc = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: !{owner: {username: "Isktrasow"}} &&
                !{owner: {username: "Centanoul"}}
        });
        switch (true) {
            case (commenceAttack != undefined &&
                roomTarget != undefined):
                attackTarget(creep, roomRally, roomTarget, commenceAttack, targetCreep, targetStruc);
                break;
            case (roomRally != undefined):
                attackRally(creep, roomRally, roomTarget, commenceAttack, targetCreep, targetStruc);
                break;
        }
    }
};

function attackRally(creep, roomRally, roomTarget){
	if (creep.pos.roomName != roomRally.pos.roomName){
		creep.travelTo(roomRally);
	} else {
		let path = creep.pos.findPathTo(roomTarget.pos, {maxOps: 200});
		if (!path.length){
			path = creep.pos.findPathTo(roomTarget.pos, {maxOps: 200, ignoreCreeps: true});
		}
		if (path.length > 2){
			creep.move(path[0].direction);
		}
		if (creep.ticksToLive<50){
			creep.pos.createFlag("War", COLOR_RED, COLOR_RED);
            Game.flags.Rally.remove();
		}
	}
}

function attackTarget(creep, roomTarget, targetCreep, targetStruc){
	if (creep.pos.roomName != roomTarget.pos.roomName){
		creep.moveTo(roomTarget.pos, {ignoreCreeps: true});
	} else {
		if (targetStruc != undefined){
			if (creep.attack(targetStruc) == ERR_NOT_IN_RANGE){
				creep.attack(targetCreep);
				creep.moveTo(targetStruc);
			}
		} else {
			if (targetCreep != undefined){
				if(creep.attack(targetCreep) == ERR_NOT_IN_RANGE){
					creep.moveTo(targetCreep);
				}
			} else {
				// End War
				Game.flags.Attack.remove();
				Game.flags.War.remove();
			}
		}
	}
}