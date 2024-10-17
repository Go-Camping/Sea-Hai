// priority: 500
StardewFishing.miniGameStart(event => {
    let {player, fishBehavior} = event
    let fishingItem = getFishingRodInHand(player)
    if (!fishingItem) return

})

StardewFishing.miniGameEnd(event => {
    let {player, accuracy, fishSuccess} = event
    let fishingItem = getFishingRodInHand(player)
    if (!fishingItem) return
    event.getStoredRewards().get()
    // todo
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