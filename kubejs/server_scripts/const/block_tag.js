// priority: 1000
const $TagKey = Java.loadClass('net.minecraft.tags.TagKey')
const $Registries = Java.loadClass("net.minecraft.core.registries.BuiltInRegistries")
const POI_ENTRANCE = $TagKey.create($Registries.BLOCK.key(), 'kubejs:poi_entrance')

ServerEvents.tags('block', event => {
    event.add('kubejs:poi_entrance', ['minecraft:white_wool'])
})