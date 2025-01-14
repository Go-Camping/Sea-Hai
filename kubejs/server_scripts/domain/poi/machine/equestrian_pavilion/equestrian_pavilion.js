// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:equestrian_pavilion', EquestrianPavilionPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:equestrian_pavilion', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            const consumeMoney = shopPOIModel.getConsumingMoney()
            machine.data.exp_bar = machine.data.exp_bar ? Math.min(machine.data.exp_bar + consumeMoney, BAR_MAX) : Math.min(consumeMoney, BAR_MAX)
            let coinSlotItem = machine.getItemStored('coin_output')
            if (coinSlotItem && coinSlotItem.hasTag('lightmanscurrency:wallet')) {
                let coinItemList = ConvertMoneyIntoCoinItemList(CoinList, consumeMoney)
                coinItemList.forEach(coinItem => {
                    let unpickableItem = $WalletItem.PickupCoin(coinSlotItem, coinItem)
                    ctx.block.popItemFromFace(unpickableItem, Direction.UP)
                })
            } else {
                let playerBankAccount = $BankSaveData.GetBankAccount(false, ctx.machine.ownerId)
                playerBankAccount.depositMoney(ConvertMainMoneyValue(consumeMoney))
            }

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
        .resetOnError()

    event.recipes.custommachinery.custom_machine('kubejs:equestrian_pavilion', 100)
        .requireFunctionOnEnd(ctx => {
            const machine = ctx.machine
            const block = ctx.block
            const level = block.level
            if (!block.entity || !block.entity.persistentData.contains('interactPlayer')) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            let playerUuid = block.entity.persistentData.getUUID('interactPlayer')
            let targetPlayer = level.getPlayerByUUID(playerUuid)
            if (!targetPlayer.isAlive()) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            if (!machine.data.exp_bar || machine.data.exp_bar <= 0) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            }
            targetPlayer.give(GenExpBottle('kubejs:service', machine.data.exp_bar))
            machine.data.exp_bar = 0
            return ctx.success()
        })
        .requireButtonPressed('dump_exp')
        .requireFunctionOnStart(ctx => {
            const machine = ctx.machine
            const block = ctx.block
            const level = block.level

            if (!block.entity || !block.entity.persistentData.contains('interactPlayer')) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            let playerUuid = block.entity.persistentData.getUUID('interactPlayer')
            let targetPlayer = level.getPlayerByUUID(playerUuid)
            if (!targetPlayer.isAlive()) return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))

            if (!machine.data.exp_bar || machine.data.exp_bar <= 0) {
                return ctx.error(Text.translatable('errors.kubejs.machine.no_use_output'))
            }
            return ctx.success()
        })
        .resetOnError()
})


/**
 * @param {EntityWorkInPOI} workInPOIModel 
 * @param {Internal.BlockContainerJS} poiBlock 
 */
function EquestrianPavilionPOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

EquestrianPavilionPOIModel.prototype = Object.create(DefaultPOIModel.prototype)
EquestrianPavilionPOIModel.prototype.constructor = EquestrianPavilionPOIModel

EquestrianPavilionPOIModel.prototype.workInPOIInit = function () {
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
    let shuffList = Shuffle(RandomGetN(noInvPos, Math.ceil(noInvPos.length * Math.random())))

    workInPOIModel.setTargetPos(RandomOffsetPos(shuffList.shift(), 1))
    workInPOIModel.setSelectedPosList(shuffList)
    workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_RELATED_POS)
    return true
}

EquestrianPavilionPOIModel.prototype.workInPOITick = function () {
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_MOVE_TO_RELATED_POS:
            return EquestrianPavilionMoveToRelatedPos(this)
        case SUB_STATUS_OBSERVING_ANIMAL:
            return EquestrianPavilionObservingAnimal(this)
        case SUB_STATUS_BUY_SOUVENIRS:
            return EquestrianPavilionBuySouvenirs(this)
        case SUB_STATUS_RETURN_TO_POI:
            return EquestrianPavilionReturnToPOI(this)
        case SUB_STATUS_START_SHOPPING:
            return EquestrianPavilionStartShopping(this)
        default:
            workInPOIModel.clearTargetPos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}


/**
 * @param {EquestrianPavilionPOIModel} equestrianPavilionPOIModel 
 * @returns {boolean}
 */
function EquestrianPavilionMoveToRelatedPos(equestrianPavilionPOIModel) {
    const workInPOIModel = equestrianPavilionPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    // 如果没有可用的移动目标，那么会直接跳出，使得该workIn状态结束
    if (!workInPOIModel.checkArrivedTargetPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 如果到达了目标位置，搜索可能的马的位置
    let validHorseList = GetLivingWithinRadius(mob.level, mob.position(), 10, (level, targetEntity) => {
        if (!targetEntity || !targetEntity.isAlive()) return false
        if (targetEntity instanceof $SWEMHorseEntity) {
            return true
        }
    })
    // 寻找最近的马
    /**@type {Internal.SWEMHorseEntity} */
    let nearestHorse = null
    let nearestHorseDistance = POSITIVE_INFINITY
    validHorseList.forEach(horse => {
        let distance = horse.position().distanceTo(mob.position())
        if (distance < nearestHorseDistance) {
            nearestHorse = horse
            nearestHorseDistance = distance
        }
    })
    if (!nearestHorse) return false

    workInPOIModel.setWaitTimer(20 * (5 + Math.random() * 10))
    workInPOIModel.setSubStatus(SUB_STATUS_OBSERVING_ANIMAL)
    return true
}

/**
 * @param {EquestrianPavilionPOIModel} equestrianPavilionPOIModel 
 * @returns {boolean}
 */
function EquestrianPavilionObservingAnimal(equestrianPavilionPOIModel) {
    const workInPOIModel = equestrianPavilionPOIModel.workInPOIModel
    const poiBlockModel = equestrianPavilionPOIModel.poiBlockModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    const level = mob.level

    if (workInPOIModel.checkArriveWaitTimer()) {
        workInPOIModel.addConsumedMoney(100)
        if (workInPOIModel.getSelectedPosList().length <= 0) {
            // 购买纪念品
            let hasInvPos = poiBlockModel.getRelatedPosList().filter(relatedPos => {
                let relatedBlock = level.getBlock(relatedPos)
                // 如果绑定了容器，就认为是一个可用的消费地点
                if (relatedBlock.inventory && this.consumeContainerItem(relatedBlock, true)) return true
                return false
            })

            if (hasInvPos.length <= 0) {
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
            } else {
                workInPOIModel.setTargetPos(RandomGet(hasInvPos))
                workInPOIModel.moveToTargetPos()
                workInPOIModel.setSubStatus(SUB_STATUS_BUY_SOUVENIRS)
            }
            return true
        } else {
            let targetPos = workInPOIModel.shiftSelectPosList()
            workInPOIModel.setTargetPos(RandomOffsetPos(targetPos, 1))
            workInPOIModel.setSubStatus(SUB_STATUS_MOVE_TO_RELATED_POS)
            return true
        }
    }
    // 如果到达了目标位置，搜索可能的马的位置
    if (mob.totalTicksAlive % 2 == 0) {
        let validHorseList = GetLivingWithinRadius(mob.level, mob.position(), 10, (level, targetEntity) => {
            if (!targetEntity || !targetEntity.isAlive()) return false
            if (targetEntity instanceof $SWEMHorseEntity) {
                return true
            }
        })
        // 寻找最近的马
        /**@type {Internal.SWEMHorseEntity} */
        let nearestHorse = null
        let nearestHorseDistance = POSITIVE_INFINITY
        validHorseList.forEach(horse => {
            let distance = horse.position().distanceTo(mob.position())
            if (distance < nearestHorseDistance) {
                nearestHorse = horse
                nearestHorseDistance = distance
            }
        })
    
        let targetPos = GetEntityPosition(nearestHorse).above(2)
        mob.lookControl.setLookAt(targetPos.x, targetPos.y, targetPos.z)
    }

    return true
}

/**
 * @param {EquestrianPavilionPOIModel} equestrianPavilionPOIModel 
 * @returns {boolean}
 */
function EquestrianPavilionBuySouvenirs(equestrianPavilionPOIModel) {
    const workInPOIModel = equestrianPavilionPOIModel.workInPOIModel
    const poiBlockModel = equestrianPavilionPOIModel.poiBlockModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob

    const level = mob.level
    if (!workInPOIModel.checkArrivedTargetPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToTargetPos()
        return true
    }
    // 容器取出与结算逻辑
    let containerBlock = level.getBlock(workInPOIModel.getTargetPos())
    this.consumeContainerItem(containerBlock, false)
    if (workInPOIModel.isNeedBuyMore()) {
        let hasInvPos = poiBlockModel.getRelatedPosList().filter(relatedPos => {
            let relatedBlock = level.getBlock(relatedPos)
            if (relatedBlock.inventory && this.consumeContainerItem(relatedBlock, true)) return true
            return false
        })
        if (hasInvPos.length > 0) {
            workInPOIModel.setTargetPos(RandomGet(hasInvPos))
            workInPOIModel.moveToTargetPos()
            return true
        }
    }
    workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
    return true
}


/**
 * @param {EquestrianPavilionPOIModel} equestrianPavilionPOIModel 
 * @returns {boolean}
 */
function EquestrianPavilionReturnToPOI(equestrianPavilionPOIModel) {
    const poiBlockModel = equestrianPavilionPOIModel.poiBlockModel
    const workInPOIModel = equestrianPavilionPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    if (!workInPOIModel.checkArrivedPOIPos(GOTO_POI_DISTANCE_STOP)) {
        workInPOIModel.moveToPOIPos()
        return true
    } else {
        mob.navigation.stop()
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
 * @param {EquestrianPavilionPOIModel} equestrianPavilionPOIModel 
 * @returns {boolean}
 */
function EquestrianPavilionStartShopping(equestrianPavilionPOIModel) {
    const poiBlockModel = equestrianPavilionPOIModel.poiBlockModel
    const workInPOIModel = equestrianPavilionPOIModel.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
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

/**
 * @param {Internal.ItemStack} item 
 * @returns 
 */
EquestrianPavilionPOIModel.prototype.consumeConatinerTester = function (item) {
    let res = item.hasNBT() && item.nbt.contains('value')
    return res
}
// && item.hasTag('kubejs:equestrian_pavilion_goods')