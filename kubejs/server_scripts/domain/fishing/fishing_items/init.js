// priority:801
/**
 * @constant
 * @type {StrategyModel}
 */
const FishingItemMiniGameStartStrategy = new StrategyModel()
    .setInit(
        /** 
         * @param {StrategyModel} model
         * @param {Internal.MiniGameStartJS} event
         */
        (model, event) => {
            model.customData = {
                'bobberUpAcceleration': new AttributeManagerModel(event.getFishBehavior().getBobberUpAcceleration()),
                'gravity': new AttributeManagerModel(event.getFishBehavior().getGravity()),
                'avgDistance': new AttributeManagerModel(event.getFishBehavior().getAvgDistance()),
                'bobberHeight': new AttributeManagerModel(event.getFishBehavior().getBobberHeight()),
                'pointLoss': new AttributeManagerModel(event.getFishBehavior().getPointLoss()),
                'pointGain': new AttributeManagerModel(event.getFishBehavior().getPointGain()),
            }
        }
    )
    .setDefer(
        /**
         * @param {StrategyModel} model
         * @param {Internal.MiniGameStartJS} event
         */
        (model, event) => {
            let behavior = event.getFishBehavior()
            behavior.setGravity(model.customData['gravity'].calResult())
            behavior.setAvgDistance(model.customData['avgDistance'].calResult())
            behavior.setBobberUpAcceleration(model.customData['bobberUpAcceleration'].calResult())
            behavior.setBobberHeight(model.customData['bobberHeight'].calResult())
            behavior.setPointLoss(model.customData['pointLoss'].calResult())
            behavior.setPointGain(model.customData['pointGain'].calResult())
        }
    )

/**
 * @constant
 * @type {StrategyModel}
 */
const FishingItemMiniGameEndStrategy = new StrategyModel()
    .setInit(
        /** 
         * @param {StrategyModel} model
         * @param {Internal.MiniGameEndJS} event
         */
        (model, event) => {
            model.customData = {
                'valueModel': new AttributeManagerModel(1)
            }
        }
    )
    .setDefer(
        /**
         * @param {StrategyModel} model
         * @param {Internal.MiniGameEndJS} event
         */
        (model, event) => {
            if (!event.fishSuccess) return
            if (!event.getStoredRewards().isPresent()) return
            event.getStoredRewards().get().forEach(reward => {
                if (reward.hasTag(AllowQualityTag)) {
                    let itemModel = new ItemQaulityModel(reward)
                    let value = model.customData['valueModel'].setBaseAttr(itemModel.value).calResult()
                    itemModel.setValue(value)
                }
            })
        }
    )

/**
 * @constant
 * @type {StrategyModel}
 */
const FishingItemLootModifyStrategy = new StrategyModel()
    .setInit(
        /** 
         * @param {StrategyModel} model
         * @param {Internal.LootContextJS} event
         */
        (model, event) => {
            model.customData = {
                'addtionalLootThreshold': 1,
                'copyAll': false
            }
        }
    )
    .setDefer(
        /**
         * @param {StrategyModel} model
         * @param {Internal.LootContextJS} event
         */
        (model, event) => {
            if (RandomWithPlayerLuck(event.player) > model.customData['addtionalLootThreshold']) {
                if (model.customData['copyAll']) {
                    event.loot.forEach((loot) => {
                        loot.setCount(loot.getCount() * 2)
                    })
                } else {
                    let lootCopy = RandomGet(event.loot)
                    event.addLoot(lootCopy)
                }
            }
        }
    )
