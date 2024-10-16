// priority: 1000
// POI入口
const TAG_POI_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:poi_entrance')
// 装饰方块
const TAG_DECORATION_BLOCK = $TagKey.create($Registries.BLOCK.key(), 'kubejs:decoration_block')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', ['kubejs:fish_shop','kubejs:grocery'])

    event.add('kubejs:attractive_block', ['minecraft:black_wool'])
})