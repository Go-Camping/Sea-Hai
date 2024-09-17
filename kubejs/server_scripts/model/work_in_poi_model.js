// priority: 900

/**
 * 到达POI后实体的对象结构
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function EntityWorkInPOI(mob) {
    // 若没有对应的字段，则进行强制初始化
    if (!mob.persistentData.contains(NBT_WORK_IN_POI)) {
        let workInPOIConfig = new $CompoundTag()
        workInPOIConfig.put('targetPOIPos', new $CompoundTag())
        workInPOIConfig.putInt('subStatus', SUB_STATUS_MOVE_TO_CONTAINER)
        mob.persistentData.put(NBT_WORK_IN_POI, workInPOIConfig)
    }

    /** @type {Internal.PathfinderMob} */
    this.mob = mob
    /** @type {Number} */
    this.speed = 1

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验，但这仍旧会在部分人工修改内容的场景引发问题
    /** @type {Internal.CompoundTag} */
    this.workInPOIConfig = mob.persistentData.getCompound(NBT_WORK_IN_POI)

    /** @type {BlockPos} */
    this.targetPOIPos = ConvertNbt2Pos(this.workInPOIConfig.getCompound('targetPOIPos'))
    /** @type {Number} */
    this.subStatus = this.workInPOIConfig.getInt('subStatus')
}

EntityWorkInPOI.prototype = {
    /**
     * 设置速度（非持久化）
     * @param {Number} speed
     */
    setSpeed: function (speed) {
        this.speed = speed
        return
    },
    /**
     * 实体移动到某位置
     * @param {BlockPos} pos 
     * @param {Number} speed
     * @returns {Boolean}
     */
    moveToPos: function (pos) {
        if (!pos) return false
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, this.speed)
        return true
    },
    /**
     * 移动到目标POI位置
     */
    moveToTargetPOI: function () {
        this.moveToPos(this.targetPOIPos)
    },
    /**
     * 是否到达目标POI
     * @returns {Boolean}
     */
    checkArrivedTargetPOI: function () {
        if (!this.targetPOIPos) return true
        if (this.mob.getPosition(1.0).distanceTo(this.targetPOIPos) <= GO_TO_TARGET_POI_DISTANCE) {
            return true
        }
        return false
    },
    /**
     * 设置目标POI位置
     * @param {BlockPos} pos 
     */
     setTargetPOIPos: function (pos) {
        if (!pos) return
        this.targetPOIPos = pos
        this.workInPOIConfig.put('targetPOIPos', ConvertPos2Nbt(pos))
        return
    },
    /**
     * 获取目标POI的容器对象
     * @returns {ShopPOIBlock}
     */
     getTargetPOIData: function () {
        let level = this.mob.level
        let poiBlock = level.getBlock(this.targetPOIPos)
        if (poiBlock.entity) return null
        return new ShopPOIBlock(poiBlock)
    },
    /**
     * 进入子状态
     * @param {Number} subStatus 
     */
    setSubStatus: function (subStatus) {
        this.subStatus = subStatus
        this.workInPOIConfig.putInt('subStatus', subStatus)
        return
    },
    /**
     * 获取子状态
     * @returns {Number}
     */
    getSubStatus: function () {
        return this.subStatus
    },
}