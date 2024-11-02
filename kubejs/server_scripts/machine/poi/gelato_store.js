// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:gelato_store', GelatoPOIModel)
ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:gelato_store', 100)
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
function GelatoPOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

GelatoPOIModel.prototype = Object.create(DefaultPOIModel.prototype)
GelatoPOIModel.prototype.constructor = GelatoPOIModel

GelatoPOIModel.prototype.workInPOIInit = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    const mob = workInPOIModel.mob
    const level = this.poiBlock.level
    let posList = poiBlockModel.getRelatedPosList()
    let validFlavors = []
    posList.forEach(pos => {
        let relatedBlock = level.getBlock(pos)
        if (relatedBlock.id == 'gelato_galore:ice_cream_cauldron') {
            validFlavors.push(relatedBlock.entityData.getString('Flavor'))
        }
    })
    if (validFlavors.length == 0) return false

    let selectedFlavorList = new $ListTag()
    // todo 选择球数量的概率
    let weightBallCountModel = new WeightRandomModel()
    weightBallCountModel.addWeightRandom(1, 1).addWeightRandom(2, 1).addWeightRandom(3, 1)
    let ballCount = weightBallCountModel.getWeightRandomObj()
    RandomGetN(validFlavors, ballCount).forEach(flavor => {
        selectedFlavorList.add(NBT.stringTag(flavor))
    })
    workInPOIModel.workInPOIConfig.put('gelatoFlavors', selectedFlavorList)

    let entityList = GetLivingWithinRadius(level, mob.position(), 3, (plevel, pentity) => {
        return pentity.isLiving() && GetEntityStatus(pentity) != STATUS_NONE
    })
    if (entityList.length >= 5) {
        // POI周围人数过多，则放弃排队
        return false
    }
    workInPOIModel.setSubStatus(SUB_STATUS_GELATO_WAITING_INTERACT)
    return true
}

GelatoPOIModel.prototype.workInPOITick = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    /**@type {Internal.EntityCustomNpc} */
    const mob = workInPOIModel.mob
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_GELATO_WAITING_INTERACT:
            return true
        case SUB_STATUS_RETURN_TO_POI:
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
                poiBlockModel.startShopping(consumedMoney)
                workInPOIModel.setSubStatus(SUB_STATUS_START_SHOPPING)
                return true
            }
        case SUB_STATUS_START_SHOPPING:
            let poiPos = workInPOIModel.poiPos
            mob.lookControl.setLookAt(poiPos.x, poiPos.y, poiPos.z)
            if (poiBlockModel.checkIsShopping()) {
                return true
            } else {
                mob.saySurrounding(new $Line('感觉很实惠！'))
                workInPOIModel.clearMovePos()
                workInPOIModel.setSubStatus(SUB_STATUS_NONE)
                // 跳出子状态
                return false
            }
    }
}


ItemEvents.entityInteracted(event => {
    const { target, player, item } = event
    if (GetEntityStatus(target) != STATUS_WORK_IN_POI) return
    const workInPOIModel = new EntityWorkInPOI(target)
    if (workInPOIModel.getSubStatus() == SUB_STATUS_GELATO_WAITING_INTERACT) {
        let item = player.getMainHandItem()
        if (item && item.nbt && item.nbt.contains('Flavors')) {
            let hadFlavors = []
            item.nbt.getList('Flavors', GET_COMPOUND_TYPE).forEach(/** @param {Internal.CompoundTag} nbt */nbt => {
                nbt.allKeys.forEach(key => {
                    hadFlavors.push(nbt.getString(key))
                })
            })
            let needFlavors = workInPOIModel.workInPOIConfig.getList('gelatoFlavors', GET_STRING_TYPE)
            let flag = true
            needFlavors.forEach(flavor => {
                if (hadFlavors.indexOf(flavor) == -1) {
                    player.tell(flavor)
                    flag = false
                }
            })
            if (flag) {
                workInPOIModel.setConsumedMoney(10)
                workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
            }

        }
    }
})