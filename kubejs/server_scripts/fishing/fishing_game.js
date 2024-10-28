// priority: 500
StardewFishing.miniGameStart(event => {
    let { player, fishBehavior } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    fishingItemHandler.allItems.forEach(item => {
        if (!FishingItemStrategy[item.id]) return
        let itemModel = FishingItemStrategy[item.id](item)
        itemModel.miniGameStart(event)
    })
})

StardewFishing.miniGameEnd(event => {
    let { player, accuracy, fishSuccess } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    fishingItemHandler.allItems.forEach(item => {
        if (!FishingItemStrategy[item.id]) return
        let itemModel = FishingItemStrategy[item.id](item)
        itemModel.miniGameEnd(event)
    })
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