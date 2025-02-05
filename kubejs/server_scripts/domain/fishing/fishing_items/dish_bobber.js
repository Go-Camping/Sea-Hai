// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:dish_bobber', DishBobberMiniGameStart)
FishingItemMiniGameEndStrategy.addStrategy('kubejs:dish_bobber', DishBobberMiniGameEnd)
/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function DishBobberMiniGameStart(model, event) {
    model.customData['bobberHeight'].addAttributeModifier(0.5, 'multiple', 'base')
}

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameEndJS} event
 */
function DishBobberMiniGameEnd(model, event) {
    model.customData['valueModel'].addAttributeModifier(-0.5, 'multiple', 'base')
}