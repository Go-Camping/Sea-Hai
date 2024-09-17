// priority: 1000
// POI入口
const TAG_POI_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:poi_entrance')
// 吸引性方块，用于调节生物视线
const TAG_ATTRACTIVE_BLOCK = $TagKey.create($Registries.BLOCK.key(), 'kubejs:attractive_block')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', ['kubejs:fish_shop'])

    event.add('kubejs:attractive_block', ['minecraft:black_wool'])
})