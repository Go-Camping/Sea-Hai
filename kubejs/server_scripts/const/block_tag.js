// priority: 1000
const $TagKey = Java.loadClass('net.minecraft.tags.TagKey')
const $Registries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")

// POI入口
const POI_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:poi_entrance')
// 吸引性方块，用于调节生物视线
const ATTRACTIVE_BLOCK = $TagKey.create($Registries.BLOCK.key(), 'kubejs:attractive_block')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', ['minecraft:white_wool'])

    event.add('kubejs:attractive_block', ['minecraft:black_wool'])
})