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
    if (!mob.persistentData.contains(ROUTE_MOVE)) {
        let routeMoveConfig = new $CompoundTag()
        routeMoveConfig.putList('pointList', new $ListTag())
        routeMoveConfig.putInt('curPointNum', 0)
        mob.persistentData.put(ROUTE_MOVE, routeMoveConfig)
    }

    /** @type {BlockPos[]} */
    this.posList = []
    /** @type {Number} */
    this.curPointNum = 0
    /** @type {Internal.PathfinderMob} */
    this.mob = mob

    // 由于有强制初始化，理想化均包含这些字段，不进行额外空校验
    this.routeMoveConfig = mob.persistentData.getCompound(ROUTE_MOVE)

    let pointNbtList = this.routeMoveConfig.getList('pointList', GET_COMPOUND_TYPE)
    this.posList = ConvertNbt2PosList(pointNbtList)

    this.curPointNum = this.routeMoveConfig.getInt('curPointNum')
}

EntityRouteMove.prototype = {
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
        // 由于设置地点均为地面，对于生物而言，其中心位置往往在上方一格，因此在判断距离的时候使判断点上移一格
        if (this.mob.getPosition(1.0).distanceTo(curMovePos.above()) <= dist) {
            return true
        }
        return false
    },
    /**
     * 实体移动到某位置
     * @param {BlockPos} pos 
     * @param {Number} speed
     * @returns {Boolean}
     */
    moveToPos: function (pos, speed) {
        if (!pos) return false
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, speed)
        return true
    },
    /**
     * 移动到目前目标位置
     */
    moveToCurPos: function () {
        this.moveToPos(this.getCurMovePos(), 1.0)
    },
    /**
     * 移动到下一目标位置
     */
    moveToNextPos: function () {
        this.moveToPos(this.getNextMovePos(), 1.0)
        this.curPointNum = this.curPointNum + 1
        this.routeMoveConfig.putInt('curPointNum', this.curPointNum)
    },
    /**
     * 设置恢复位置，用于在状态切换时，恢复到上一次的位置
     * @param {BlockPos} pos 
     * @returns {Boolean}
     */
    setRecoverPos: function (pos) {
        if (!pos) return false
        let recoverPosNbt = ConvertPos2Nbt(pos)
        this.routeMoveConfig.put('recoverPos', recoverPosNbt)
        return true
    },
    /**
     * 获取恢复位置
     * @returns {BlockPos}
     */
    getRecoverPos: function () {
        if (!this.routeMoveConfig.contains('recoverPos')) return null
        let recoverPosNbt = this.routeMoveConfig.getCompound('recoverPos')
        return ConvertNbt2Pos(recoverPosNbt)
    },
    /**
     * 移动到恢复位置，并且在到达时清除恢复信息
     * @param {Number} dist
     * @returns {Boolean}
     */
    moveToRecoverPos: function (dist) {
        let recoverPos = this.getRecoverPos()
        if (!recoverPos) return false
        if (this.checkArrivedCurMovePos(dist)) {
            this.routeMoveConfig.remove('recoverPos')
        }
        this.moveToPos(recoverPos, 1.0)
        return true
    }
}