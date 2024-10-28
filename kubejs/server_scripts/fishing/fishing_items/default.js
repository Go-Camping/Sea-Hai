// priority:801
/**
 * 
 * @param {Internal.ItemStack} item 
 */
function FishingItemModel(item) {
    this.item = item
}

// Object.assign(DefaultPOIModel.prototype, POIModel.prototype)

FishingItemModel.prototype = {
    /**
     * @param {Internal.MiniGameStartJS} event 
     */
    miniGameStart: (event) => null,
    /**
     * @param {Internal.MiniGameEndJS} event 
     */
    miniGameEnd: (event) => null,
    /**
     * @param {Internal.LootContextJS} event 
     */
    lootModify: (event) => null,
}

/**
 * @constant
 * @type {Object<string,function(Internal.ItemStack):FishingItemModel>}
 */
const FishingItemStrategy = {
    'kubejs:duck_bobber': (item) => new DuckBobberModel(item),
    'kubejs:octopus_bobber': (item) => new OctopusBobberModel(item),
    'kubejs:hard_fishing_line': (item) => new HardFishingLineModel(item),
}