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
        // 何时能够使用
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            console.log('status workInPOI Begin')
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 能否继续使用 
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            console.log('status workInPOI Continue')
            return true
        }
        return false
    },
    true, // 是否允许中断
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 开启时执行
        console.log('status workInPOI BeginBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiModel = workInPOIModel.getPOIData()
        let poiBlockId = poiModel.block.id
        if (!ShopPOIWorkInInitStrategies[poiBlockId]) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 初始化策略
        ShopPOIWorkInInitStrategies[poiBlockId](workInPOIModel, poiModel)
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 停止时执行
        console.log('status workInPOI StopBehavior')
    },
    false, // 是否每个tick都需要更新
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // tick
        console.log('status workInPOI TickBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiModel = workInPOIModel.getPOIData()
        if (!poiModel) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 进入此后，将逻辑分配到各个POI特性策略中，由各自POI管理自己的子状态流转
        // 但这并不意味着使用POI方块管理流转信息，如非必要，请通过实体来保存必要信息，但无需在Model中注册字段，以保证Model的可读性
        let poiBlockId = poiModel.block.id
        // 不判空，因此要和init保持实现一致
        ShopPOIWorkInTickStrategies[poiBlockId](workInPOIModel, poiModel)

    },
)

/**
 * POI商店策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock):void>}
 */
const ShopPOIWorkInInitStrategies = {
    'kubejs:fish_shop': function (workInPOIModel, poiModel) {
        // 选择一个可用的POI容器
        let posList = poiModel.getPosList()
        let validContainerBlocks = []
        posList.forEach(pos => {
            let tempBlock = level.getBlock(pos)
            // 这个容器必须有一个有效的取用方法
            if (!ShopContainerStrategies[tempBlock.id]) return
            // POI容器可以有权重
            let tempWeight = 1
            validContainerBlocks.push(new WeightRandom(tempBlock, tempWeight))
        })
        /** @type {Internal.BlockContainerJS} */
        let selectedContainer = GetWeightRandomObj(validContainerBlocks)
        let selectedPos = selectedContainer.getPos()
        workInPOIModel.setTargetMovePos(selectedPos)
        workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
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
                    return
                }
                // 容器取出与结算逻辑
                let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
                if (!ShopContainerStrategies[containerBlock.id]) return workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                let coinAmount = ShopContainerStrategies[containerBlock.id]
                // todo 携带逻辑
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                break
            case SUB_STATUS_RETURN_TO_POI:
                if (!workInPOIModel.checkArrivedPOIPos()) {
                    workInPOIModel.moveToPOIPos()
                    return
                }
                // todo 启动POIBlockd的消费逻辑
                break
            default:
                // 没有设置子状态会行进到这里，强制设置到初始化状态
                workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
                return
        }
        return
    },
}

/**
 * POI容器策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock, Internal.BlockContainerJS):void>}
 */
const ShopContainerStrategies = {
    'minecraft:chest': function (workInPOIModel, poiModel, block) {

        return
    },
}