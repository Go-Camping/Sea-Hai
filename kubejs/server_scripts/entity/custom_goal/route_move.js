// priority: 950
const $CustomGoal = Java.loadClass('net.liopyu.entityjs.util.ai.CustomGoal')
const $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
/**
 * 
 * @param {Internal.PathfinderMob} entity 
 */
function SetLongDistancePatrolGoal(entity) {
    entity.goalSelector.addGoal(10, new $CustomGoal(
        'route_move',
        entity,
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 何时能够使用
            if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE) {
                return true
            }
            return false
        },
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 能否继续使用 
            if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE) {
                return true
            }
            return false
        },
        true, // 是否允许中断
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 开启时执行
            let routeMoveModel = new EntityRouteMove(mob)
            // 如果接近了目标地点
            if (routeMoveModel.checkArrivedCurMovePos(STANDARD_ROUTE_MOVE_DISTANCE)) {
                // 则会将目标地点切换为下一地点，并且朝对应方向移动
                routeMoveModel.moveToNextPos()
            } else {
                // 否则会移动到当前目标地点
                routeMoveModel.moveToCurPos()
            }
        },
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 停止时执行
        },
        false, // 是否每个tick都需要更新
        /** @param Internal.PathfinderMob} mob **/ mob => {
            // tick
        },
    ))
}