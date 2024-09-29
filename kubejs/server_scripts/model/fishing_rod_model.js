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
    if (item.hasNBT() && item.nbt.contains('Inventory')) {
        let itemHandlerOpt = item.getCapability(ForgeCapabilities.ITEM_HANDLER)
        if (itemHandlerOpt.isPresent() && itemHandlerOpt.resolve().isPresent()) {
            let rodHandler = itemHandlerOpt.resolve().get()
            this.hook = rodHandler.getStackInSlot(0)
            this.bait = rodHandler.getStackInSlot(1)
            this.fishingLine = rodHandler.getStackInSlot(2)
            this.bobber = rodHandler.getStackInSlot(3)
        }
    }
}