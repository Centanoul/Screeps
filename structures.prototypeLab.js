Room.prototype.doScience = function (task, labID, labID2, labID3, mineral) {
    switch (task){
        case "assignInput":
            Game.getObjectById(labID).memory.input = mineral;
        break;
        case "assignOutput":
            Game.getObjectById(labID).memory.output = mineral;
        break;
        case "assignClear":
            delete Game.getObjectById(labID).memory;
        break;
        case "runReaction":
            Game.getObjectById(labID).runReaction(labID2, labID3);
        break;
    }
};