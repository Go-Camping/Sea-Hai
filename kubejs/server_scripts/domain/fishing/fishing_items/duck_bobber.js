// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:duck_bobber', DuckBobberMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:duck_bobber', DuckBobberMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameStart(model, event) {
    model.customData['bobberUpAcceleration'].addAttributeModifier(0.25, 'multiple', 'base')
    model.customData['gravity'].addAttributeModifier(-0.1, 'multiple', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function DuckBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.2, 'multiple', 'base')
}