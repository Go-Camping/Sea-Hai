// priority: 1000
// POI入口
const TAG_POI_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:poi_entrance')
// 路径点
const TAG_NODE_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:node_entrance')
const TAG_NODE_BLOCK = $TagKey.create($Registries.BLOCK.key(), 'kubejs:node_block')
// 装饰方块
const TAG_DECORATION_BLOCK = $TagKey.create($Registries.BLOCK.key(), 'kubejs:decoration_block')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', ['kubejs:fish_shop','kubejs:grocery'])

    event.add('kubejs:attractive_block', ['minecraft:black_wool'])
})