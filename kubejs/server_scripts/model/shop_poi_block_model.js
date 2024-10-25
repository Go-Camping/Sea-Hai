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

    //判断是否在售货
    this.persistentData = this.tile.persistentData
    if (!this.persistentData.contains('isShopping')) {
        this.persistentData.putInt('isShopping', 0)
    }
    this.isShopping = this.persistentData.getInt('isShopping') == 1

    //仓库列表
    if (!this.persistentData.contains('relatedPosList')) {
        this.persistentData.put('relatedPosList', new $ListTag())
    }
    /**@type {BlockPos[]} */
    this.relatedPosList = ConvertNbt2PosList(this.persistentData.getList('relatedPosList', GET_COMPOUND_TYPE))

    //交易金额
    if (!this.persistentData.contains('consumingMoney')) {
        this.persistentData.putInt('consumingMoney', 0)
    }
    this.consumingMoney = this.persistentData.getInt('consumingMoney')

}

ShopPOIBlock.prototype = {
    /**
     * 设置购物状态
     * @param {boolean} isShopping 
     */
    setIsShopping: function (isShopping) {
        this.isShopping = isShopping
        this.persistentData.putInt('isShopping', isShopping ? 1 : 0)
        this.tile.setChanged()
    },
    /**
     * 校验购物状态
     * @returns {boolean}
     */
    checkIsShopping: function () {
        return this.isShopping
    },
    /**
     * 设置关联容器列表
     * @param {BlockPos[]} posList
     */
    setRelatedPosList: function (posList) {
        this.relatedPosList = posList
        this.persistentData.put('relatedPosList', ConvertPosList2Nbt(posList))
        this.tile.setChanged()
        return
    },
    /**
     * 设置关联容器列表（Nbt格式）
     * @param {Internal.ListTag} posListNbt
     */
    setRelatedPosListNbt: function (posListNbt) {
        this.persistentData.put('relatedPosList', posListNbt)
        this.relatedPosList = ConvertNbt2PosList(posListNbt)
        this.tile.setChanged()
        return
    },
    /**
     * 获取关联容器列表
     * @returns {BlockPos[]}
     */
    getRelatedPosList: function () {
        return this.relatedPosList
    },
    /**
     * 获取关联容器列表Nbt格式
     * @returns {Internal.ListTag}
     */
    getRelatedPosListNbt: function () {
        return this.persistentData.getList('relatedPosList', GET_COMPOUND_TYPE)
    },
    /**
     * 启动购买配方
     * @param {number} amount
     */
    startShopping: function (amount) {
        this.setIsShopping(true)
        this.setConsumingMoney(this.getConsumingMoney() + amount)
    },
    /**
     * 设置正在消费的金额
     * @param {number} consumingMoney 
     */
    setConsumingMoney: function (consumingMoney) {
        this.consumingMoney = consumingMoney
        this.persistentData.putInt('consumingMoney', consumingMoney)
        this.tile.setChanged()
    },
    /**
     * 获取正在消费的金额
     * @returns {number}
     */
    getConsumingMoney: function () {
        return this.consumingMoney
    },
}