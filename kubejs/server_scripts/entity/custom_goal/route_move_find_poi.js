// priority: 950
const $CustomGoal = Java.loadClass('net.liopyu.entityjs.util.ai.CustomGoal')
const $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')
/**
 * 
 * @param {Internal.PathfinderMob} entity 
 */
function SetLongDistancePatrolGoal(entity) {
    entity.goalSelector.addGoal(10, new $CustomGoal(
        'route_move_find_poi',
        entity,
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 何时能够使用
            if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE_FIND_POI) {
                return true
            }
            return false
        },
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 能否继续使用 
            if (GetEntityStatus(mob) == STATUS_ROUTE_MOVE_FIND_POI) {
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
                // 如果没有可以使用的下一个地点，则认为生命周期结束，切换到消亡状态
                if (!routeMoveModel.getNextMovePos()) routeMoveModel.setStatus(STATUS_DISMISS)
                // 则会将目标地点切换为下一地点，并且朝对应方向移动
                routeMoveModel.moveToNextPos()
            } else {
                // 否则会移动到当前目标地点
                routeMoveModel.moveToCurPos()
            }

            // poi寻找逻辑
            if (Math.random() > 0.2) return
            // 在一个面向矩形范围内寻找POIs，扫描顺序从近到远
            let poiList = routeMoveModel.findAheadPOIs(6)
            if (poiList.length <= 0) return
            // 兴趣匹配，该部分逻辑可以丰富化，暂时仅取第一个，即最近值
            let targetPOIPos = poiList[0]
            // for (let i = 0; i < poiList.length; i++) {
            //     break
            // }
            // 将该值写入兴趣信息空间
            let poiMoveNbt = new $CompoundTag()
            poiMoveNbt.put('curPOI', ConvertPos2Nbt(targetPOIPos))
            mob.persistentData.put(POI_MOVE, poiMoveNbt)
            // 保证连贯性，将目标地点切换为下一地点，并且朝对应方向移动
            routeMoveModel.moveToPos(targetPOIPos)
        },
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // 停止时执行
        },
        false, // 是否每个tick都需要更新
        /** @param {Internal.PathfinderMob} mob **/ mob => {
            // tick
        },
    ))
}