// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:hard_fishing_line', DuckBobberMiniGameStrat)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameStrat(model, event) {
    model.customData['pointLoss'].addAttributeModifier(-0.9, 'multiple', 'base')
}