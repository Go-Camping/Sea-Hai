// priority: 1000

/**
 * 物品品质价格管理Model
 * @param {Internal.ItemStack} itemStack
 */
function ItemQaulityModel(itemStack) {
    if (!itemStack.hasNBT()) {
        this.value = 0
        this.quality = 1
        itemStack.setNbt({ value: NBT.i(this.value), quality: NBT.i(this.quality) })
        this.itemStack = itemStack
    } else {
        if (itemStack.nbt.contains('value') && itemStack.nbt.contains('quality')) {
            this.itemStack = itemStack
            this.value = itemStack.nbt.getInt('value')
            this.quality = itemStack.nbt.getInt('quality')
        } else {
            this.value = 0
            this.quality = 1
            itemStack.nbt.putInt('value', value)
            itemStack.nbt.putInt('quality', quality)
            this.itemStack = itemStack
        }
    }
    
}

ItemQaulityModel.prototype = {
    setValue: function (value) {
        this.value = value
        this.itemStack.nbt.putInt('value', value)
        return this
    },
    setQuality: function (quality) {
        this.quality = quality
        this.itemStack.nbt.putInt('quality', quality)
        return this
    },
}