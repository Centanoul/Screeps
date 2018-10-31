Creep.prototype.actionGetLab = function (creep, task, type) {
    switch (type) {
        case "stock":
            switch (task) {
                case "gather":
                    let withdrawMin = creep.withdraw(creep.room.terminal, creep.memory.taskTargetMin);
                    //If Failed, Move to Terminal
                    if (withdrawMin == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.terminal);
                    }
                    break;
                case "deliver":
                    let depositMin = creep.transfer(Game.getObjectById(creep.memory.taskTarget), creep.memory.taskTargetMin);

                    if (depositMin == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.taskTarget));
                    }
                    /*
                    if (Game.getObjectById(creep.memory.target).mineralAmount == 1000) {
                        creep.memory.task = "gather";
                        delete creep.memory.taskTarget;
                        delete creep.memory.taskTargetMin;
                    }
                    */
                    break;
            }
        break;
        case "store":
            switch (task) {
                case "gather":
                    let withdrawMin = creep.withdraw(Game.getObjectById(creep.memory.taskTarget), creep.memory.taskTargetMin);

                    if (withdrawMin == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.taskTarget));
                    }
                break;
                case "deliver":
                    let depositMin = creep.transfer(creep.room.terminal, creep.memory.taskTargetMin);
                    //If Failed, Move to Terminal
                    if (depositMin == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.terminal);
                    }
                    /*
                    if (Game.getObjectById(creep.memory.target).mineralAmount == 0 &&
                        creep.carry[creep.memory.taskTargetMin] == 0) {
                        creep.memory.task = "gather";
                        delete creep.memory.taskTarget;
                        delete creep.memory.taskTargetMin;
                    }
                    */
                break;
            }
        break;
    }
};