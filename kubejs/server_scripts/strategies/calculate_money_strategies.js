/**
 * 默认付费逻辑（此为暂定）
 * @param {EntityWorkInPOI} workInPOIModel
 * @returns {Number}
 */
function defaultCalculateMoneyStrategies(workInPOIModel) {
    let poiModel = workInPOIModel.getPOIData()
    let originMoney = workInPOIModel.getConsumedMoney()
    let sellType = poiModel.getSellType()
    let consumedItem = Item.of(workInPOIModel.getConsumedItem())
    //最终计价的倍率
    let rate = 1
    //计价的加法乘区
    let addition = 0

    //若为杂货店，所有物品正常售价
    //不为杂货店，售卖对应商品时，价格提高50%，否则，价格降低90%
    if (sellType != 0){
        let tag = Int2Tag[sellType]
        if (consumedItem.hasTag(tag)){
            rate = 1.5
        }
        else rate = 0.1
    }

    //计算商店的装饰度，每点装饰度提供1点额外价格
    poiModel.calculateDecoration()
    addition = poiModel.getDecoration()
    
    //将修改保存到实体中
    workInPOIModel.setConsumedMoney(originMoney*rate+addition)

}