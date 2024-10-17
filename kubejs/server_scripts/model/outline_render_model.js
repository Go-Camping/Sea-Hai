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


/**
 * @param {OutlineRenderModel[]} outlineList 
 * @returns {Internal.ListTag}
 */
function ConvertOutlineRenderList2Nbt(outlineList) {
    let res = new $ListTag()
    outlineList.forEach(/** @param {OutlineRenderModel} outline */outline => {
        let nbt = new $CompoundTag()
        let blockPos = outline.blockPos
        nbt.putInt('x', blockPos.getX())
        nbt.putInt('y', blockPos.getY())
        nbt.putInt('z', blockPos.getZ())
        nbt.putString('color', outline.color)
        res.add(nbt)
    })
    return res
}

/**
 * 
 * @param {BlockPos[]} blockPosList 
 * @param {String} color 
 * @returns {OutlineRenderModel[]}
 */
function ConvertBlockPosList2OutlineRenderList(blockPosList, color) {
    let outlineList = []
    blockPosList.forEach(/** @param {BlockPos} blockPos */blockPos => {
        outlineList.push(new OutlineRenderModel(blockPos, color))
    })
    return outlineList
}

/**
 * 
 * @param {Internal.ListTag} nbtList 
 * @param {String} color 
 * @returns {Internal.ListTag}
 */
function ConvertBlockPosListNbt2OutlineRenderListNbt(nbtList, color) {
    nbtList.forEach(/** @param {Internal.CompoundTag} nbt */nbt => {
        nbt.putString('color', color)
    })
    return nbtList
}