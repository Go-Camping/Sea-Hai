// priority: 500
StardewFishing.miniGameStart(event => {
    let {player, fishBehavior} = event
    let fishingItem = getFishingRodInHand(player)
    if (!fishingItem) return
    player.tell(fishBehavior.getFishTexture())
    fishBehavior.setIdleTime(1)
    fishBehavior.setTopSpeed(20)
})

StardewFishing.miniGameEnd(event => {
    let {player, accuracy, fishSuccess} = event
    let fishingItem = getFishingRodInHand(player)
    if (!fishingItem) return
    // todo 调试方法
    player.tell(2)
})

/**
 * 
 * @param {Internal.ServerPlayer} player 
 * @returns 
 */
function getFishingRodInHand(player) {
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