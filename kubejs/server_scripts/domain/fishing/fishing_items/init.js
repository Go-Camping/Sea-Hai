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
                'pointLoss': new AttributeManagerModel(event.getFishBehavior().getPointLoss()),
                'gravity': new AttributeManagerModel(event.getFishBehavior().getGravity()),
                'avgDistance': new AttributeManagerModel(event.getFishBehavior().getAvgDistance()),
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
            behavior.setPointLoss(model.customData['pointLoss'].calResult())
            behavior.setAvgDistance(model.customData['avgDistance'].calResult())
        }
    )

/**
 * @constant
 * @type {StrategyModel}
 */
const FishingItemMiniGameEndStrategy = new StrategyModel()
    .setInit(
        /** 
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameEndJS} event
         */
        (skillModel, event) => {
            skillModel.customData = {
                'valueModel': new AttributeManagerModel(1)
            }
        }
    )
    .setDefer(
        /**
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameEndJS} event
         */
        (skillModel, event) => {
            if (!event.fishSuccess) return
            if (!event.getStoredRewards().isPresent()) return
            event.getStoredRewards().get().forEach(reward => {
                if (reward.hasTag(AllowQualityTag)) {
                    let itemModel = new ItemQaulityModel(reward)
                    let value = skillModel.customData['valueModel'].setBaseAttr(itemModel.value).calResult()
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
