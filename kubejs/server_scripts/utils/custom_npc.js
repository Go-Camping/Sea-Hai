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
 * @param {boolean} lock
 * @returns {boolean}
 */
function SitOnChair(mob, pos, seatHeight, direction, lock) {
    let level = mob.level
    if (level.getEntitiesOfClass($Seat, new AABB.of(pos.getX(), pos.getY(), pos.getZ(), pos.getX() + 1.0, pos.getY() + 1.0, pos.getZ() + 1.0)).isEmpty()) {
        let seatYaw = direction.getYaw()
        let seat = new $Seat(level)
        seat.setPos(Vec3d.atBottomCenterOf(pos).add(0, seatHeight, 0))
        // seat.setRotation(seatYaw, 0)
        // $Seat.LOCK_YAW.setValue(seat, lock)
        level.addFreshEntity(seat)
        return mob.startRiding(seat)
    }
    return false
}

/**
 * 校验椅子是否被坐
 * @param {Internal.BlockContainerJS} chairBlock 
 * @param {Internal.Level} level 
 * @returns {boolean}
 */
function IsAnyOnChair(chairBlock) {
    const chairPos = chairBlock.pos
    let seats = chairBlock.level.getEntitiesOfClass($Seat, new AABB.of(chairPos.getX(), chairPos.getY(), chairPos.getZ(), chairPos.getX() + 1.0, chairPos.getY() + 1.0, chairPos.getZ() + 1.0))
    return !seats.isEmpty()
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

/**
 * 
 * @param {Internal.EntityCustomNpc} target 
 * @param {string} type 
 * @returns 
 */
function NPCSaySurrounding(target, type) {
    if (!target instanceof $EntityCustomNpc) return
    let typeLine = RandomGet(NPC_SURROUNDING_LINE_MAP[type])
    target.saySurrounding(new $Line(Text.translatable(typeLine).getString()))
}