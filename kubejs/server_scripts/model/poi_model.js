// priority: 950

/**
 * POI本身包含属性和操作方法
 * @param {EntityWorkInPOI} workInPOIModel
 * @param {Internal.BlockContainerJS} poiBlock
 * @returns 
 */
function POIModel(workInPOIModel, poiBlock) {
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
}

POIModel.prototype = {
    workInPOITick: function () {
        return null
    },
    workInPOIInit: function () {
        return null
    },
}