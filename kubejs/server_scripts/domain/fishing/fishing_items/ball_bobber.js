// priority: 800
FishingItemMiniGameStartStrategy.addStrategy('kubejs:ball_bobber', BallBobberMiniGameStart)

/**
 * @param {StrategyModel} model
 * @param {Internal.MiniGameStartJS} event 
 */
function BallBobberMiniGameStart(model, event) {
    model.customData['bobberHeight'].addAttributeModifier(0.3, 'multiple', 'base')
}
