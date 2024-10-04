// priority: 800

ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:fish_shop', 20)
        .requireFunctionOnEnd(ctx => {
            /**@type {Internal.BlockContainerJS} */
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)

            let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
            playerBankAccount.depositMoney(ConvertMainMoneyValue(shopPOIModel.getConsumingMoney()))
            shopPOIModel.setIsShopping(false)
            shopPOIModel.setConsumingMoney(0)
            return ctx.success()
        })
        .requireFunctionToStart(ctx => {
            let block = ctx.block
            let shopPOIModel = new ShopPOIBlock(block)
            if (shopPOIModel.checkIsShopping()) return ctx.success()
            return ctx.error('invalid')
        })
})


/**
 * POI商店策略
 * @param {EntityWorkInPOI} workInPOIModel
 * @param {ShopPOIBlock} poiModel
 * @returns {boolean}
 */
function FishShopWorkInTickStrategies(workInPOIModel, poiModel) {
    let level = workInPOIModel.mob.level
    let mob = workInPOIModel.mob
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_TO_CONTAINER:
            if (!workInPOIModel.getTargetMovePos()) return false
            // 子阶段意义为避免无用的判空，进而保证在异常情况下，能够通过check方法的降级正常跳出
            if (!workInPOIModel.checkArrivedTargetMovePos(GO_TO_TARGET_POI_DISTANCE)) {
                workInPOIModel.moveToTargetPos()
                return true
            }
            // 容器取出与结算逻辑
            let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
            if (!CommonShopContainerStrategies[containerBlock.id]) {
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                return true
            }
            CommonShopContainerStrategies[containerBlock.id](workInPOIModel, poiModel, containerBlock)
            workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
            return true
        case SUB_STATUS_RETURN_TO_POI:
            if (!workInPOIModel.checkArrivedPOIPos()) {
                workInPOIModel.moveToPOIPos()
                return true
            }
            if (workInPOIModel.getConsumedMoney() <= 0) {
                // 没有消费则直接返回
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                return false
            }
            if (poiModel.checkIsShopping()) {
                // todo
                if (mob.navigation.isInProgress()) mob.navigation.setSpeedModifier(0.1)
                let poiPos = workInPOIModel.poiPos
                mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
                // 等待释放
                return true
            } else {
                // 金额计算逻辑
                let consumedMoney = workInPOIModel.getConsumedMoney()
                workInPOIModel.clearConsumedMoney()
                poiModel.startShopping(consumedMoney)
                let poiPos = workInPOIModel.poiPos
                mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
                workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
                return true
            }
            return true
        case SUB_STATUS_START_SHOPPING:
            if (poiModel.checkIsShopping()) {
                return true
            } else {
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                mob.navigation.setSpeedModifier(1.0)
                // 跳出子状态
                return false
            }
            return true
        default:
            // 没有设置子状态会行进到这里，强制设置到初始化状态
            workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
            return true
    }
    return true
}

/**
 * POI商店策略
 * @param {EntityWorkInPOI} workInPOIModel
 * @param {ShopPOIBlock} poiModel
 * @returns {boolean}
 */
function FishShopWorkInInitStrategies(workInPOIModel, poiModel) {
    // 选择一个可用的POI容器
    let level = poiModel.block.level
    let posList = poiModel.getPosList()
    let validContainerBlocks = []
    posList.forEach(pos => {
        let tempBlock = level.getBlock(pos)
        // 这个容器必须有一个有效的取用方法
        if (!CommonShopContainerStrategies[tempBlock.id]) return
        if (tempBlock.inventory.isEmpty()) return
        // POI容器可以有权重，先均等概率
        let tempWeight = 1
        validContainerBlocks.push(new WeightRandom(tempBlock, tempWeight))
    })

    if (validContainerBlocks.length <= 0) return false
    /** @type {Internal.BlockContainerJS} */
    let selectedContainer = GetWeightRandomObj(validContainerBlocks)
    let selectedPos = selectedContainer.getPos()
    workInPOIModel.setTargetMovePos(selectedPos)
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
    return true
}