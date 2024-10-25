/**
 * 容器装饰策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, Internal.BlockContainerJS, Internal.BlockContainerJS):void>}
 */
const ContainerBlockDecorationStrategies = {
    'minecraft:stone': function (workInPOIModel, poiBlock, container) {
        // 概率连续购买
        if (Math.random() > 0.8) workInPOIModel.setNeedBuyMore(true)
    },
    'minecraft:iron_block': function (workInPOIModel, poiBlock, container) {
        // 价格翻倍
        workInPOIModel.setPriceMutiply(2)
    },
}