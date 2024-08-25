// priority: 1000
const $CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag')
const $ListTag = Java.loadClass('net.minecraft.nbt.ListTag')
/**
 * 获取生物状态
 * @param {Internal.PathfinderMob} mob 
 * @returns 
 */
function GetEntityStatus(mob) {
    if (mob.persistentData.contains('status')) {
        return mob.persistentData.getString('status')
    }
    return STATUS_IDLE
}

function EntityRouteMove(mob) {
    /** @type {BlockPos[]} */
    this.posList = []
    /** @type {Number} */
    this.curPointNum = 0
    /** @type {Internal.PathfinderMob} */
    this.mob = mob
    /** @type {Internal.CompoundTag} */
    this.routeMoveConfig = new $CompoundTag()
    if (!mob.persistentData.contains('routeMove')) return
    let routeMoveConfig = mob.persistentData.getCompound('routeMove')
    this.routeMoveConfig = routeMoveConfig
    if (routeMoveConfig.contains('pointList')) {
        let pointNbtList = routeMoveConfig.getList('pointList', GET_COMPOUND_TYPE)
        let posList = []
        pointNbtList.forEach(/** @param {Internal.CompoundTag} movePoint */movePoint => {
            posList.push(new BlockPos(movePoint.getInt('x'), movePoint.getInt('y'), movePoint.getInt('z')))
        })
        this.posList = posList
    }

    if (routeMoveConfig.contains('curPointNum')) {
        this.curPointNum = routeMoveConfig.getInt('curPointNum')
    }
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
        if (this.mob.getPosition(1.0).distanceTo(curMovePos) <= dist) {
            return true
        }
        return false
    },
    /**
     * 实体移动到某位置
     * @param {BlockPos} pos 
     */
    moveToPos: function (pos) {
        this.mob.getNavigation().moveTo(pos.x, pos.y, pos.z, 1.0)
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
     */
    findNearByPOIs: function (dist) {
        let movPos = this.mob.getPosition(1.0)
        FindNearBlocks(this.mob, dist, 3, -1, (level, blockPos) => {
            let block = level.getBlockState(blockPos)
            let res = block.tags.anyMatch(tag => {
                return tag.equals(POI_ENTRANCE)
            })
        })
    }
}


function ConvertPosListIntoNbt(posList) {
    let res = new $ListTag()
    posList.forEach(/** @param {BlockPos} pos */pos => {
        let nbt = new $CompoundTag()
        nbt.putInt('x', pos.getX())
        nbt.putInt('y', pos.getY())
        nbt.putInt('z', pos.getZ())
        res.add(nbt)
    })
    return res
}