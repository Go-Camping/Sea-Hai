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
        findPOIConfig.put('idleTimer', 0)
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
     * @param {Number} speed
     * @returns {Boolean}
     */
    moveToPos: function (pos, speed) {
        if (!pos) return false
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, this.speed)
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
        // 如果正在寻路途径中，则让位给对应逻辑
        if (this.mob.navigation.isInProgress()) return
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        let idleAroundPos = idleCenter.offset(Math.random() * dist - dist / 2, 0, Math.random() * dist - dist / 2)
        let y = this.mob.level.getHeight('motion_blocking', idleAroundPos.x, idleAroundPos.z)
        // 存在一种情况，即当前所处位置并非是最高处，因此在Y有大差距的情况下，并不选择获取到的对应地点的Y，防止误寻路
        idleAroundPos.atY((y - idleCenter.y > 4) ? idleCenter.y : y)
        this.moveToPos(idleAroundPos, this.speed)
    },
    /**
     * 返回游荡中心
     * @param {Number} speed
     */
    backToIdleCenter: function () {
        let idleCenter = this.getIdleCenter()
        if (!idleCenter) return
        this.moveToPos(idleCenter.x, idleCenter.y, idleCenter.z, this.speed)
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
        this.moveToPos(targetPOI.x, targetPOI.y, targetPOI.z, this.speed)
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
     * 设置生物闲置时间，避免切换状态后立刻进行寻找
     * @param {Number} time
     */
    setIdleTimer: function (time) {
        this.findPOIConfig.put('idleTimer', time)
        this.idleTimer = time
    },
    /**
     * 校验生物闲置时间
     * @returns {Boolean}
     */
    checkIdleTime: function () {
        if (this.idleTimer <= 0) return true
        return false
    },
    /**
     * 减少生物闲置时间
     * @param {Number}
     */
    decreaseIdleTimer: function () {
        this.findPOIConfig.put('idleTimer', this.idleTimer - 1)
        this.idleTimer -= 1
    }
}