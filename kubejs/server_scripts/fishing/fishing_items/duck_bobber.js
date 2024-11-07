// priority: 800
RegistryFishingItemStrategy('kubejs:duck_bobber', DuckBobberModel)
/**
 * 
 * @param {Internal.ItemStack} item 
 */
function DuckBobberModel(item) {
    FishingItemModel.call(this, item)
}


DuckBobberModel.prototype = Object.create(FishingItemModel.prototype)
DuckBobberModel.prototype.constructor = DuckBobberModel

/**
 * 
 * @param {Internal.MiniGameStartJS} event 
 */
DuckBobberModel.prototype.miniGameStart = function (event) {
    let behavior = event.getFishBehavior()
    behavior.setGravity(behavior.getGravity() + 0.4)
}