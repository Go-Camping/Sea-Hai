// priority: 500
StardewFishing.miniGameStart(event => {
    const { player } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    let fishingItemList = []
    fishingItemHandler.allItems.forEach(item => {
        fishingItemList.push(item.id)
    })
    FishingItemMiniGameStartStrategy.run(fishingItemList, [event])
    FishingMiniGameStartSkill.run(player, [event])
})

StardewFishing.miniGameEnd(event => {
    const { player } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    let fishingItemList = []
    fishingItemHandler.allItems.forEach(item => {
        fishingItemList.push(item.id)
    })
    FishingItemMiniGameEndStrategy.run(fishingItemList, [event])
    FishingMiniGameEndSkill.run(player, [event])
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