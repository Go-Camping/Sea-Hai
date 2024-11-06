// priority: 950
/**
 * 快捷创建自定义NPC的实体
 * @param {Internal.Level} level 
 * @returns {Internal.EntityCustomNpc}
 */
function CreateCustomNPCEntity(level) {
    let entity = new $EntityCustomNpc('customnpcs:customnpc', level)
    // 如果不进行reset，则会导致一些cnpc的逻辑失效
    entity.reset()
    entity.advanced.interactLines.lines.clear()
    entity.display.setTitle('')
    entity.ais.setReturnsHome(false)
    entity.stats.setRespawnType(3)
    entity.ais.setDoorInteract(1)
    entity.ais.setCanSwim(true)
    entity.display.setShowName(NAME_INVISIBLE)
    return entity
}

/**
 * 
 * @param {Internal.Level} level 
 * @param {Internal.EntityCustomNpc} mob 
 * @param {BlockPos} pos 
 * @param {number} seatHeight
 * @param {Internal.Direction} direction
 * @returns {boolean}
 */
function SitOnChair(mob, pos, seatHeight, direction) {
    const level = mob.level
    if (level.getEntitiesOfClass($Seat.class, new AABB.ofBlock(pos)).isEmpty()) {
        let seatYaw = direction.getYaw()
        let seat = new $Seat(level, pos, seatHeight, seatYaw, true)
        level.addFreshEntity(seat)
        return mob.startRiding(seat)
    }
    return false
}


/**
 * 清空指定类型的台词
 * @param {Internal.EntityCustomNpc} mob 
 * @param {number} type 
 */
function ClearLine(mob, type) {
    let lineCount = mob.advanced.getLineCount(type)
    for (let i = 0; i < lineCount; i++) {
        mob.advanced.setLine(type, 0, '', '')
    }
}