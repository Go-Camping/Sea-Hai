// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:onsen_resort', 100)
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
function OnsenPOIModel(workInPOIModel, poiBlock) {
    POIModel.call(this, workInPOIModel, poiBlock)
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

OnsenPOIModel.prototype = Object.create(POIModel.prototype)
OnsenPOIModel.prototype.constructor = OnsenPOIModel;

OnsenPOIModel.prototype = {
    workInPOIInit: function () {
        let poiBlockModel = this.poiBlockModel
        let workInPOIModel = this.workInPOIModel
        // 选择一个可用的关联地点
        let level = poiBlockModel.block.level
        let posList = poiBlockModel.getRelatedPosList()
        
        if (validContainerBlocks.length <= 0) return false
        /** @type {Internal.BlockContainerJS} */
        let selectedContainer = GetWeightRandomObj(validContainerBlocks)
        let selectedPos = selectedContainer.getPos()
        workInPOIModel.setTargetMovePos(selectedPos)
        workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_CONTAINER)
        return true
    },
    workInPOITick: function () {
        let poiBlockModel = this.poiBlockModel
        let workInPOIModel = this.workInPOIModel
        let level = workInPOIModel.mob.level
        let mob = workInPOIModel.mob
        switch (workInPOIModel.getSubStatus()) {
            case SUB_STATUS_MOVE_TO_CONTAINER:
                if (!workInPOIModel.getTargetMovePos()) return false
                // 子阶段意义为避免无用的判空，进而保证在异常情况下，能够通过check方法的降级正常跳出
                if (!workInPOIModel.checkArrivedTargetMovePos(GOTO_POI_DISTANCE_SLOW)) {
                    workInPOIModel.moveToTargetPos()
                    return true
                }
                
                // 容器取出与结算逻辑
                let containerBlock = level.getBlock(workInPOIModel.getTargetMovePos())
                if (!DefaultShopContainerStrategies[containerBlock.id]) {
                    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                    return true
                }
                DefaultShopContainerStrategies[containerBlock.id](workInPOIModel, poiBlockModel, containerBlock, false)
                if (workInPOIModel.isNeedBuyMore()) {
                    // 如果让本次购买多个，那么就重新运行一次初始化，这会可能导致taragetPos的变动。
                    this.workInPOIInit()
                    return true
                }
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
                return true
            case SUB_STATUS_RETURN_TO_POI:
                if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_SLOW)) {
                    workInPOIModel.moveToPOIPos()
                    return true
                }
    
                if (mob.navigation.isInProgress()) {
                    if (workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
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
                    poiBlockModel.startShopping(consumedMoney)
                    workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
                    return true
                }
                return true
            case SUB_STATUS_START_SHOPPING:
                let poiPos = workInPOIModel.poiPos
                mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
                if (poiBlockModel.checkIsShopping()) {
                    return true
                } else {
                    if (mob instanceof $EntityCustomNpc) {
                        // todo 调试方法
                        mob.saySurrounding(new $Line('感觉很实惠！'))
                    }
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
}

