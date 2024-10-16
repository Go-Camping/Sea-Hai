// priority: 900

/**
 * 解析水产养殖钓竿信息
 * @param {Internal.ItemStack} item 
 * @returns 
 */
function FishingRodModel(item) {
    this.hook = Item.of('minecraft:air')
    this.bait = Item.of('minecraft:air')
    this.fishingLine = Item.of('minecraft:air')
    this.bobber = Item.of('minecraft:air')
    let rodHandler = $AquaFishingRodItem.getHandler(item)
    if (rodHandler && !rodHandler.isEmpty()) {
        this.hook = rodHandler.getStackInSlot(0)
        this.bait = rodHandler.getStackInSlot(1)
        this.fishingLine = rodHandler.getStackInSlot(2)
        this.bobber = rodHandler.getStackInSlot(3)
    }
}