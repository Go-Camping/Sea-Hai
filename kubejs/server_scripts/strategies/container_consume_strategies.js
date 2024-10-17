// priority: 850
/**
 * POI容器策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, ShopPOIBlock, Internal.BlockContainerJS, boolean):boolean>}
 */
const DefaultShopContainerStrategies = {
    'minecraft:chest': function (workInPOIModel, poiBlockModel, block, simulate) {
        return DefaultContainerConsume(workInPOIModel, poiBlockModel, block, 0, simulate)
    },
    'supplementaries:pedestal': function (workInPOIModel, poiBlockModel, block, simulate) {
        return DefaultContainerConsume(workInPOIModel, poiBlockModel, block, 3, simulate)
    },
}


/**
 * 
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {ShopPOIBlock} poiBlockModel 
 * @param {Internal.BlockContainerJS} block 
 * @param {Number} validDecorationAmount
 * @param {boolean} simulate
 * @returns {boolean}
 */
function DefaultContainerConsume(workInPOIModel, poiBlockModel, block, validDecorationAmount, simulate) {
    let inv = block.getInventory()
    if (!inv || inv.isEmpty()) return false
    let poiBlock = poiBlockModel.block
    let poiBlockId = poiBlock.id
    let validItemTags = null
    if (ValidShopItemTag[poiBlockId]) {
        validItemTags = ValidShopItemTag[poiBlockId]
    }

    let pickItem = ConsumeFirstItemOfInventory(inv, (testItem) => {
        let res = testItem.hasNBT() && testItem.nbt.contains('value')
        if (validItemTags) res = res && testItem.tags.some(tag => validItemTags.indexOf(tag.toString()) >= 0)
        return res
    }, simulate)

    if (!simulate) {
        let decorationBlocks = FindBlockAroundBlocks(block.pos, 3, 3, (level, blockPos) => {
            let targetBlock = level.getBlock(blockPos)
            if (targetBlock.isAir()) return false
            return targetBlock.tags.anyMatch(tag => tag.equals(TAG_POI_ENTRANCE))
        })
    }

    if (!pickItem || pickItem.isEmpty()) return false
    let value = pickItem.nbt.getInt('value')
    workInPOIModel.addConsumedMoney(value)
    return true
}