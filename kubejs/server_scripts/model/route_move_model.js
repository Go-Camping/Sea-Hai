// priority: 900
const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const $ListTag = Java.loadClass('net.minecraft.nbt.ListTag')

/**
 * 创建点路径寻路对象
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function EntityRouteMove(mob) {
    // 若没有对应的字段，则进行强制初始化
    if (!mob.persistentData.contains('routeMove')) {
        let routeMoveConfig = new $CompoundTag()
        routeMoveConfig.putList('pointList', new $ListTag())
        routeMoveConfig.putInt('curPointNum', 0)
        mob.persistentData.put('routeMove', routeMoveConfig)
    }

    /** @type {BlockPos[]} */
    this.posList = []
    /** @type {Number} */
    this.curPointNum = 0
    /** @type {Internal.PathfinderMob} */
    this.mob = mob

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验
    this.routeMoveConfig = mob.persistentData.getCompound('routeMove')

    let pointNbtList = this.routeMoveConfig.getList('pointList', GET_COMPOUND_TYPE)
    this.posList = ConvertNbt2PosList(pointNbtList)

    this.curPointNum = this.routeMoveConfig.getInt('curPointNum')
}

EntityRouteMove.prototype = {
    /**
     * 设置生物状态
     * @param {String}
     * @returns {Boolean}
     */
    setStatus(newStatus) {
        // 跳转到新状态时，保存最后所在地点，以保证能够恢复位置
        let lastPos = this.mob.blockPosition()
        this.routeMoveConfig.put('lastPos', ConvertPos2Nbt(lastPos))
        return SetEntityStatus(this.mob, newStatus)
    },
    /**
     * 获取当前目标位置
     * @returns {BlockPos}
     */
    getCurMovePos: function () {
        if (this.posList.length <= this.curPointNum) return null
        return this.posList[this.curPointNum]
    },
    /**
     * 获取下一个目标位置
     * @returns {BlockPos}
     */
    getNextMovePos: function () {
        if (this.posList.length <= this.curPointNum + 1) return null
        return this.posList[this.curPointNum + 1]
    },
    /**
     * 是否到达当前位置
     * @param {Number} dist 
     * @returns 
     */
    checkArrivedCurMovePos: function (dist) {
        let curMovePos = this.getCurMovePos()
        // 没有位置，则认为已经到达位置
        if (!curMovePos) return true
        // 如果距离小于预期距离，则认为到达了对应位置
        if (this.mob.getPosition(1.0).distanceTo(curMovePos) <= dist) {
            return true
        }
        return false
    },
    /**
     * 实体移动到某位置
     * @param {BlockPos} pos 
     * @returns {Boolean}
     */
    moveToPos: function (pos) {
        if (!pos) return false
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, 1.0)
        return true
    },
    /**
     * 移动到目前目标位置
     */
    moveToCurPos: function () {
        this.moveToPos(this.getCurMovePos())
    },
    /**
     * 移动到下一目标位置
     */
    moveToNextPos: function () {
        this.moveToPos(this.getNextMovePos())
        this.curPointNum = this.curPointNum + 1
        this.routeMoveConfig.putInt('curPointNum', this.curPointNum)
    },
    /**
     * 在一定范围内寻找可用的POI
     * @param {number} dist 
     * @returns {Internal.BlockPos$MutableBlockPos[]}
     */
    findAheadPOIs: function (dist) {
        let blockPosList = FindDirectionNearBlocks(this.mob, dist, 5, -1, (level, blockPos) => {
            return level.getBlockState(blockPos).tags.anyMatch(tag => tag.equals(POI_ENTRANCE))
        })
        return blockPosList
    },
}