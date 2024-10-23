// priority: 950
// todo 调试方法，需要删除
ItemEvents.rightClicked('minecraft:stick', event => {
    let { player } = event
    let pos = player.getPosition(1.0)
    /**@type {Internal.EntityCustomNpc} */
    let entity = CreateCustomNPCEntity(event.level)
    entity.setPos(pos.x(), pos.y(), pos.z())
    entity.display.setSkinTexture('kubejs:textures/entity/skin/player_1.png')
    entity.spawn()
})


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
   mob.teleportTo(chairPos.x, chairPos.y + 1, chairPos.z)
}
