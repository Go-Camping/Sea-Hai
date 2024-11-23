// priority: 800
RegistryFishingItemStrategy('kubejs:octopus_bobber', OctopusBobberModel)
/**
 * 
 * @param {Internal.ItemStack} item 
 */
function OctopusBobberModel(item) {
    FishingItemModel.call(this, item)
}


OctopusBobberModel.prototype = Object.create(FishingItemModel.prototype)
OctopusBobberModel.prototype.constructor = OctopusBobberModel

/**
 * 
 * @param {Internal.MiniGameStartJS} event 
 */
OctopusBobberModel.prototype.miniGameStart = function (event) {
    let behavior = event.getFishBehavior()
    behavior.setAvgDistance(behavior.getAvgDistance() * 0.8)
}

