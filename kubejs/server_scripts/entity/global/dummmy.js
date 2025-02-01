// priority: 501
/**
 * @param {Internal.LivingHurtEvent} event 
 * @returns 
 */
global.DummyHurt = (event) => {
    const { entity, source, amount } = event
    if (entity.entityType.toString() != 'entity.dummmmmmy.target_dummy') return
    if (!entity.persistentData.contains('testType')) {
        entity.persistentData.putInt('testValue', 1)
    }
    if (!source.player || !source.weapon || !source.weapon.isPresent() || source.weapon.isEmpty()) return
    
    /**@type {Internal.ItemStack} */
    const weapon = source.getWeapon().get()
    const player = source.getPlayer()
    let testType = entity.persistentData.getInt('testValue')
    if (testType == 1) {
        if (!entity.persistentData.contains('timer') || entity.age > entity.persistentData.getInt('timer') || !entity.persistentData.contains('damageTesterId') || entity.persistentData.getInt('timer') > entity.age + 401) {
            entity.persistentData.putInt('timer', entity.age + 20 * 10)
            entity.persistentData.putUUID('damageTesterId', $UUID.randomUUID())
        }
        let damageTesterId = entity.persistentData.getUUID('damageTesterId')
        if (!weapon.hasNBT()) {
            let nbt = weapon.getOrCreateTag()
            nbt.putInt('value', FloorFix(amount, 0))
            nbt.putUUID('damageTesterId', damageTesterId)
            weapon.setNbt(nbt)
        }
        if (weapon.hasNBT()) {
            if (!weapon.nbt.contains('damageTesterId')) {
                weapon.nbt.putUUID('damageTesterId', damageTesterId)
            }
            if (weapon.nbt.getUUID('damageTesterId').equals(damageTesterId)) {
                let itemModel = new ItemQaulityModel(weapon)
                itemModel.setValue(itemModel.value + FloorFix(amount, 0))
                weapon.setNbt(itemModel.itemStack.nbt)
            } else {
                player.setStatusMessage(Text.translatable('status.kubejs.timer_dummy.canot_gain_value.1'))
            }
        }
    }
}