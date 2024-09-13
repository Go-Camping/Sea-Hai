// priority: 900
const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const $ListTag = Java.loadClass('net.minecraft.nbt.ListTag')

/**
 * 创建点路径寻路对象
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function EntityPOIMove(mob) {
    // 若没有对应的字段，则进行强制初始化
    if (!mob.persistentData.contains(POI_MOVE)) {
        let poiMoveConfig = new $CompoundTag()
        mob.persistentData.put(POI_MOVE, poiMoveConfig)
    }

    /** @type {Internal.PathfinderMob} */
    this.mob = mob

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验，但这仍旧会在部分人工修改内容的场景引发问题
    this.findPOIConfig = mob.persistentData.getCompound(FIND_POI)
}

EntityPOIMove.prototype = {
    /**
     * 实体移动到某位置
     * @param {BlockPos} pos 
     * @param {Number} speed
     * @returns {Boolean}
     */
    moveToPos: function (pos, speed) {
        if (!pos) return false
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, speed)
        // 该场景下，并不要求实体必须到达某个位置，因此，允许卡住的情况下直接放弃寻路并执行后续逻辑
        if (this.mob.navigation.isStuck()) {
            this.mob.navigation.stop()
            return false
        }
        return true
    },
    /**
     * 
     */
}