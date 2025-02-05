// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:ender_fishing_line', EnderFishingLineMiniGameStart)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function EnderFishingLineMiniGameStart(model, event) {
    let player = event.player
    let fishingEntity = player.fishing
    if (!fishingEntity) return
    let distance = fishingEntity.distanceToEntity(player)
    model.customData['pointLoss'].addAttributeModifier(Math.max(-distance * 0.01, -0.75), 'multiple', 'base')
}