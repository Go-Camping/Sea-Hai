// priority: 500
/**
 * 机器记忆，部分机械的功能需要在获取当前打开窗口的玩家
 * 因此需要在交互时进行交互记录
 */
BlockEvents.rightClicked('#kubejs:poi_entrance', event => {
    if (event.player.shiftKeyDown) return
    if (!event.block.entity) return
    event.block.entity.persistentData.putUUID('interactPlayer', event.player.uuid)
    event.block.entity.setChanged()
})