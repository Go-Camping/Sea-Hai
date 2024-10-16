/**
 * POI装饰度策略
 * @constant
 * @type {Object<string,function(ShopPOIBlock):void>}
 */
const DefaultShopDecorationStrategies = {
    'kubejs:fish_shop': function (poiModel) {
        //测试用
        poiModel.setDecoration(0)
        let block = poiModel.block
        if (block.level.getBlock(block.pos.relative(Direction.UP)) == "minecraft:dirt"){
            poiModel.setDecoration(10)
        }
    },
    'kubejs:grocery': function (poiModel) {
        //测试用
        poiModel.setDecoration(0)
        let block = poiModel.block
        if (block.level.getBlock(block.pos.relative(Direction.UP)) == "minecraft:ice"){
            poiModel.setDecoration(10)
        }
    }
}