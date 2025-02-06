// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:iron_bobber', IronBobberMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:iron_bobber', IronBobberMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function IronBobberMiniGameStart(model, event) {
    model.customData['gravity'].addAttributeModifier(0.5, 'multiple', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event 
 */
function IronBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(0.25, 'multiple', 'base')
}