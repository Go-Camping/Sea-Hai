// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:octopus_bobber', DuckBobberMiniGameStrat)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameStrat(model, event) {
    model.customData['avgDistance'].addAttributeModifier(-0.2, 'multiple', 'base')
}