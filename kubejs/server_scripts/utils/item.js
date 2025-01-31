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
