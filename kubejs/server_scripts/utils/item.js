// priority: 950
/**
 * 
 * @param {String} expType 
 * @param {Number} expAmount 
 * @returns {Internal.ItemStack}
 */
function GenExpBottle(expType, expAmount) {
    let nbt = new $CompoundTag()
    nbt.putInt('amount', expAmount)
    // 经验类型
    nbt.putString('type', expType)
    return Item.of('kubejs:exp_bottle').withNBT(nbt)
}


/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {number} damage 
 */
function DamageItem(item, damage) {
    let currentDamage = item.getDamageValue() + damage
    if (currentDamage >= item.getMaxDamage()) {
        item.setCount(item.getCount() - 1)
    } else {
        item.setDamageValue(currentDamage)
    }
}