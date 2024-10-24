// priority: 500
StardewFishing.miniGameStart(event => {
    let { player, fishBehavior } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    player.tell(fishBehavior.getFishTexture())
    fishBehavior.setIdleTime(1)
    fishBehavior.setTopSpeed(20)
})

StardewFishing.miniGameEnd(event => {
    let { player, accuracy, fishSuccess } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    // todo 调试方法
    if (!fishSuccess) {
        if (accuracy <= 0.1) {
            let random = Math.random()
            switch (true) {
                case random <= 0.1:
                    $AquaFishingRodItem.getHandler(fishingItem).setStackInSlot(0, 'minecraft:air')
                    break
                case random <= 0.2:
                    $AquaFishingRodItem.getHandler(fishingItem).setStackInSlot(1, 'minecraft:air')
                    break
                case random <= 0.4:
                    $AquaFishingRodItem.getHandler(fishingItem).setStackInSlot(2, 'minecraft:air')
                    break
            }
        }

    }
})

/**
 * 
 * @param {Internal.ServerPlayer} player 
 * @returns {Internal.Item}
 */
function GetFishingRodInHand(player) {
    let fishingRod = player.getItemInHand($InteractionHand.MAIN_HAND)
    if (fishingRod.canPerformAction($ToolActions.FISHING_ROD_CAST)) {
        return fishingRod
    }
    fishingRod = player.getItemInHand($InteractionHand.OFF_HAND)
    if (fishingRod.canPerformAction($ToolActions.FISHING_ROD_CAST)) {
        return fishingRod
    }
    return null
}