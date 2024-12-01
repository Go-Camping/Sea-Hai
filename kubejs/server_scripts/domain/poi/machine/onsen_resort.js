// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:onsen_resort', OnsenStorePOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:onsen_resort', 100)
        .requireFunctionOnEnd(ctx => {
            /**@type {Internal.BlockContainerJS} */
            const block = ctx.block
            const shopPOIModel = new ShopPOIBlock(block)

            let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
            playerBankAccount.depositMoney(ConvertMainMoneyValue(shopPOIModel.getConsumingMoney()))
            shopPOIModel.setIsShopping(false)
            shopPOIModel.setConsumingMoney(0)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            /**@type {Internal.BlockContainerJS} */
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)
            if (shopPOIModel.checkIsShopping()) return ctx.success()
            return ctx.error('invalid')
        })
})


// priority: 800
/**
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {Internal.BlockContainerJS} poiBlock 
 */
function OnsenStorePOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

OnsenStorePOIModel.prototype = Object.create(DefaultPOIModel.prototype)
OnsenStorePOIModel.prototype.constructor = OnsenStorePOIModel

OnsenStorePOIModel.prototype.workInPOIInit = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    const level = this.poiBlock.level
    let posList = poiBlockModel.getRelatedPosList()
    let noInvPos = posList.filter(relatedPos => {
        let relatedBlock = level.getBlock(relatedPos)
        // 如果绑定了容器，那么就不认为是一个可用的地点
        if (relatedBlock.inventory) return false
        return true
    })
    if (noInvPos.length <= 0) return false
    workInPOIModel.setTargetMovePos(RandomGet(noInvPos))
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_RELATED_POS)
    return true
}

OnsenStorePOIModel.prototype.workInPOITick = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = this.poiBlock.level
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_TO_RELATED_POS:
            return OnsenResortMoveToRelatedPos(this)
        case SUB_STATUS_MOVE_TO_ONSEN_POS:
            return OnsenResortMoveToOnsenPos(this)
        case SUB_STATUS_ONSEN_WAITING:
            return OnsenResortOnsenWaiting(this)
        case SUB_STATUS_ONSEN_DRINKING:
            return OnsenResortOnsenDrinking(this)
        case SUB_STATUS_RETURN_TO_POI:
            return OnsenResortReturnToPOI(this)
        case SUB_STATUS_START_SHOPPING:
            return OnsenResortStartShopping(this)
        default:
            workInPOIModel.clearMovePos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}


/**
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortMoveToRelatedPos(onsenStorePOIModel) {
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    // 如果没有可用的移动目标，那么会直接跳出，使得该workIn状态结束
    if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_POI_DISTANCE_SLOW)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 如果到达了目标位置，搜索可用流体，offset额外下沉以减少搜索范围
    let validLiquidBlocks = FindNearBlocks(mob, 10, 2, -1, (curBlock) => {
        let blockState = curBlock.blockState
        if (blockState.liquid() && !blockState.getFluidState().isEmpty()) {
            return true
        }
        return false
    })
    if (validLiquidBlocks.length <= 0) {
        return false
    }
    workInPOIModel.setTargetMovePos(RandomGet(validLiquidBlocks))
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_ONSEN_POS)
    workInPOIModel.setConsumedMoney(100)
    return true
}

/**
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortMoveToOnsenPos(onsenStorePOIModel) {
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    if (workInPOIModel.waitTimer > 0) {
        workInPOIModel.setSubStatus(SUB_STATUS_ONSEN_WAITING)
        return true
    }
    // 如果没有可用的移动目标，那么会直接跳出，使得该workIn状态结束
    if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_ONSEN_DISTANCE_STOP)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 如果到达了目标位置，那么开始进入等待阶段
    let targetPosV3d = workInPOIModel.getTargetMovePos().getCenter()
    mob.teleportTo(targetPosV3d.x(), targetPosV3d.y(), targetPosV3d.z())
    workInPOIModel.setSubStatus(SUB_STATUS_ONSEN_WAITING)
    mob.ais.setAnimation(ANIMATION_SIT)
    workInPOIModel.setWaitTimer(Math.random() * 1200 + 600)
    return true
}

/**
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortOnsenWaiting(onsenStorePOIModel) {
    const poiBlockModel = onsenStorePOIModel.poiBlockModel
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level
    if (workInPOIModel.checkArriveWaitTimer()) {
        mob.ais.setAnimation(ANIMATION_NONE)
        // 判断是否需要喝饮品
        let hasInvPos = poiBlockModel.getRelatedPosList().filter(relatedPos => {
            let relatedBlock = level.getBlock(relatedPos)
            // 如果绑定了容器，就认为是一个可用的消费地点
            if (relatedBlock.inventory && this.consumeContainerItem(relatedBlock, true)) return true
            return false
        })

        if (hasInvPos.length <= 0) {
            workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
            return true
        } else {
            workInPOIModel.setTargetMovePos(RandomGet(hasInvPos))
            workInPOIModel.moveToTargetPos()
            workInPOIModel.setSubStatus(SUB_STATUS_ONSEN_DRINKING)
            return true
        }
    } else {
        if (mob.totalTicksAlive % 200 == 0 && Math.random() < 0.2) {
            mob.saySurrounding(new $Line('舒服！'))
        }
    }
    return true
}


/**
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortOnsenDrinking(onsenStorePOIModel) {
    const poiBlockModel = onsenStorePOIModel.poiBlockModel
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level
    if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_POI_DISTANCE_SLOW)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 容器取出与结算逻辑
    let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
    this.consumeContainerItem(containerBlock, false)
    if (workInPOIModel.isNeedBuyMore()) {
        let hasInvPos = poiBlockModel.getRelatedPosList().filter(relatedPos => {
            let relatedBlock = level.getBlock(relatedPos)
            if (relatedBlock.inventory && this.consumeContainerItem(relatedBlock, true)) return true
            return false
        })
        if (hasInvPos.length > 0) {
            workInPOIModel.setTargetMovePos(RandomGet(hasInvPos))
            workInPOIModel.moveToTargetPos()
            return true
        }
    }
    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
    mob.navigation.setSpeedModifier(1)
    return true
}


/**
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortReturnToPOI(onsenStorePOIModel) {
    const poiBlockModel = onsenStorePOIModel.poiBlockModel
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_SLOW)) {
        workInPOIModel.moveToPOIPos()
        return true
    }
    if (mob.navigation.isInProgress()) {
        if (workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
            mob.navigation.setSpeedModifier(1.0)
            mob.navigation.stop()
        } else {
            mob.navigation.setSpeedModifier(0.1)
        }
    }
    if (workInPOIModel.getConsumedMoney() <= 0) {
        // 没有消费则直接返回
        workInPOIModel.clearMovePos()
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
 * @param {OnsenStorePOIModel} onsenStorePOIModel 
 * @returns {boolean}
 */
function OnsenResortStartShopping(onsenStorePOIModel) {
    const poiBlockModel = onsenStorePOIModel.poiBlockModel
    const workInPOIModel = onsenStorePOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    let poiPos = workInPOIModel.poiPos
    mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
    if (poiBlockModel.checkIsUUIDShopping(mob.uuid)) {
        return true
    } else {
        mob.saySurrounding(new $Line('感觉很实惠！'))
        workInPOIModel.clearMovePos()
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
        // 跳出子状态
        return false
    }
}