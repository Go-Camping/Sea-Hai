// priority: 800

/**
 * 在POI中的行为
 * @param {Internal.PathfinderMob} entity 
 * @returns 
 */
const WorkInPOIGoal = (entity) => new $CustomGoal(
    'work_in_poi',
    entity,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            console.log('status workInPOI Begin')
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            console.log('status workInPOI Continue')
            return true
        }
        return false
    },
    true,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        console.log('status workInPOI BeginBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiModel = workInPOIModel.getPOIData()
        let poiBlockId = poiModel.block.id
        if (!ShopPOIWorkInInitStrategies[poiBlockId]) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 初始化策略
        if (!ShopPOIWorkInInitStrategies[poiBlockId](workInPOIModel, poiModel)) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        console.log('status workInPOI StopBehavior')
    },
    false,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        console.log('status workInPOI TickBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiModel = workInPOIModel.getPOIData()
        if (!poiModel) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 进入此后，将逻辑分配到各个POI特性策略中，由各自POI管理自己的子状态流转
        // 但这并不意味着使用POI方块管理流转信息，如非必要，请通过实体来保存必要信息，但无需在Model中注册字段，以保证Model的可读性
        let poiBlockId = poiModel.block.id
        // 不判空，因此要和init保持实现一致
        if (!ShopPOIWorkInTickStrategies[poiBlockId](workInPOIModel, poiModel)) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)

    },
)

/**
 * POI商店策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock):boolean>}
 */
const ShopPOIWorkInInitStrategies = {
    'kubejs:fish_shop': function (workInPOIModel, poiModel) {
        // 选择一个可用的POI容器
        let posList = poiModel.getPosList()
        let validContainerBlocks = []
        posList.forEach(pos => {
            let tempBlock = level.getBlock(pos)
            // 这个容器必须有一个有效的取用方法
            if (!ShopContainerStrategies[tempBlock.id]) return false
            // POI容器可以有权重
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
}

/**
 * POI商店策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock):void>}
 */
const ShopPOIWorkInTickStrategies = {
    'kubejs:fish_shop': function (workInPOIModel, poiModel) {
        let level = workInPOIModel.mob.level
        switch (workInPOIModel.getSubStatus()) {
            case SUB_STATUS_MOVE_TO_CONTAINER:
                // 分类移动中子阶段意义为避免无用的判空，进而保证在异常情况下，能够通过check方法的降级正常跳出
                if (!workInPOIModel.checkArrivedTargetMovePos(GO_TO_TARGET_POI_DISTANCE)) {
                    workInPOIModel.moveToTargetPos()
                    return true
                }
                // 容器取出与结算逻辑
                let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
                if (!ShopContainerStrategies[containerBlock.id]) {
                    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                    return true
                }
                ShopContainerStrategies[containerBlock.id](workInPOIModel, poiModel, containerBlock)
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                break
            case SUB_STATUS_RETURN_TO_POI:
                if (!workInPOIModel.checkArrivedPOIPos()) {
                    workInPOIModel.moveToPOIPos()
                    return true
                }
                // todo 启动POIBlockd的消费逻辑
                if (poiModel.checkIsShopping()) {
                    // 等待tick
                    return true
                }
                break
            default:
                // 没有设置子状态会行进到这里，强制设置到初始化状态
                workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
                return true
        }
        return true
    },
}

/**
 * POI容器策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock, Internal.BlockContainerJS):void>}
 */
const ShopContainerStrategies = {
    'minecraft:chest': function (workInPOIModel, poiModel, block) {
        let inv = block.getInventory()
        if (!inv) return
        let pickItem = ConsumeFirstItemOfInventory(inv, (testItem) => {
            return testItem.hasNBT() && testItem.nbt.contains('value')
        })
        if (!pickItem) return
        let value = pickItem.nbt.getInt('value')
        workInPOIModel.addConsumedMoney(value)
        return
    },
}