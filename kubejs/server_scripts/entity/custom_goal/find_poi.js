// priority: 800

/**
 * 寻找POI状态，在切换到该状态时，生物会集中于寻找可用的POI，并且模拟出对应的行为效果
 * @param {Internal.PathfinderMob} entity 
 * @returns 
 */
const FindPOI = (entity) => new $CustomGoal(
    'find_poi',
    entity,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 何时能够使用
        if (GetEntityStatus(mob) == STATUS_FIND_POI) {
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 能否继续使用 
        if (GetEntityStatus(mob) == STATUS_FIND_POI) {
            return true
        }
        return false
    },
    true, // 是否允许中断
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 开启时执行
        let findPOIModel = new EntityFindPOI(mob)
        findPOIModel.setIdleCenter(GetEntityPosition(mob))
        findPOIModel.idleAroundCenter(3, 0.2)
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 停止时执行
    },
    false, // 是否每个tick都需要更新
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // tick
        // todo 该部分先简单实现，在后续可以增添更多设计，思路可参考#commit 9aaa9919e0ce2bd252736f094695a211779388a9
        // 如果在这个阶段加上概率亦或是长时间停留，会让玩家误以为搜索效率低下，干扰判断
        // 考虑到本内容并非是核心玩法，因此降低整体延迟，最高化处理可能是最优解
        let poiList = FindAheadPOIs(entity, 8, 5)
        
        if (poiList.length <= 0) SetEntityStatus(STATUS_ROUTE_MOVE)
        // 兴趣匹配，该部分逻辑可以丰富化，暂时仅取第一个，即最近值
        let targetPOIPos = poiList[0]
        mob.navigation.moveTo(targetPOIPos.x, targetPOIPos.y, targetPOIPos.z, 1.0)
        SetEntityStatus(STATUS_POI_MOVE)
    },
)