// priority: 950

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
 * @returns 
 */
function CreateCustomNPCEntity(level) {
    let entity = new $EntityCustomNpc('customnpcs:customnpc', level)
    entity.advanced.interactLines.lines.clear()
    entity.display.setTitle('')
    entity.ais.setReturnsHome(false)
    entity.stats.setRespawnType(3)
    entity.ais.setDoorInteract(1)
    entity.ais.setCanSwim(true)
    entity.display.setShowName(NAME_INVISIBLE)

    let navigation = entity.navigation
    navigation.nodeEvaluator.setCanOpenDoors(true)
    navigation.nodeEvaluator.setCanWalkOverFences(true)
    navigation.nodeEvaluator.setCanFloat(true)
    navigation.nodeEvaluator.setCanPassDoors(true)
    return entity
}