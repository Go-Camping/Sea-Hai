// priority: 900

/**
 * 通过视野范围寻找POI位置
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function EntityFindPOI(mob) {
    // 若没有对应的字段，则进行强制初始化
    if (!mob.persistentData.contains(NBT_FIND_POI)) {
        let findPOIConfig = new $CompoundTag()
        findPOIConfig.put('markedPOIs', new $ListTag())
        findPOIConfig.put('idleCenter', new $CompoundTag())
        findPOIConfig.put('targetPOI', new $CompoundTag())
        findPOIConfig.putInt('idleTimer', 0)
        mob.persistentData.put(NBT_FIND_POI, findPOIConfig)
    }

    /** @type {Internal.PathfinderMob} */
    this.mob = mob
    /** @type {Number} */
    this.speed = 1

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验，但这仍旧会在部分人工修改内容的场景引发问题
    /** @type {Internal.CompoundTag} */
    this.findPOIConfig = mob.persistentData.getCompound(NBT_FIND_POI)
    /** @type {BlockPos[]} */
    this.markedPOIs = ConvertNbt2PosList(this.findPOIConfig.getList('markedPOIs', GET_COMPOUND_TYPE))
    /** @type {BlockPos} */
    this.targetPOI = ConvertNbt2Pos(this.findPOIConfig.getCompound('targetPOI'))
    /** @type {BlockPos} */
    this.idleCenter = ConvertNbt2Pos(this.findPOIConfig.getCompound('idleCenter'))
    /** @type {Number} */
    this.idleTimer = this.findPOIConfig.getInt('idleTimer')
}

EntityFindPOI.prototype = {
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
     * @returns {Boolean}
     */
    moveToPos: function (pos) {
        return NavigateWithDegrade(this.mob, pos, this.speed)
    },
    /**
     * 设置游荡中心点
     * @param {BlockPos} pos
     */
    setIdleCenter: function (pos) {
        if (!pos) return
        let idleCenterNbt = ConvertPos2Nbt(pos)
        this.idleCenter = pos
        this.findPOIConfig.put('idleCenter', idleCenterNbt)
    },
    /**
     * 获取游荡中心点
     * @returns {BlockPos}
     */
    getIdleCenter: function () {
        return this.idleCenter
    },
    /**
     * 寻路到游荡中心点附近的任意随机位置
     * @param {Number} dist
     * @param {Number} speed
     */
    idleAroundCenter: function (dist) {
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        let idleAroundPos = RandomOffsetPos(idleCenter, dist)
        let y = this.mob.level.getHeight('motion_blocking', idleAroundPos.x, idleAroundPos.z)
        // 存在一种情况，即当前所处位置并非是最高处，因此在Y有大差距的情况下，并不选择获取到的对应地点的Y，防止误寻路
        // idleAroundPos.atY((y - idleCenter.y > 4) ? idleCenter.y : y)
        this.moveToPos(idleAroundPos)
    },
    /**
     * 返回游荡中心
     * @param {Number} speed
     */
    backToIdleCenter: function () {
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        this.moveToPos(new BlockPos(idleCenter.x, idleCenter.y, idleCenter.z))
    },
    /**
     * 设置当前目标POI地点
     * @param {BlockPos} pos
     */
    setTargetPOI: function (pos) {
        if (!pos) return
        let targetPOINbt = ConvertPos2Nbt(pos)
        this.targetPOI = pos
        this.findPOIConfig.put('targetPOI', targetPOINbt)
    },
    /**
     * 获取当前POI地点
     * @returns {BlockPos}
     */
    getTargetPOI: function () {
        return this.targetPOI
    },
    /**
     * 移动到当前目标的POI地点
     * @returns {Boolean}
     */
    moveToTargetPOI: function () {
        let targetPOI = this.getTargetPOI()
        if (!targetPOI) return false
        this.moveToPos(new BlockPos(targetPOI.x, targetPOI.y, targetPOI.z))
        return true
    },
    /**
     * 校验是否已经到达目标POI地点
     * @param {Number} dist
     * @returns {Boolean}
     */
    checkArriveTargetPOI: function (dist) {
        let targetPOI = this.getTargetPOI()
        if (!targetPOI) return false
        if (this.mob.getPosition(1.0).distanceTo(new Vec3d(targetPOI.x, targetPOI.y, targetPOI.z)) <= dist) {
            return true
        }
        return false
    },
    /**
     * 清除当前的目标POI信息
     */
    clearTargetPOI: function () {
        this.findPOIConfig.put('targetPOI', new $CompoundTag())
        this.targetPOI = null
    },
    /**
     * 标记当前POI地点
     */
    markTargetPOI: function () {
        if (!this.getTargetPOI()) return
        this.markedPOIs.push(this.getTargetPOI())
        let markedPOIsNbt = ConvertPosList2Nbt(this.markedPOIs)
        this.findPOIConfig.put('markedPOIs', markedPOIsNbt)
    },
    /**
     * 检查该POI地点是否已经被标记
     * @param {BlockPos} pos
     * @returns {Boolean}
     */
    checkIsMarkedPOI: function (pos) {
        if (!pos) return false
        for (let i = 0; i < this.markedPOIs.length; i++) {
            if (this.markedPOIs[i].equals(pos)) return true
        }
        return false
    },
    /**
     * 设置生物闲置时间，避免切换状态后立刻进行寻找
     * @param {Number} time
     */
    setIdleTimer: function (time) {
        this.idleTimer = time + this.mob.totalTicksAlive
        this.findPOIConfig.putInt('idleTimer', this.idleTimer)
    },
    /**
     * 校验生物闲置时间
     * @returns {Boolean}
     */
    checkIsIdleTime: function () {
        if (this.idleTimer <= this.mob.totalTicksAlive) return false
        return true
    },
    /**
 * 在一定范围内寻找可用的POI
 * @param {Internal.PathfinderMob} mob 
 * @param {number} dist 
 * @returns {Internal.BlockPos$MutableBlockPos[]}
 */
    findAheadPOIs(mob, dist, secondaryRange) {
        let blockPosList = FindDirectionNearBlocks(mob, dist, secondaryRange, 3, -1, (level, blockPos) => {
            let targetBlock = level.getBlock(blockPos)
            if (targetBlock.blockState.isAir()) return false
            return targetBlock.tags.contains(TAG_POI_ENTRANCE)
        })
        return blockPosList.filter(blockPos => {
            return !this.checkIsMarkedPOI(blockPos)
        })
    }
}