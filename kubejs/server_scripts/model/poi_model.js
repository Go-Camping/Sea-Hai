// priority: 950

/**
 * POI本身包含属性和操作方法
 * @param {EntityWorkInPOI} workInPOIModel
 * @param {ShopPOIBlock} poiBlockModel
 * @returns 
 */
function POIModel(workInPOIModel, poiBlockModel) {
    this.workInPOIModel = workInPOIModel
    this.poiBlockModel = poiBlockModel
}

POIModel.prototype = {
    workInPOITick: function () {
        return DefaultWorkInPOITick(this.workInPOIModel, this.poiBlockModel)
    },
    workInPOIInit: function () {
        return DefaultWorkInPOIInit(this.workInPOIModel, this.poiBlockModel)
    },
    
}