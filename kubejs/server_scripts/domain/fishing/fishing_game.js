// priority: 500
StardewFishing.miniGameStart(event => {
    const { player } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    /**@type {FishingItemModel[]} */
    let strategyList = []
    fishingItemHandler.allItems.forEach(item => {
        if (!FishingItemStrategy[item.id]) return
        let itemModel = FishingItemStrategy[item.id](item)
        strategyList.push(itemModel)
    })
    strategyList.sort((a, b) => b.priority - a.priority).forEach(itemModel => {
        itemModel.miniGameStart(event)
    })
    FishingMiniGameStartSkill.run(player, [event])
})

StardewFishing.miniGameEnd(event => {
    const { player } = event
    let fishingItem = GetFishingRodInHand(player)
    if (!fishingItem) return
    let fishingItemHandler = $AquaFishingRodItem.getHandler(fishingItem)
    /**@type {FishingItemModel[]} */
    let strategyList = []
    fishingItemHandler.allItems.forEach(item => {
        if (!FishingItemStrategy[item.id]) return
        let itemModel = FishingItemStrategy[item.id](item)
        strategyList.push(itemModel)
    })
    strategyList.sort((a, b) => b.priority - a.priority).forEach(itemModel => {
        itemModel.miniGameEnd(event)
    })
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