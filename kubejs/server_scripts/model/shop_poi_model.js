// priority: 900

/**
 * POI本身包含属性和操作方法
 * @param {Internal.BlockContainerJS} block 
 * @returns 
 */
function ShopPOIBlock(block) {
    // 若没有对应的字段，则进行强制初始化
    if (!block.getEntity()) return null

    this.block = block
    this.tile = block.entity
    this.persistentData = this.tile.persistentData
    if (!this.persistentData.contains('isShopping')) {
        this.persistentData.putInt('isShopping', 0)
    }
    this.isShopping = this.persistentData.getInt('isShopping') == 1

    if (!this.persistentData.contains('sellMode')) {
        this.persistentData.putInt('sellMode', 0)
    }
    this.sellModel = this.persistentData.getInt('sellMode')

    if (!this.persistentData.contains('posList')) {
        this.persistentData.put('posList', new $ListTag())
    }
    /**@type {BlockPos[]} */
    this.relatedContainerPosList = ConvertNbt2PosList(this.persistentData.getList('posList', GET_COMPOUND_TYPE))
}

ShopPOIBlock.prototype = {
    /**
     * 设置购物状态
     * @param {boolean} isShopping 
     */
    setIsShopping: function(isShopping) {
        this.isShopping = isShopping
        this.persistentData.putInt('isShopping', isShopping ? 1 : 0)
    },
    /**
     * 校验购物状态
     * @returns {boolean}
     */
    checkIsShopping: function() {
        return this.isShopping 
    },
    /**
     * 设置关联容器列表
     * @param {BlockPos[]} posList
     */
    setPosList: function (posList) {
        this.relatedContainerPosList = posList
        this.persistentData.put('posList', ConvertPosList2Nbt(posList))
        return
    },
    /**
     * 设置关联容器列表（Nbt格式）
     * @param {Internal.ListTag} posListNbt
     */
    setPosListNbt: function (posListNbt) {
        this.persistentData.put('posList', posListNbt)
        this.relatedContainerPosList = ConvertNbt2PosList(posListNbt)
        return
    },
    /**
     * 获取关联容器列表
     * @returns {BlockPos[]}
     */
    getPosList: function () {
        return this.relatedContainerPosList
    },
    /**
     * 获取关联容器列表Nbt格式
     * @returns {Internal.ListTag}
     */
    getPosListNbt: function () {
        return this.persistentData.getList('posList', GET_COMPOUND_TYPE)
    },
    /**
     * 启动购买配方
     */
    startShopping: function () {
        this.setIsShopping(true)
    },
}