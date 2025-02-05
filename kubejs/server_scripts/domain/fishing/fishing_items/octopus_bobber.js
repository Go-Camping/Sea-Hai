// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:octopus_bobber', DuckBobberMiniGameStart)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DuckBobberMiniGameStart(model, event) {
    model.customData['avgDistance'].addAttributeModifier(-0.2, 'multiple', 'base')
}