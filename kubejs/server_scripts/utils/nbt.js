// priority: 1000
/**
 * BlockPos列表转换为ListTag
 * @param {BlockPos[]} posList 
 * @returns {Internal.ListTag}
 */
function ConvertPosList2Nbt(posList) {
    let res = new $ListTag()
    posList.forEach(/** @param {BlockPos} pos */pos => {
        let nbt = new $CompoundTag()
        nbt.putInt('x', pos.getX())
        nbt.putInt('y', pos.getY())
        nbt.putInt('z', pos.getZ())
        res.add(nbt)
    })
    return res
}

/**
 * ListTag转换为BlockPos
 * @param {Internal.ListTag} nbtList 
 * @returns {BlockPos[]}
 */
function ConvertNbt2PosList(nbtList) {
    let posList = []
    nbtList.forEach(/** @param {Internal.CompoundTag} nbt */nbt => {
        let pos = new BlockPos(nbt.getInt('x'), nbt.getInt('y'), nbt.getInt('z'))
        posList.push(pos)
    })
    return posList
}