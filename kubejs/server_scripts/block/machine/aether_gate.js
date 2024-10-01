ServerEvents.recipes(event => {
    // event.recipes.custommachinery.custom_machine('kubejs:aether_gate', 1000)
    // .requireStructure([[
    //   "aaa",
    //   "a a",
    //   "aaa",
    //   " m "
    // ]], {"a": "minecraft:stone"})
})


CustomMachineryEvents.upgrades(event => {
    event.create(Item.of('kubejs:aether_collector_1'))
        .machine('kubejs:aether_gate')
        .modifier(CMRecipeModifierBuilder.mulInput('custommachinery:speed', 1.2).min(10))
        .build()
})