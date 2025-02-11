// priority: 800
/**
 * 固定路径行进Goal，在行进过程中允许随机查找周围的可用POI
 * @param {Internal.PathfinderMob} entity 
 * @returns 
 */
const RouteMoveGoal = (entity) => new $CustomGoal(
    'route_move',
    entity,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE) {
            //console.log('status routeMove Begin')
            return true
        }
        return false
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE) {
            //console.log('status routeMove Continue')
            return true
        }
        return false
    },
    true,
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // console.log('status routeMove BeginBehavior')
        let routeMoveModel = new EntityRouteMove(mob)
        routeMoveModel.setFindIntervalTimer(Math.floor(Math.random() * 120 + 60))
        if (routeMoveModel.recoverPos) {
            routeMoveModel.moveToRecoverPos(STANDARD_ROUTE_MOVE_DISTANCE)
            return
        }
        routeMoveModel.moveToCurPos()
    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // console.log('status routeMove StopBehavior')
        let routeMoveModel = new EntityRouteMove(mob)
        // 记录当前位置到恢复位置处，以在状态恢复时进行恢复
        routeMoveModel.setRecoverPos(GetEntityPosition(mob))
        // 停止寻路行为
        mob.navigation.stop()
        // 这意味着在这个状态结束时，整个AI会陷入一个停滞状态，为了让整个行为自然，需要在另一个状态对AI的行为进行细节规划
        // 这是一个规范，即在每个状态初始化的时候对状态进行设置，而不依赖于上一个状态结束时的设置
        // 状态结束时，仅针对行为进行重置，和需要的部分恢复信息的保存
    },
    false, // 是否每个tick都需要更新
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // console.log('status routeMove TickBehavior')
        let routeMoveModel = new EntityRouteMove(mob)
        // 尝试进行位置恢复
        if (routeMoveModel.recoverPos) {
            routeMoveModel.moveToRecoverPos(STANDARD_ROUTE_MOVE_DISTANCE)
            return
        }
        // 如果接近了目标地点
        if (routeMoveModel.checkArrivedCurMovePos(STANDARD_ROUTE_MOVE_DISTANCE)) {
            // 如果没有可以使用的下一个地点，则认为生命周期结束，切换到消亡状态
            if (!routeMoveModel.getNextMovePos()) return SetEntityStatus(mob, STATUS_DISMISS)
            // 则会将目标地点切换为下一地点，并且朝对应方向移动
            routeMoveModel.moveToNextPos()
        } else {
            // 否则会移动到当前目标地点
            routeMoveModel.moveToCurPos()
        }

        if (routeMoveModel.checkFindIntervalTimer()) {
            //console.log('status routeMove ShouldFind')
            SetEntityStatus(mob, STATUS_FIND_POI)
            return
        }
    }
)

/**
 * @param {Internal.PathfinderMob} entity 
 */
function SetRouteMoveGoal(entity) {
    entity.goalSelector.addGoal(10, RouteMoveGoal(entity))
}