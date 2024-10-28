// priority: 800
/**
 * 
 * @param {Internal.ItemStack} item 
 */
function HardFishingLineModel(item) {
    FishingItemModel.call(this, item)
}


HardFishingLineModel.prototype = Object.create(FishingItemModel.prototype)
HardFishingLineModel.prototype.constructor = HardFishingLineModel

/**
 * 
 * @param {Internal.MiniGameStartJS} event 
 */
HardFishingLineModel.prototype.miniGameStart = function (event) {
    let behavior = event.getFishBehavior()
    behavior.setBobberUpAcceleration(behavior.getBobberUpAcceleration() * 1.1)
}
