// priority: 950
const $CustomGoal = Java.loadClass('net.liopyu.entityjs.util.ai.CustomGoal')
const $Vec3 = Java.loadClass('net.minecraft.world.phys.Vec3')

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

    },
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // 停止时执行
    },
    false, // 是否每个tick都需要更新
    /** @param {Internal.PathfinderMob} mob **/ mob => {
        // tick

        // 随机短距离游荡
        if (Math.random() < 0.05) {
            indPOIModel.idleAroundCenter(3, 0.2)
            return
        }

        // 在较小范围内寻找吸引力方块，这会使得AI的视线集中于该位置
        if (Math.random() < 0.3) {
            let attractiveBlockList = FindAroundAttractiveBlocks(entity, 5)
            // 此处可以添加一个兴趣值累积逻辑，避免频繁更换
            if (attractiveBlockList.length > 0) {
                /** @type {Internal.BlockPos$MutableBlockPos} */
                let attractieveBlock = RandomGet(attractiveBlockList)
                mob.lookControl["setLookAt(double,double,double)"](attractieveBlock.x, attractieveBlock.y, attractieveBlock.z)
            }
            return
        }

        // 在较小范围内寻找吸引力方块，这会使得AI的视线集中于该位置
        // 可以添加一个兴趣值的累积阈值，而不是通过概率控制
        if (Math.random() < 0.3) {
            // 在一个面向矩形范围内寻找POIs，扫描顺序从近到远。其中数字参数1决定了面朝方向的搜索范围，数字参数2决定了左右方向的搜索范围
            let poiList = FindAheadPOIs(entity, 8, 3)
            if (poiList.length > 0) {

            }
            // 兴趣匹配，该部分逻辑可以丰富化，暂时仅取第一个，即最近值
            let targetPOIPos = poiList[0]
            mob.navigation.moveTo(targetPOIPos.x, targetPOIPos.y, targetPOIPos.z, 1.0)
            SetEntityStatus(POI_MOVE)
            return
        }

        // 放弃该兴趣点的搜索
        if (Math.random() < 0.05) {
            SetEntityStatus(ROUTE_MOVE)
        }
    },
)