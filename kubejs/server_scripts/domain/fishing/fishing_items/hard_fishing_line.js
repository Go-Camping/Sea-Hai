// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:hard_fishing_line', HardFishingLineMiniGameStart)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function HardFishingLineMiniGameStart(model, event) {
    model.customData['pointLoss'].addAttributeModifier(-0.1, 'multiple', 'base')
}