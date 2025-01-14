// priority: 1000
// POI入口
const TAG_POI_ENTRANCE = new ResourceLocation('kubejs:poi_entrance')
// 路径点
const TAG_NODE_ENTRANCE = new ResourceLocation('kubejs:node_entrance')
const TAG_NODE_BLOCK = new ResourceLocation('kubejs:node_block')
// 装饰方块
const TAG_DECORATION_BLOCK = new ResourceLocation('kubejs:decoration_block')
// 桌子方块
const TAG_TABLE_BLOCK = new ResourceLocation('kubejs:table_block')
// 椅子方块
const TAG_CHAIR_BLOCK = new ResourceLocation('kubejs:chair_block')
// 路标方块
const TAG_SIGN_POST_BLOCK = new ResourceLocation('kubejs:sign_post_block')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', [
        'kubejs:fish_store', 
        'kubejs:onsen_resort', 
        'kubejs:gelato_store', 
        'kubejs:crock_pot_restaurant',
        'kubejs:equestrian_pavilion'
    ])

    event.add('kubejs:decoration_block', [
        'minecraft:iron_block', 
        'minecraft:stone',
    ])

    event.add('kubejs:node_block', [
        'kubejs:way_node',
    ])

    event.add('kubejs:node_entrance', [
        'kubejs:aether_gate',
    ])

    event.add('kubejs:table_block', [
        '#refurbished_furniture:tuckable',
    ])

    event.add('kubejs:chair_block', [
        'refurbished_furniture:oak_chair', 
        'refurbished_furniture:spruce_chair', 
        'refurbished_furniture:birch_chair', 
        'refurbished_furniture:jungle_chair', 
        'refurbished_furniture:acacia_chair', 
        'refurbished_furniture:dark_oak_chair', 
        'refurbished_furniture:mangrove_chair', 
        'refurbished_furniture:cherry_chair', 
        'refurbished_furniture:crimson_chair', 
        'refurbished_furniture:warped_chair',
    ])


    event.add('kubejs:sign_post_block', [
        'supplementaries:sign_post',
    ])
})