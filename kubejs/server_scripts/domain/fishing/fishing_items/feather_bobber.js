// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:feather_bobber', FeatherBobberMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:feather_bobber', FeatherBobberMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function FeatherBobberMiniGameStart(model, event) {
    model.customData['gravity'].addAttributeModifier(-0.5, 'multiple', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event
 */
function FeatherBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.2, 'multiple', 'base')
}