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
 * @param {Internal.BlockContainerJS} container 
 * @param {Number} validDecorationAmount
 * @param {boolean} simulate
 * @returns {boolean}
 */
function DefaultContainerConsume(workInPOIModel, poiBlockModel, container, validDecorationAmount, simulate) {
    let inv = container.getInventory()
    if (!inv || inv.isEmpty()) return false
    let poiBlock = poiBlockModel.block
    let poiBlockId = poiBlock.id
    let validItemTags = null
    if (ValidShopItemTag[poiBlockId]) {
        validItemTags = ValidShopItemTag[poiBlockId]
    }

    let pickItem = ConsumeFirstItemOfInventory(inv, (testItem) => {
        let res = testItem.hasNBT() && testItem.nbt.contains('value')
        if (validItemTags) res = res && testItem.tags.toArray().some(tag => validItemTags.indexOf(tag.toString()) >= 0)
        return res
    }, simulate)

    if (!simulate && validDecorationAmount > 0) {
        let decorationBlocks = FindBlockAroundBlocks(container.pos, 3, 3, (curBlock) => {
            if (curBlock.blockState.isAir()) return false
            return curBlock.tags.contains(TAG_DECORATION_BLOCK)
        })
        decorationBlocks.slice(0, validDecorationAmount).forEach(block => {
            ContainerBlockDecorationStrategies[block.id](workInPOIModel, poiBlockModel, container)
        })
    }

    if (!pickItem || pickItem.isEmpty()) return false
    let value = workInPOIModel.calculateConsumedMoney(pickItem.nbt.getInt('value'))
    workInPOIModel.addConsumedMoney(value)
    return true
}