// priority: 900

/**
 * 核心+球壳生态球属性构建
 * @returns 
 */
function RingSphereModel() {
    SphereModel.call(this)
    this.coreBlock = Block.getBlock('minecraft:coal_block').defaultBlockState()
    this.coreRadius = 2
    this.shellBlock = Block.getBlock('minecraft:stone').defaultBlockState()
    this.shellRadius = 10
    this.shellThickness = 1
    /** @type {RingProperty[]} */ 
    this.ringProperties = []

    this.decorator = new SphereDecoratorPackerModel()
    this.center = new BlockPos(0, 0, 0)
}

RingSphereModel.prototype = Object.create(SphereModel.prototype)
RingSphereModel.prototype.constructor = RingSphereModel

function RingProperty(block, radius, width) {
    this.block = block
    this.radius = radius
    this.width = width
}


/**
 * 设置核心
 * @param {string} block
 * @returns
 */
RingSphereModel.prototype.setCoreProperties = function (block, radius) {
    this.coreBlock = block
    this.coreRadius = radius
    return this
}

/**
 * 设置环
 * @param {string} block
 * @param {number} radius
 * @param {number} width
 * @returns
 */
RingSphereModel.prototype.addRingProperties = function (block, radius, width) {
    this.ringProperties.push(new RingProperty(block, radius, width))
    return this
}


/**
 * 生成生态球
 * @param {Internal.ServerLevel} level
 * @param {BlockPos} pos 中心位置
 * @returns
 */
// todo
RingSphereModel.prototype.generateSphere = function (level, pos) {
    this.center = pos
    /**@type {Object<string, Internal.ChunkAccess>} */
    for (let x = -this.shellRadius; x <= this.shellRadius; x++) {
        for (let z = -this.shellRadius; z <= this.shellRadius; z++) {
            for (let y = -this.shellRadius; y <= this.shellRadius; y++) {
                let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
                if (distance <= this.shellRadius && distance >= this.shellRadius - this.shellThickness) {
                    // 球壳填充
                    let curPos = new BlockPos(pos.x + x, pos.y + y, pos.z + z)
                    level.setBlock(curPos, this.shellBlock, 2)
                    this.decorator.runShellDecorators(level, this, new BlockPos(x, y, z))
                    continue
                }
                if (distance <= this.coreRadius) {
                    // 核心区域填充
                    let curPos = new BlockPos(pos.x + x, pos.y + y, pos.z + z)
                    level.setBlock(curPos, this.coreBlock, 2)
                    continue
                }
                if (distance <= this.shellRadius - this.shellThickness) {
                    // 球壳内部空闲空间
                    this.decorator.runInnerDecorators(level, this, new BlockPos(x, y, z))
                    continue
                }
            }
        }
    }
    // 环填充
    this.ringProperties.forEach(ring => {
        for (let x = -ring.radius; x <= ring.radius; x++) {
            for (let z = -ring.radius; z <= ring.radius; z++) {
                let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2))
                if (distance <= ring.radius && distance >= ring.radius - ring.width) {
                    let curPos = new BlockPos(pos.x + x, pos.y, pos.z + z)
                    level.setBlock(curPos, ring.block, 2)
                    this.decorator.runRingDecorators(level, this, new BlockPos(x, 0, z))
                    continue
                }
            }
        }
    })
    return
}