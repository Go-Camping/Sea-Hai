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
        workInPOIConfig.put('poiPos', new $CompoundTag())
        workInPOIConfig.putInt('subStatus', SUB_STATUS_MOVE_TO_CONTAINER)
        workInPOIConfig.put('targetMovePos', new $CompoundTag())
        workInPOIConfig.putInt('consumedMoney', 0)
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
    this.poiPos = ConvertNbt2Pos(this.workInPOIConfig.getCompound('poiPos'))
    /** @type {Number} */
    this.subStatus = this.workInPOIConfig.getInt('subStatus')
    /** @type {BlockPos} */
    // 通用空间，用于存储策略中的通用移动位置
    this.targetMovePos = ConvertNbt2Pos(this.workInPOIConfig.getCompound('targetMovePos'))
    /** @type {Number} */
    this.consumedMoney = this.workInPOIConfig.getInt('consumedMoney')
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
    moveToPOIPos: function () {
        this.moveToPos(this.poiPos)
    },
    /**
     * 是否到达目标POI
     * @returns {Boolean}
     */
    checkArrivedPOIPos: function () {
        if (!this.poiPos) return true
        if (this.mob.getPosition(1.0).distanceTo(this.poiPos) <= GO_TO_TARGET_POI_DISTANCE) {
            return true
        }
        return false
    },
    /**
     * 设置目标POI位置
     * @param {BlockPos} pos 
     */
     setPOIPos: function (pos) {
        if (!pos) return
        this.poiPos = pos
        this.workInPOIConfig.put('poiPos', ConvertPos2Nbt(pos))
        return
    },
    /**
     * 获取目标POI的容器对象
     * @returns {ShopPOIBlock}
     */
     getPOIData: function () {
        let level = this.mob.level
        let poiBlock = level.getBlock(this.poiPos)
        if (!poiBlock.entity) return null
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
    /**
     * 设置目标移动位置
     * @param {BlockPos} pos
     */
    setTargetMovePos: function (pos) {
        if (!pos) return
        this.targetMovePos = pos
        this.workInPOIConfig.put('targetMovePos', ConvertPos2Nbt(pos))
        return
    },
    /**
     * 获取目标移动位置
     * @returns {BlockPos}
     */
    getTargetMovePos: function () {
        return this.targetMovePos
    },
    /**
     * 清除目标位置
     */
    clearMovePos: function () {
        this.targetMovePos = null
        this.workInPOIConfig.put('targetMovePos', new $CompoundTag())
        return
    },
    /**
     * 移动到目标POI位置
     */
    moveToTargetPos: function () {
        this.moveToPos(this.targetMovePos)
    },
    /**
     * 是否到达目标位置
     * @param {Number} dist
     * @returns {Boolean}
     */
    checkArrivedTargetMovePos: function (dist) {
        if (!this.targetMovePos) return true
        if (this.mob.getPosition(1.0).distanceTo(this.targetMovePos) <= dist) {
            return true
        }
        return false
    },
    /**
     * 设置消耗的金币数量
     * @param {Number} consumedMoney
     */
    addConsumedMoney: function (consumedMoney) {
        this.consumedMoney = consumedMoney + this.consumedMoney
        this.workInPOIConfig.putInt('consumedMoney', this.consumedMoney)
        return
    },
    /**
     * 获取消耗的金币数量
     * @returns {Number}
     */
    getConsumedMoney: function () {
        return this.consumedMoney
    },
    /**
     * 清除消耗的金币数量
     */
    clearConsumedMoney: function () {
        this.consumedMoney = 0
        this.workInPOIConfig.putInt('consumedMoney', 0)
        return
    },
}