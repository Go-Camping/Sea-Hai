// priority: 800
/**
 * @this {SkillModel}
 * @type {Object<string, function(SkillModel, Internal.LootContextJS): void>}
 */
const FishingLootModifySkillMap = {
    'fishing_3_2': (skillModel, event) => {
        // 有一定概率会获得本次钓鱼战利品中部分产物的额外复制。
        skillModel.customData['addtionalLootThreshold'] = skillModel.customData['addtionalLootThreshold'] * 0.8
    },
    'fishing_8_2': (skillModel, event) => {
        // 提升产物额外复制的概率。
        skillModel.customData['addtionalLootThreshold'] = skillModel.customData['addtionalLootThreshold'] * 0.8
    },
    'fishing_10_2': (skillModel, event) => {
        // 提升产物额外复制的概率。
        skillModel.customData['copyAll'] = true
    },
}


const FishingLootModifySkill = new SkillModel('kubejs:fishing')
    .setInit(
        /** 
         * @param {SkillModel} skillModel
         * @param {Internal.LootContextJS} event
         */
        (skillModel, event) => {
            skillModel.customData = {
                'addtionalLootThreshold': 1,
                'copyAll': false
            }
        }
    )
    .setDefer(
        /**
         * @param {SkillModel} skillModel
         * @param {Internal.LootContextJS} event
         */
        (skillModel, event) => {
            if (RandomWithPlayerLuck(event.player) > skillModel.customData['addtionalLootThreshold']) {
                if (skillModel.customData['copyAll']) {
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
    .setSkillMap(FishingLootModifySkillMap)