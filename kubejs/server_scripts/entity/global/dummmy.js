// priority: 501
/**
 * @param {Internal.LivingHurtEvent} event 
 * @returns 
 */
global.TimerDummyHurt = (event) => {
    const { entity, source, amount } = event
    if (entity.entityType.toString() == 'entity.kubejs.timer_dummmy') {
        if (!source.player || !source.weapon || !source.weapon.isPresent() || source.weapon.isEmpty()) {
            event.amount = 0
            return
        }

        if (!entity.persistentData.contains('timer')) {
            entity.persistentData.putInt('timer', entity.age + 20 * 10)
        }
        const player = source.getPlayer()
        const weapon = source.getWeapon().get()
        if (weapon.hasNBT() && weapon.nbt.contains('damage_tester_uuid') && weapon.nbt.getUUID('damage_tester_uuid').equals(entity.uuid)) {
            let itemModel = new ItemQaulityModel(weapon)
            itemModel.setValue(itemModel.value + FloorFix(amount, 0))
            weapon.setNbt(itemModel.itemStack.nbt)
        } else {
            let nbt = weapon.getOrCreateTag()
            nbt.putUUID('damage_tester_uuid', entity.uuid)
            nbt.putInt('value', FloorFix(amount, 0))
            weapon.setNbt(nbt)
        }

        $NetworkHandler.CHANNEL.sendToClientPlayer(player,
            new $ClientBoundDamageNumberMessage(entity.id, amount, source, null))


        event.amount = 0
        return
    }
}


