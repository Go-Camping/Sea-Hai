// priority: 1000
StartupEvents.registry('entity_type', event => {

    event.create('kubejs:timer_dummmy', 'entityjs:mob')
        .tick((entity) => {
            if (entity.persistentData.contains('timer') && entity.persistentData.getInt('timer') <= entity.age) {
                entity.discard()
                if (entity.lastAttacker.isPlayer() && entity.lastAttacker.isAlive()) {
                }
                return
            }
        })
        .mobCategory('misc')
        .noEggItem()
        .setRenderType('translucent')
        .sized(1.4, 4.5)
        .updateInterval(1)
        .modelResource(() => 'kubejs:geo/dummmy.geo.json')
        .textureResource(() => `kubejs:textures/entity/dummmy.png`)
        .isPushable(false)

})

EntityJSEvents.attributes(event => {
    event.modify('kubejs:timer_dummmy', attribute => {
        attribute.add('minecraft:generic.max_health', 20)
        attribute.add('minecraft:generic.knockback_resistance', 1)
    })

})

/**
 * 使用ForgeEvent监听LivingHurtEvent事件
 * 用于替换原有EntityEvents.hurt事件
 */
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    global.TimerDummyHurt(event)
})
