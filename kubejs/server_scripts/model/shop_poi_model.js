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

    //售货模式
    if (!this.persistentData.contains('sellMode')) {
        this.persistentData.putInt('sellMode', 0)
    }
    this.sellModel = this.persistentData.getInt('sellMode')

    //售货类型,用于区分各个店铺
    if (!this.persistentData.contains('sellType')) {
        this.persistentData.putInt('sellType', 0)
    }
    this.sellType = this.persistentData.getInt('sellType')

    //仓库列表
    if (!this.persistentData.contains('posList')) {
        this.persistentData.put('posList', new $ListTag())
    }
    /**@type {BlockPos[]} */
    this.relatedContainerPosList = ConvertNbt2PosList(this.persistentData.getList('posList', GET_COMPOUND_TYPE))

    //交易金额
    if (!this.persistentData.contains('consumingMoney')) {
        this.persistentData.putInt('consumingMoney', 0)
    }
    this.consumingMoney = this.persistentData.getInt('consumingMoney')

    //装饰度，可以用于影响价格，吸引力等等
    if (!this.persistentData.contains('decoration')) {
        this.persistentData.putInt('decoration', 0)
    }
    this.decoration = this.persistentData.getInt('decoration')
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
     * 设置售货类型
     * @param {number} sellType 
     */
    setSellType: function (sellType) {
        this.sellType = sellType
        this.persistentData.putInt('sellType', sellType)
        this.tile.setChanged()
    },
    /**
     * 获取售货类型
     * @returns {number}
     */
    getSellType: function () {
        return this.sellType
    },
    /**
     * 设置关联容器列表
     * @param {BlockPos[]} posList
     */
    setPosList: function (posList) {
        this.relatedContainerPosList = posList
        this.persistentData.put('posList', ConvertPosList2Nbt(posList))
        this.tile.setChanged()
        return
    },
    /**
     * 设置关联容器列表（Nbt格式）
     * @param {Internal.ListTag} posListNbt
     */
    setPosListNbt: function (posListNbt) {
        this.persistentData.put('posList', posListNbt)
        this.relatedContainerPosList = ConvertNbt2PosList(posListNbt)
        this.tile.setChanged()
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
    /**
     * 设置装饰度
     * @param {Number} decoration 
     */
    setDecoration: function(decoration){
        this.decoration = decoration
        this.persistentData.putInt('decoration', decoration)
        this.tile.setChanged()
    },
    /**
     * 引入装饰度计算策略
     */
    calculateDecoration: function(){
        if (!CommonShopDecorationStrategies[this.block.id]) this.setDecoration(0)
        CommonShopDecorationStrategies[this.block.id](this)
    },
    /**
     * 获取装饰度
     * @returns {Number}
     */
    getDecoration: function(){
        return this.decoration
    }
}