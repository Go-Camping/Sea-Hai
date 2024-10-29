// priority: 800

/**
 * 寻找POI状态，在切换到该状态时，生物会集中于寻找可用的POI，并且模拟出对应的行为效果
 * @param {Internal.PathfinderMob} entity 
 * @returns 
 */
const FindPOIGoal = (entity) => new $CustomGoal(
    'find_poi',
    entity,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_FIND_POI) {
            //console.log('status findPOI Begin')
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_FIND_POI) {
            //console.log('status findPOI Continue')
            return true
        }
        return false
    },
    false,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // console.log('status findPOI BeginBehavior')
        let findPOIModel = new EntityFindPOI(mob)
        findPOIModel.setSpeed(0.5)
        findPOIModel.setIdleCenter(GetEntityPosition(mob).offset(0, -1, 0))
        findPOIModel.idleAroundCenter(5)
        findPOIModel.setIdleTimer(Math.floor(Math.random() * 60 + 20))
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // console.log('status findPOI StopBehavior')
        let findPOIModel = new EntityFindPOI(mob)
        if (GetEntityStatus(mob) == STATUS_WORK_IN_POI) {
            findPOIModel.markTargetPOI()
            findPOIModel.clearTargetPOI()
        }
        mob.navigation.stop()
    },
    true,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        let findPOIModel = new EntityFindPOI(mob)
        //console.log(`status findPOI TickBehavior ${findPOIModel.targetPOI}`)
        
        if (findPOIModel.checkIsIdleTime()) {
            //console.log('status findPOI idlingAround')
            return
        }
        if (findPOIModel.targetPOI) {
            if (findPOIModel.checkArriveTargetPOI(STANDARD_FIND_POI_DISTANCE)) {
                SetEntityStatus(mob, STATUS_WORK_IN_POI)
                let workInPOIModel = new EntityWorkInPOI(mob)
                workInPOIModel.setPOIPos(findPOIModel.targetPOI)
            }
            findPOIModel.moveToTargetPOI()
        } else {
            // todo 该部分先简单实现，在后续可以增添更多设计，思路可参考#commit 9aaa9919e0ce2bd252736f094695a211779388a9
            // 如果在这个阶段加上概率亦或是长时间停留，会让玩家误以为搜索效率低下，干扰判断
            // 考虑到本内容并非是核心玩法，因此降低整体延迟，最高化处理可能是最优解
            //console.log('status findPOI else')
            let poiList = findPOIModel.findAheadPOIs(entity, 8, 5)
            if (poiList.length <= 0) {
                SetEntityStatus(mob, STATUS_ROUTE_MOVE)
                return
            }
            // 兴趣匹配，该部分逻辑可以丰富化，暂时仅取第一个，即最近值
            let targetPOIPos = poiList[0]
            findPOIModel.setTargetPOI(targetPOIPos)
            // 这总会延后一个tick去行走至对应位置
        }
    },
)

/**
 * @param {Internal.PathfinderMob} entity 
 */
function SetFindPOIGoal(entity) {
    entity.goalSelector.addGoal(10, FindPOIGoal(entity))
}