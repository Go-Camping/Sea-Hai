// priority: 1000

/**
 * 
 * @param {BlockPos} blockPos 
 * @param {String} color 
 */
function OutlineRenderModel(blockPos, color) {
    /** @type {BlockPos} */
    this.blockPos = blockPos
    /** @type {String} */
    this.color = color
}
OutlineRenderModel.prototype = {
    /**
     * @param {OutlineRenderModel} other 
     * @returns {boolean}
     */
    equals: function (other) {
        return this.blockPos.equals(other.blockPos) && this.color === other.color
    }
}

function ConvertNbt2OutlineRenderList(nbtList) {
    let outlineList = []
    nbtList.forEach(/** @param {Internal.CompoundTag} nbt */nbt => {
        if (!nbt || !nbt.contains('x') || !nbt.contains('y') || !nbt.contains('z')) return null
        let pos = new BlockPos(nbt.getInt('x'), nbt.getInt('y'), nbt.getInt('z'))
        let color = nbt.contains('color') ? nbt.getString('color') : '#000000'
        outlineList.push(new OutlineRenderModel(pos, color))
    })
    return outlineList
}