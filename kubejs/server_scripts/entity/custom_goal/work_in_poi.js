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
        let targetPOIModel = workInPOIModel.getTargetPOIData()
        if (!targetPOIModel) SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        switch (workInPOIModel.getSubStatus()) {
            case SUB_STATUS_MOVE_TO_CONTAINER:
                let poiBlockId = targetPOIModel.block.id
                if (!ShopPOIWorkInStrategies[poiBlockId]) SetEntityStatus(mob, STATUS_ROUTE_MOVE)
                ShopPOIWorkInStrategies[poiBlockId](workInPOIModel, targetPOIModel)
                break
            case SUB_STATUS_RETURN_TO_POI:
                break
            default:
                SetEntityStatus(mob, STATUS_ROUTE_MOVE)
                break
        }

    },
)

/**
 * POI商店策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock):void>}
 */
const ShopPOIWorkInStrategies = {
    'kubejs:fish_shop': function (workInPOIModel, targetPOIModel) {
        let posList = targetPOIModel.getPosList()
        let level = workInPOIModel.mob.level
        let validContainerBlocks = []
        posList.forEach(pos => {
            let tempBlock = level.getBlock(pos)
            if (!ShopContainerStrategies[tempBlock.id]) return
            let tempWeight = 1
            validContainerBlocks.push(new WeightRandom(tempBlock, tempWeight))
        })
        
        let selectedContainer = GetWeightRandomObj(validContainerBlocks)
        return
    },
}

/**
 * POI容器策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock, Internal.BlockContainerJS):void>}
 */
const ShopContainerStrategies = {
    'minecraft:chest': function (workInPOIModel, targetPOIModel, block) {

        return
    },
}