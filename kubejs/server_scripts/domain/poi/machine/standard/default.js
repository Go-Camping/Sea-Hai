// priority: 801

/**
 * POI策略
 * @constant
 * @type {Object<string,function(EntityWorkInPOI, Internal.BlockContainerJS):DefaultPOIModel>}
 */
const POIModelStrategies = {}

/**
 * @param {string} id 
 * @param {function(EntityWorkInPOI, Internal.BlockContainerJS)} model 
 */
function RegistryPOIStrategy(id, model) {
    POIModelStrategies[id] = (workInPOIModel, poiBlock) => new model(workInPOIModel, poiBlock)
}

ServerEvents.tags('block', event => {
    let blockList = Object.keys(POIModelStrategies)
    event.add('kubejs:poi_entrance', blockList) 
})

/**
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {Internal.BlockContainerJS} poiBlock 
 */
function DefaultPOIModel(workInPOIModel, poiBlock) {
    // POIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

// 通过原型链继承
DefaultPOIModel.prototype = Object.create(POIModel.prototype)
DefaultPOIModel.prototype.constructor = DefaultPOIModel;

DefaultPOIModel.prototype.workInPOIInit = function () {
    const poiBlock = this.poiBlock
    const workInPOIModel = this.workInPOIModel
    // 选择一个可用的POI容器
    const level = poiBlock.level
    const poiBlockModel = this.poiBlockModel
    let posList = poiBlockModel.getRelatedPosList()
    let containerWeightModel = new WeightRandomModel()
    posList.forEach(pos => {
        let tempBlock = level.getBlock(pos)
        // 这个容器必须有一个有效的取用方法
        // 且simulate通过
        if (!this.consumeContainerItem(tempBlock, true)) return
        // POI容器可以有权重，先均等概率
        let tempWeight = 1
        containerWeightModel.addWeightRandom(tempBlock, tempWeight)
    })
    if (containerWeightModel.weightRandomList.length <= 0) return false
    /** @type {Internal.BlockContainerJS} */
    let selectedContainer = containerWeightModel.getWeightRandomObj()
    let selectedPos = selectedContainer.getPos()
    workInPOIModel.setTargetPos(selectedPos)
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
    return true
}

DefaultPOIModel.prototype.workInPOITick = function () {
    const workInPOIModel = this.workInPOIModel
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_TO_CONTAINER:
            return DefaultMoveToContainer(this)
        case SUB_STATUS_RETURN_TO_POI:
            return DefaultReturnToPOI(this)
        case SUB_STATUS_START_SHOPPING:
            return DefaultStartShopping(this)
        default:
            workInPOIModel.clearTargetPos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}


/**
 * @param {Internal.ItemStack} item 
 * @returns {boolean}
 */
DefaultPOIModel.prototype.consumeConatinerTester = function (item) {
    let res = item.hasNBT() && item.nbt.contains('value')
    return res
}

/**
 * @param {Internal.BlockContainerJS} container 
 * @param {boolean} simulate
 * @returns {boolean}
 */
DefaultPOIModel.prototype.consumeContainerItem = function (container, simulate) {
    const inv = container.getInventory()
    if (!inv || inv.isEmpty()) return false
    let { slot, pickItem } = FindValidSlotOfInventory(inv, (item) => this.consumeConatinerTester(item))
    if (slot == null || slot < 0) return false
    if (simulate) return true
    let oriValue = pickItem.nbt.getInt('value')
    this.workInPOIModel.priceAttribute.setBaseAttr(oriValue)
    let validDecorationAmount = ContainerProperty[container.id]?.validDecorationAmount ?? 1
    if (validDecorationAmount > 0) {
        let decorationBlocks = FindBlocksAroundBlock(container, 3, 3, (curBlock) => {
            if (curBlock.blockState.isAir()) return false
            return curBlock.tags.contains(TAG_DECORATION_BLOCK)
        })
        decorationBlocks.slice(0, validDecorationAmount).forEach(block => {
            ContainerDecorationStrategy[block.id](this, container)
        })
    }
    if (this.workInPOIModel.isNeedExtractItem()) {
        inv.extractItem(slot, 1, false)
        this.workInPOIModel.mob.setMainHandItem(pickItem)
    }
    let value = this.workInPOIModel.calculateConsumedMoney()
    this.workInPOIModel.addConsumedMoney(value)
    return true
}


/**
 * @param {DefaultPOIModel} defaultPOIModel 
 * @returns {boolean}
 */
function DefaultMoveToContainer(defaultPOIModel) {
    const poiBlock = defaultPOIModel.poiBlock
    const workInPOIModel = defaultPOIModel.workInPOIModel
    const level = poiBlock.level
    if (!workInPOIModel.getTargetPos()) return false
    // 子阶段意义为避免无用的判空，进而保证在异常情况下，能够通过check方法的降级正常跳出
    if (!workInPOIModel.checkArrivedTargetPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 容器取出与结算逻辑
    let containerBlock = level.getBlock(workInPOIModel.getTargetPos())
    defaultPOIModel.consumeContainerItem(containerBlock, false)
    if (workInPOIModel.isNeedBuyMore()) {
        // 如果让本次购买多个，那么就重新运行一次初始化，这会可能导致taragetPos的变动。
        defaultPOIModel.workInPOIInit()
        return true
    }
    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
    return true
}


/**
 * @param {DefaultPOIModel} defaultPOIModel 
 * @returns {boolean}
 */
function DefaultReturnToPOI(defaultPOIModel) {
    const workInPOIModel = defaultPOIModel.workInPOIModel
    const mob = workInPOIModel.mob
    const poiBlockModel = defaultPOIModel.poiBlockModel
    if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToPOIPos()
        return true
    }
    if (workInPOIModel.getConsumedMoney() <= 0) {
        // 没有消费则直接返回
        workInPOIModel.clearTargetPos()
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
        return false
    }
    if (poiBlockModel.checkIsShopping()) {
        // 等待释放
        return true
    } else {
        // 金额计算逻辑
        let consumedMoney = workInPOIModel.getConsumedMoney()
        workInPOIModel.clearConsumedMoney()
        if (!poiBlockModel.startShopping(mob.uuid, consumedMoney)) {
            return true
        }
        workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
        return true
    }
}


/**
 * @param {DefaultPOIModel} defaultPOIModel 
 * @returns {boolean}
 */
function DefaultStartShopping(defaultPOIModel) {
    const workInPOIModel = defaultPOIModel.workInPOIModel
    const mob = workInPOIModel.mob
    const poiBlockModel = defaultPOIModel.poiBlockModel
    let poiPos = workInPOIModel.poiPos
    mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
    if (poiBlockModel.checkIsUUIDShopping(mob.uuid)) {
        return true
    } else {
        NPCSaySurrounding(mob, NPC_LINE_AFTER_SHOPPING_SATISFIED)
        workInPOIModel.clearTargetPos()
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
        // 跳出子状态
        return false
    }
}