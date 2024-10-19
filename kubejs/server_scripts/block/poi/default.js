// priority: 800
/**
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {ShopPOIBlock} poiBlockModel 
 */
function DefaultPOIModel(workInPOIModel, poiBlockModel) {
    this.workInPOIModel = workInPOIModel
    this.poiBlockModel = poiBlockModel
}

Object.assign(DefaultPOIModel.prototype, POIModel.prototype)

DefaultPOIModel.prototype = {
    workInPOIInit: function () {
        let poiBlockModel = this.poiBlockModel
        let workInPOIModel = this.workInPOIModel
        // 选择一个可用的POI容器
        let level = poiBlockModel.block.level
        let posList = poiBlockModel.getPosList()
        let validContainerBlocks = []
        posList.forEach(pos => {
            let tempBlock = level.getBlock(pos)
            // 这个容器必须有一个有效的取用方法
            if (!DefaultShopContainerStrategies[tempBlock.id]) return
            // 且simulate通过
            if (!DefaultShopContainerStrategies[tempBlock.id](workInPOIModel, poiBlockModel, tempBlock, true)) return
            // POI容器可以有权重，先均等概率
            let tempWeight = 1
            validContainerBlocks.push(new WeightRandom(tempBlock, tempWeight))
        })
    
        if (validContainerBlocks.length <= 0) return false
        /** @type {Internal.BlockContainerJS} */
        let selectedContainer = GetWeightRandomObj(validContainerBlocks)
        let selectedPos = selectedContainer.getPos()
        workInPOIModel.setTargetMovePos(selectedPos)
        workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
        return true
    },
    workInPOITick: function () {
        let poiBlockModel = this.poiBlockModel
        let workInPOIModel = this.workInPOIModel
        let level = workInPOIModel.mob.level
        let mob = workInPOIModel.mob
        switch (workInPOIModel.getSubStatus()) {
            case SUB_STATUS_MOVE_TO_CONTAINER:
                if (!workInPOIModel.getTargetMovePos()) return false
                // 子阶段意义为避免无用的判空，进而保证在异常情况下，能够通过check方法的降级正常跳出
                if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_POI_DISTANCE_SLOW)) {
                    workInPOIModel.moveToTargetPos()
                    return true
                }
                
                // 容器取出与结算逻辑
                let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
                if (!DefaultShopContainerStrategies[containerBlock.id]) {
                    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                    return true
                }
                DefaultShopContainerStrategies[containerBlock.id](workInPOIModel, poiBlockModel, containerBlock, false)
                if (workInPOIModel.isNeedBuyMore()) {
                    // 如果让本次购买多个，那么就重新运行一次初始化，这会可能导致taragetPos的变动。
                    this.workInPOIInit()
                    return true
                }
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                return true
            case SUB_STATUS_RETURN_TO_POI:
                if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_SLOW)) {
                    workInPOIModel.moveToPOIPos()
                    return true
                }
    
                if (mob.navigation.isInProgress()) {
                    if (workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
                        mob.navigation.stop()
                    } else {
                        mob.navigation.setSpeedModifier(0.1)
                    }
                }
    
                if (workInPOIModel.getConsumedMoney() <= 0) {
                    // 没有消费则直接返回
                    workInPOIModel.clearMovePos()
                    workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                    return false
                }
    
                if (poiBlockModel.checkIsShopping()) {
                    // 等待释放
                    return true
                } else {
                    // 金额计算逻辑
                    let consumedMoney = workInPOIModel.getConsumedMoney()
                    workInPOIModel.clearConsumedMoney()
                    poiBlockModel.startShopping(consumedMoney)
                    workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
                    return true
                }
                return true
            case SUB_STATUS_START_SHOPPING:
                let poiPos = workInPOIModel.poiPos
                mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
                if (poiBlockModel.checkIsShopping()) {
                    return true
                } else {
                    if (mob instanceof $EntityCustomNpc) {
                        // todo
                        mob.saySurrounding(new $Line('感觉很实惠！'))
                    }
                    workInPOIModel.clearMovePos()
                    workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                    mob.navigation.setSpeedModifier(1.0)
                    // 跳出子状态
                    return false
                }
                return true
            default:
                // 没有设置子状态会行进到这里，强制设置到初始化状态
                workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
                return true
        }
        return true
    }
}

