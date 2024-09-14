// priority: 800
/**
 * 释放，用于在最后回收该实体
 * @param {Internal.PathfinderMob} entity 
 * @returns 
 */
const DismissGoal = (entity) => new $CustomGoal(
    'dismiss',
    entity,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_DISMISS) {
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_DISMISS) {
            return true
        }
        return false
    },
    true,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        let pos = mob.getPosition(1.0)
        let mobX = pos.x()
        let mobY = pos.y()
        let mobZ = pos.z()
        for (let i = 0; i < DISMISS_SMOKE_PARTICLE_AMOUNT; i++) {
            let posX = mobX + Math.random()
            let posY = mobY + 0.25
            let posZ = mobZ + Math.random()
            mob.level.addParticle(ParticleTypes.SMOKE, posX, posY, posZ, DISMISS_SMOKE_PARTICLE_SPEED * 0.2, DISMISS_SMOKE_PARTICLE_SPEED, DISMISS_SMOKE_PARTICLE_SPEED * 0.2);
        }
        mob.remove($RemovalReason.DISCARDED)
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
    },
    false,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (mob.isAlive()) {
            mob.remove($RemovalReason.DISCARDED)
        }
    },
)
/**
 * @param {Internal.PathfinderMob} entity 
 */
function SetDismissGoal(entity) {
    entity.goalSelector.addGoal(10, DismissGoal(entity))
}