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
            //console.log('status workInPOI Begin')
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            //console.log('status workInPOI Continue')
            return true
        }
        return false
    },
    false,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        let workInPOIModel = new EntityWorkInPOI(mob)
        if (workInPOIModel.getSubStatus() != SUB_STATUS_NONE) return
        let poiBlock = workInPOIModel.getPOIBlock()
        if (!poiBlock) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        let poiBlockId = poiBlock.id
        if (!POIModelStrategies[poiBlockId]) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 初始化策略
        let poiModel = POIModelStrategies[poiBlockId](workInPOIModel, poiBlock)
        if (!poiModel.workInPOIInit()) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        //console.log('status workInPOI StopBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        if (workInPOIModel.getSubStatus() == SUB_STATUS_NONE) return
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
    },
    true,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        //console.log('status workInPOI TickBehavior')
        let workInPOIModel = new EntityWorkInPOI(mob)
        let poiBlock = workInPOIModel.getPOIBlock()
        if (!poiBlock) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
        // 进入此后，将逻辑分配到各个POI特性策略中，由各自POI管理自己的子状态流转
        // 但这并不意味着使用POI方块管理流转信息，如非必要，请通过实体来保存必要信息，但无需在Model中注册字段，以保证Model的可读性
        let poiBlockId = poiBlock.id
        // 不判空，因此要和init保持实现一致
        let poiModel = POIModelStrategies[poiBlockId](workInPOIModel, poiBlock)
        if (!poiModel.workInPOITick()) return SetEntityStatus(mob, STATUS_ROUTE_MOVE)
    },
)



/**
 * @param {Internal.PathfinderMob} entity 
 */
function SetWorkInPOIGoal(entity) {
    entity.goalSelector.addGoal(10, WorkInPOIGoal(entity))
}