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
 * @param {BlockPos} chairPos 
 */
function SitOnChair(mob, chairPos) {
   if (!mob instanceof $EntityCustomNpc) return
   mob.ais.setAnimation(ANIMATION_SIT)
   let chairPosCenter = chairPos.getCenter()
   mob.teleportTo(chairPosCenter.x, chairPosCenter.y + 1, chairPosCenter.z)
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