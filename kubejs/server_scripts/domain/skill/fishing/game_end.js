// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(SkillModel, Internal.MiniGameEndJS): void>}
 */
const FishingMiniGameEndSkillMap = {
    'fishing_1_2': (skillModel, event) => {
        // 每次成功的钓鱼会提升你5点的钓鱼经验
        if (!event.fishSuccess) return
        let playerSkill = new PufferskillModel(event.player)
        let skillCategory = playerSkill.getSkillCategory('kubejs:fishing')
        playerSkill.addExpToCategory(skillCategory, 5)
    },
    'fishing_2_2': (skillModel, event) => {
        // 捕鱼成功后会获得1分钟的幸运效果，如果存在幸运，则会累加
        let player = event.player
        if (!event.fishSuccess) {
            if (player.hasEffect('minecraft:luck')) {
                player.removeEffect('minecraft:luck')
            }
            return
        }
        let luckAmplifier = 0
        if (player.hasEffect('minecraft:luck')) {
            luckAmplifier = player.getEffect('minecraft:luck').getAmplifier() + 1
        }
        player.potionEffects.add('minecraft:luck', 1200, luckAmplifier, false, false)
    },
    'fishing_4_2': (skillModel, event) => {
        // 如果一次垂钓获得了多于一的战利品，将会根据你获得的战利品的数量来修正战利品的得分
        if (!event.fishSuccess) return
        if (!event.getStoredRewards().isPresent()) return
        let amount = event.getStoredRewards().get().size()
        skillModel.customData['valueModel'].addAttributeModifier(amount * 0.1, 'multiple', 'base')
    },
    'fishing_5_2': (skillModel, event) => {
        // 如果准确率等于100%，那么获得1分钟的幸运启示效果，如果存在幸运启示，则会累加
        let player = event.player
        if (!event.fishSuccess) {
            if (player.hasEffect('kubejs:luck_deity')) {
                player.removeEffect('kubejs:luck_deity')
            }
            return
        }
        if (event.accuracy < 1) {
            return
        }
        let amplifier = 0
        if (player.hasEffect('kubejs:luck_deity')) {
            amplifier = player.getEffect('kubejs:luck_deity').getAmplifier() + 1
        }
        player.potionEffects.add('kubejs:luck_deity', 1200, amplifier, false, false)
    },
    'fishing_6_2': (skillModel, event) => {
        // 提高鱼的价值+25%
        if (!event.fishSuccess) return
        skillModel.customData['valueModel'].addAttributeModifier(0.25, 'multiple', 'base')
    },
    'fishing_7_2': (skillModel, event) => {
        // 根据你的准确度矫正得分
        if (!event.fishSuccess) return
        skillModel.customData['valueModel'].addAttributeModifier(FloorFix(event.accuracy, 1), 'multiple', 'base')
    },
    'fishing_9_2': (skillModel, event) => {
        // 如果你的饥饿值大于10，多余的饥饿值会直接转化为鱼的评分。
        if (!event.fishSuccess && event.player.foodLevel > 10) return
        skillModel.customData['valueModel'].addAttributeModifier(event.player.foodLevel - 10, 'addition', 'base')
        event.player.setFoodLevel(10)
    },
}


const FishingMiniGameEndSkill = new SkillModel('kubejs:fishing')
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
    .setSkillMap(FishingMiniGameEndSkillMap)