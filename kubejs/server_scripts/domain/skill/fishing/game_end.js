// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(Internal.MiniGameStartJS): void>}
 */
const FishingMiniGameEndSkillMap = {
    'fishing_1_2': (event) => {
        // 浮标高度 +10%
        let behavior = event.getFishBehavior()
        let bobberHeight = behavior.getBobberHeight() + this.customData['bobberHeight'] * 0.1
        behavior.setBobberHeight(bobberHeight)
    },
    'fishing_2_2': (event) => {
        // 钓鱼积分累积速度 +20%
        let behavior = event.getFishBehavior()
        behavior.setPointGain(behavior.getPointGain() * 1.2)
    },
    'fishing_3_2': (event) => {
        // 鱼类两次行动间隔 +20%
        let behavior = event.getFishBehavior()
        behavior.setIdleTime(behavior.getIdleTime() * 1.2)
    },
    'fishing_4_2': (event) => {
        // 鱼类的平均移动距离会更稳定
        let behavior = event.getFishBehavior()
        behavior.setMoveVariation(behavior.getMoveVariation() * 0.6)
    },
    'fishing_5_2': (event) => {
        // 浮标高度 +15%
        let behavior = event.getFishBehavior()
        let bobberHeight = behavior.getBobberHeight() + this.customData['bobberHeight'] * 0.15
        behavior.setBobberHeight(bobberHeight)
    },
    'fishing_6_2': (event) => {
        // 鱼类的最大速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setTopSpeed(behavior.getTopSpeed() * 0.8)
    },
    'fishing_7_2': (event) => {
        // 鱼类的上浮加速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setUpAcceleration(behavior.getUpAcceleration() * 0.8)
    },
    'fishing_8_2': (event) => {
        // 鱼类的下潜加速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setDownAcceleration(behavior.getDownAcceleration() * 0.8)
    },
    'fishing_9_2': (event) => {
        // 钓鱼积分损失速度 -20%
        let behavior = event.getFishBehavior()
        behavior.setPointLoss(behavior.getPointLoss() * 0.8)
    },
    'fishing_10_2': (event) => {
        // 浮标高度 +20%
        let behavior = event.getFishBehavior()
        let bobberHeight = behavior.getBobberHeight() + this.customData['bobberHeight'] * 0.2
        behavior.setBobberHeight(bobberHeight)
    },
}


const FishingMiniGameEndSkill = new SkillModel('kubejs:fishing')
    .setSkillMap(FishingMiniGameEndSkillMap)