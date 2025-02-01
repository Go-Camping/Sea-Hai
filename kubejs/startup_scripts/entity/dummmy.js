// priority: 1000
/**
 * 使用ForgeEvent监听LivingHurtEvent事件
 * 用于替换原有EntityEvents.hurt事件
 */
ForgeEvents.onEvent('net.minecraftforge.event.entity.living.LivingHurtEvent', event => {
    global.DummyHurt(event)
})
