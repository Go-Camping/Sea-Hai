// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:iron_fishing_line', IronFishingLineMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:iron_fishing_line', IronFishingLineMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function IronFishingLineMiniGameStart(model, event) {
    model.customData['pointLoss'].addAttributeModifier(-0.25, 'multiple', 'base')
}


/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function IronFishingLineMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(-0.25, 'multiple', 'base')
}