// priority: 900

/**
 * 核心+球壳生态球属性构建
 * @returns 
 */
function CoreSphereModel() {
    SphereModel.call(this)
    this.coreBlock = Block.getBlock('minecraft:coal_block').defaultBlockState()
    this.coreRadius = 2
    this.shellBlock = Block.getBlock('minecraft:stone').defaultBlockState()
    this.shellRadius = 10
    this.shellThickness = 1
    this.decorator = new SphereDecoratorPackerModel()
}

CoreSphereModel.prototype = Object.create(SphereModel.prototype)
CoreSphereModel.prototype.constructor = CoreSphereModel

/**
 * 生成生态球
 * @param {Internal.Level} level
 * @param {BlockPos} pos 中心位置
 * @returns
 */
CoreSphereModel.prototype.generateSphere = function (level, pos) {
    /**@type {Object<string, Internal.ChunkAccess>} */
    let chunkMap = {}
    for (let x = -this.shellRadius; x <= this.shellRadius; x++) {
        for (let z = -this.shellRadius; z <= this.shellRadius; z++) {
            for (let y = -this.shellRadius; y <= this.shellRadius; y++) {
                let distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2) + Math.pow(z - pos.z, 2))
                if (distance > this.shellRadius) {
                    // 球壳外部空间
                    
                    continue
                }
                if (distance <= this.shellRadius && distance >= this.shellRadius - this.shellThickness) {
                    // 球壳填充
                    let shellPos = new BlockPos(pos.x + x, pos.y + y, pos.z + z)
                    let chunkAccess = GetChunkFromMap(level, chunkMap, shellPos)
                    chunkAccess.setBlockState(shellPos, this.shellBlock, false)
                    continue
                }
                if (distance <= this.coreRadius) {
                    // 核心区域填充
                    let corePos = new BlockPos(pos.x + x, pos.y + y, pos.z + z)
                    let chunkAccess = GetChunkFromMap(level, chunkMap, corePos)
                    chunkAccess.setBlockState(corePos, this.coreBlock, false)
                    continue
                }
                // 球壳内部空闲空间
            }
        }
    }
    return
}