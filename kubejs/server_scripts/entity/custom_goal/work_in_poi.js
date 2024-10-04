// priority: 801

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
    false,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        console.log('status workInPOI BeginBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiModel = workInPOIModel.getPOIData()
        if (!poiModel) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
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
    'kubejs:fish_shop': (workInPOIModel, poiModel) => FishShopWorkInInitStrategies(workInPOIModel, poiModel),
}

/**
 * POI商店策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock):void>}
 */
const ShopPOIWorkInTickStrategies = {
    'kubejs:fish_shop': (workInPOIModel, poiModel) => FishShopWorkInTickStrategies(workInPOIModel, poiModel),
}

/**
 * POI容器策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock, Internal.BlockContainerJS):void>}
 */
const CommonShopContainerStrategies = {
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
    'supplementaries:pedestal': function (workInPOIModel, poiModel, block) {
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

/**
 * @param {Internal.PathfinderMob} entity 
 */
function SetWorkInPOIGoal(entity) {
    entity.goalSelector.addGoal(1, WorkInPOIGoal(entity))
}