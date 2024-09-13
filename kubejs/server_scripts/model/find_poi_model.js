// priority: 900
const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const $ListTag = Java.loadClass('net.minecraft.nbt.ListTag')

/**
 * 创建点路径寻路对象
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function EntityFindPOI(mob) {
    // 若没有对应的字段，则进行强制初始化
    if (!mob.persistentData.contains(FIND_POI)) {
        let findPOIConfig = new $CompoundTag()
        findPOIConfig.put('markedPOIs', new $ListTag())
        mob.persistentData.put(FIND_POI, findPOIConfig)
    }

    /** @type {Internal.PathfinderMob} */
    this.mob = mob
    

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验，但这仍旧会在部分人工修改内容的场景引发问题
    this.findPOIConfig = mob.persistentData.getCompound(FIND_POI)
    this.markedPOIs = ConvertNbt2PosList(this.findPOIConfig.getList('markedPOIs', GET_COMPOUND_TYPE))
}

EntityFindPOI.prototype = {
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
     * 设置游荡中心点
     * @param {BlockPos} pos
     * @returns {Boolean}
     */
    setIdleCenter: function (pos) {
        if (!pos) return false
        let idleCenterNbt = ConvertPos2Nbt(pos)
        this.findPOIConfig.put('idleCenter', idleCenterNbt)
        return true
    },
    /**
     * 获取游荡中心点
     * @returns {BlockPos}
     */
    getIdleCenter: function () {
        if (!this.findPOIConfig.contains('idleCenter')) return null
        let idleCenterNbt = this.findPOIConfig.getCompound('idleCenter')
        return ConvertNbt2Pos(idleCenterNbt)
    },
    /**
     * 寻路到游荡中心点附近的任意随机位置
     * @param {Number} dist
     * @param {Number} speed
     */
    idleAroundCenter: function (dist, speed) {
        // 如果正在寻路途径中，则让位给对应逻辑
        if (this.mob.navigation.isInProgress()) return
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        let idleAroundPos = idleCenter.offset(Math.random() * dist - dist / 2, 0, Math.random() * dist - dist / 2)
        let y = this.mob.level.getHeight('motion_blocking', idleAroundPos.x, idleAroundPos.z)
        idleAroundPos.y = y
        this.moveToPos(idleAroundPos.x, idleAroundPos.y, idleAroundPos.z, speed)
    },
    /**
     * 返回游荡中心
     * @param {Number} speed
     */
    backToIdleCenter: function (speed) {
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        this.moveToPos(idleCenter.x, idleCenter.y, idleCenter.z, speed)
    },
}