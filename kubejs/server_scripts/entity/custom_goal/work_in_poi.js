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
        // 选择一个商店物品进行购买，并且尝试行走到对应的位置
        
    },
)