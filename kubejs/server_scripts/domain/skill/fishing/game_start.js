// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(SkillModel, Internal.MiniGameStartJS): void>}
 */
const FishingMiniGameStartSkillMap = {
    'fishing_1_1': (skillModel, event) => {
        // 浮标高度 +10%
        skillModel.customData['bobberHeight'].addAttributeModifier(0.1, 'multiple', 'base')
    },
    'fishing_2_1': (skillModel, event) => {
        // 钓鱼积分累积速度 +20%
        let behavior = event.getFishBehavior()
        behavior.setPointGain(behavior.getPointGain() * 1.2)
    },
    'fishing_3_1': (skillModel, event) => {
        // 鱼类两次行动间隔 +20%
        let behavior = event.getFishBehavior()
        behavior.setIdleTime(behavior.getIdleTime() * 1.2)
    },
    'fishing_4_1': (skillModel, event) => {
        // 鱼类的平均移动距离会更稳定
        let behavior = event.getFishBehavior()
        behavior.setMoveVariation(behavior.getMoveVariation() * 0.6)
    },
    'fishing_5_1': (skillModel, event) => {
        // 浮标高度 +15%
        skillModel.customData['bobberHeight'].addAttributeModifier(0.15, 'multiple', 'base')
    },
    'fishing_6_1': (skillModel, event) => {
        // 鱼类的最大速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setTopSpeed(behavior.getTopSpeed() * 0.8)
    },
    'fishing_7_1': (skillModel, event) => {
        // 鱼类的上浮加速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setUpAcceleration(behavior.getUpAcceleration() * 0.8)
    },
    'fishing_8_1': (skillModel, event) => {
        // 鱼类的下潜加速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setDownAcceleration(behavior.getDownAcceleration() * 0.8)
    },
    'fishing_9_1': (skillModel, event) => {
        // 钓鱼积分损失速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setPointLoss(behavior.getPointLoss() * 0.8)
    },
    'fishing_10_1': (skillModel, event) => {
        // 浮标高度 +20%
        skillModel.customData['bobberHeight'].addAttributeModifier(0.2, 'multiple', 'base')
    },
}


const FishingMiniGameStartSkill = new SkillModel('kubejs:fishing')
    .setInit(
        /** 
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameStartJS} event
         */
        (skillModel, event) => {
            skillModel.customData = {
                'bobberHeight': new AttributeManagerModel(event.getFishBehavior().getBobberHeight())
            }
        }
    )
    .setDefer(
        /**
         * @param {SkillModel} skillModel
         * @param {Internal.MiniGameStartJS} event
         */
        (skillModel, event) => {
            let behavior = event.getFishBehavior()
            behavior.setBobberHeight(skillModel.customData['bobberHeight'].calResult())
        }
    )
    .setSkillMap(FishingMiniGameStartSkillMap)