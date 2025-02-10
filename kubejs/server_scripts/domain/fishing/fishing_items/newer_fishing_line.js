// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:newer_fishing_line', NewerFishingLineMiniGameStart)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function NewerFishingLineMiniGameStart(model, event) {
    model.customData['pointLoss'].addAttributeModifier(-0.2, 'multiple', 'base')
}