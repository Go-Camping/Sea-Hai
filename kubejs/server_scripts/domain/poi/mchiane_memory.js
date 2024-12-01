// priority: 500
BlockEvents.rightClicked('#kubejs:poi_entrance', event => {
    if (event.player.shiftKeyDown) return
    if (!event.block.entity) return
    event.block.entity.persistentData.putUUID('interactPlayer', event.player.uuid)
    event.block.entity.setChanged()
})