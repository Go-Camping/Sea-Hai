// priority: 950
const $CustomGoal = Java.loadClass('net.liopyu.entityjs.util.ai.CustomGoal')
const $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
/**
 * 
 * @param {Internal.PathfinderMob} entity 
 */
export function SetLongDistancePatrolGoal(entity) {
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
            if (routeMoveModel.checkArrivedCurMovePos(STANDARD_ROUTE_MOVE_DISTANCE)) {
                routeMoveModel.moveToNextPos()
            } else {
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