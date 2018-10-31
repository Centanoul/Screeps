
module.exports = {
    run: function (creep) {
        if (!creep.changeRoom()) {
            //Get mineral affinity
            let mineral = Game.getObjectById(creep.memory.affinity);
            let containers = Game.getObjectById(creep.memory.canid);
            if (containers != undefined) {
                //If on container
                if (creep.pos.isEqualTo(containers.pos)) {
                    //Harvest
                    creep.harvest(mineral);
                } else {
                    //Move to container
                    creep.moveTo(containers);
                }
            }
        }
    }
};