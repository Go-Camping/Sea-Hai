// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(Internal.MiniGameEndJS): void>}
 */
const FishingMiniGameEndSkillMap = {
    'fishing_1_2': (event) => {
        // 捕鱼成功后会获得1分钟的幸运效果，如果存在幸运，则会累加
        let player = event.getPlayer()
        let luckAmplifier = 0
        if (player.hasEffect('minecraft:luck')) {
            luckAmplifier = player.getEffect('minecraft:luck').getAmplifier() + 1
        }
        player.potionEffects.active.add('minecraft:luck', 1200, luckAmplifier)
    },
    'fishing_5_2': (event) => {
        // 如果准确率等于100%，那么获得1分钟的幸运启示效果，如果存在幸运启示，则会累加
        let behavior = event.getFishBehavior()
        let bobberHeight = behavior.getBobberHeight() + this.customData['bobberHeight'] * 0.15
        behavior.setBobberHeight(bobberHeight)
    },
}


const FishingMiniGameEndSkill = new SkillModel('kubejs:fishing')
    .setSkillMap(FishingMiniGameEndSkillMap)