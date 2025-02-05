// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:golden_fishing_line', GoldenFishingLineMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:golden_fishing_line', GoldenFishingLineMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function GoldenFishingLineMiniGameStart(model, event) {
    model.customData['pointGain'].addAttributeModifier(-0.25, 'multiple', 'base')
}


/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function GoldenFishingLineMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.5, 'multiple', 'base')
}