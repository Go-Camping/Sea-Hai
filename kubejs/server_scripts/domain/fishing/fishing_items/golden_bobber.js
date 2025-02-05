// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:golden_bobber', GoldenBobberMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:golden_bobber', GoldenBobberMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function GoldenBobberMiniGameStart(model, event) {
    model.customData['bobberHeight'].addAttributeModifier(-0.25, 'multiple', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function GoldenBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.5, 'multiple', 'base')
}