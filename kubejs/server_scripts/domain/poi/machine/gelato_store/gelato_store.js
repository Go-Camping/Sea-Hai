// priority: 800
/**
 * 状态配方，用于添加控制POI状态的各种配方，往往用于购买状态后的额外信息的处理和同步
 */
RegistryPOIStrategy('kubejs:gelato_store', GelatoStorePOIModel)
RegistryNPCSubStatusItemInteractStrategy(SUB_STATUS_GELATO_WAITING_INTERACT, GelatoStoreNPCItemInteractStrategy)

ServerEvents.recipes(event => {
    event.recipes.custommachinery.custom_machine('kubejs:gelato_store', 100)
        .requireFunctionOnEnd(ctx => {
            const { machine, block } = ctx
            const shopPOIModel = new ShopPOIBlock(block)
            if (!shopPOIModel.consumeMoneyOnMachine(machine)) {
                return ctx.error('')
            }
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

    event.recipes.custommachinery.custom_machine('kubejs:gelato_store', 100)
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
function GelatoStorePOIModel(workInPOIModel, poiBlock) {
    // DefaultPOIModel.call(this, workInPOIModel, poiBlock)
    this.workInPOIModel = workInPOIModel
    this.poiBlock = poiBlock
    this.poiBlockModel = new ShopPOIBlock(poiBlock)
}

GelatoStorePOIModel.prototype = Object.create(DefaultPOIModel.prototype)
GelatoStorePOIModel.prototype.constructor = GelatoStorePOIModel

GelatoStorePOIModel.prototype.workInPOIInit = function () {
    const poiBlockModel = this.poiBlockModel
    const workInPOIModel = this.workInPOIModel
    const mob = workInPOIModel.mob
    const level = this.poiBlock.level
    let posList = poiBlockModel.getRelatedPosList()
    let validFlavors = []
    posList.forEach(pos => {
        let relatedBlock = level.getBlock(pos)
        if (relatedBlock.id == 'gelato_galore:ice_cream_cauldron') {
            let curFlavor = relatedBlock.entityData.getString('Flavor')
            if (curFlavor && validFlavors.indexOf(curFlavor) == -1) {
                validFlavors.push(curFlavor)
            }
        }
    })
    if (validFlavors.length == 0) return false

    let selectedFlavorList = new $ListTag()
    // todo 选择球数量的概率
    let weightBallCountModel = new WeightRandomModel()
    weightBallCountModel.addWeightRandom(1, 1).addWeightRandom(2, 1).addWeightRandom(3, 1)
    let ballCount = weightBallCountModel.getWeightRandomObj()
    if (ballCount > validFlavors.length) ballCount = validFlavors.length
    RandomGetN(validFlavors, ballCount).forEach(flavor => {
        selectedFlavorList.add(NBT.stringTag(flavor))
    })
    workInPOIModel.workInPOIConfig.put('gelatoFlavors', selectedFlavorList)

    let entityList = GetLivingWithinRadius(level, mob.position(), 3, (plevel, pentity) => {
        return pentity.isLiving() && GetEntityStatus(pentity) != STATUS_NONE
    })
    if (entityList.length > 5) {
        // POI周围人数过多，则放弃排队
        return false
    }
    workInPOIModel.setSubStatus(SUB_STATUS_GELATO_WAITING_INTERACT)
    return true
}



GelatoStorePOIModel.prototype.workInPOITick = function () {
    const workInPOIModel = this.workInPOIModel
    switch (workInPOIModel.getSubStatus()) {
        case SUB_STATUS_GELATO_WAITING_INTERACT:
            return true
        case SUB_STATUS_RETURN_TO_POI:
            return GelatoStoreReturnToPOI(this)
        case SUB_STATUS_START_SHOPPING:
            return GelatoStoreStartShopping(this)
        default:
            workInPOIModel.clearTargetPos()
            workInPOIModel.setSubStatus(SUB_STATUS_NONE)
            return false
    }
}



/**
 * 
 * @param {String[]} flavorList 
 */
function getGelatoStoreWaitString(flavorList) {
    let flavorListString = []
    flavorList.forEach(flavor => {
        return flavorListString.push(getTransFromFlavor(flavor))
    })
    let lineString
    switch (flavorListString.length) {
        case 1:
            lineString = RandomGet(ONE_BALL_INTERACT_LINE)(flavorListString)
            break
        case 2:
            lineString = RandomGet(TWO_BALL_INTERACT_LINE)(flavorListString)
            break
        case 3:
            lineString = RandomGet(THREE_BALL_INTERACT_LINE)(flavorListString)
            break
    }
    return lineString
}

const ONE_BALL_INTERACT_LINE = [
    (selectedFlavorList) => Text.translatable('interactline.kubejs.gelato.one_ball.1', selectedFlavorList[0]).getString()
]
const TWO_BALL_INTERACT_LINE = [
    (selectedFlavorList) => Text.translatable('interactline.kubejs.gelato.two_ball.1', selectedFlavorList[0], selectedFlavorList[1]).getString()
]
const THREE_BALL_INTERACT_LINE = [
    (selectedFlavorList) => Text.translatable('interactline.kubejs.gelato.three_ball.1', selectedFlavorList[0], selectedFlavorList[1], selectedFlavorList[2]).getString()
]

/**
 * @param {string} flavor 
 */
function getTransFromFlavor(flavor) {
    return Text.translatable('kubejs.gelato.flavor.' + flavor.split(':')[1])
}

/**
 * @param {GelatoStorePOIModel} gelatoStorePOIModel 
 * @returns {boolean}
 */
function GelatoStoreReturnToPOI(gelatoStorePOIModel) {
    const poiBlockModel = gelatoStorePOIModel.poiBlockModel
    const workInPOIModel = gelatoStorePOIModel.workInPOIModel
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
 * @param {GelatoStorePOIModel} gelatoStorePOIModel 
 * @returns {boolean}
 */
function GelatoStoreStartShopping(gelatoStorePOIModel) {
    const poiBlockModel = gelatoStorePOIModel.poiBlockModel
    const workInPOIModel = gelatoStorePOIModel.workInPOIModel
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
        mob.advanced.setLine(LINE_INTERACT, 0, '', '')
        // 跳出子状态
        return false
    }
}
/**
 * 
 * @param {Internal.ItemEntityInteractedEventJS} event 
 * @param {EntityWorkInPOI} workInPOIModel 
 */
function GelatoStoreNPCItemInteractStrategy(event, workInPOIModel) {
    const { item, player } = event
    /**@type {Internal.EntityCustomNpc} */
    const target = event.target
    if (player.isShiftKeyDown()) {
        workInPOIModel.setSubStatus(SUB_STATUS_NONE)
        NPCSaySurrounding(target, NPC_LINE_FORCE_TO_LEAVE)
        return
    }
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
            if (hadFlavors.indexOf(flavor.getAsString()) == -1) {
                flag = false
            }
        })
        if (flag) {
            target.saySurrounding(new $Line(Text.translatable('interactline.kubejs.gelato.complete.1').getString()))
            let holdItem = item.copy()
            holdItem.setCount(1)
            target.setMainHandItem(holdItem)
            if (item.count > 1) {
                item.shrink(1)
            } else {
                player.setMainHandItem('minecraft:air')
            }
            workInPOIModel.setConsumedMoney(30 * hadFlavors.length)
            workInPOIModel.setSubStatus(SUB_STATUS_RETURN_TO_POI)
            return
        }
    } else {
        let selectedFlavorListNbt = workInPOIModel.workInPOIConfig.getList('gelatoFlavors', GET_STRING_TYPE)
        if (!selectedFlavorListNbt) return
        let selectedFlavorList = []
        selectedFlavorListNbt.forEach(flavor => {
            selectedFlavorList.push(flavor.getAsString())
        })
        target.saySurrounding(new $Line(getGelatoStoreWaitString(selectedFlavorList)))
    }
}