// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:duck_bobber', DuckBobberMiniGameStrat)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameStrat(model, event) {
    model.customData['gravity'].addAttributeModifier(0.4, 'addition', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.2, 'multiple', 'base')
}