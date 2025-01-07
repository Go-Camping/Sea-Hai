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

function RingProperty(block, radius, width, polarAngle, amzimuthAngle) {
    this.block = block
    this.radius = radius
    this.width = width
    this.polarAngle = polarAngle
    this.amzimuthAngle = amzimuthAngle
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
 * @param {number} polarAngle
 * @param {number} amzimuthAngle
 * @returns
 */
RingSphereModel.prototype.addRingProperties = function (block, radius, width, polarAngle, amzimuthAngle) {
    this.ringProperties.push(new RingProperty(block, radius, width, polarAngle, amzimuthAngle))
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
        let polarAngleTan = Math.tan(ring.polarAngle)
        let azimuthAngleTan = Math.tan(ring.amzimuthAngle)
        let azimuthAngleTanSquare = Math.pow(azimuthAngleTan, 2)
        for (let x = -ring.radius; x <= ring.radius; x++) {
            for (let z = -ring.radius; z <= ring.radius; z++) {
                /**
                 * 设想一个最简单的情况，如果这是一个圆环，他的俯仰角为angle，这个圆环完全经过x轴（平行于x轴）
                 * 那么他的任意一个点(x, y, z)存在一个关系，即：y = z * tan(angle)
                 * 所以这个圆环任一点的坐标可以表达为：(x, z * tan(angle), z)，其中 x ^ 2 + z ^ 2 * (1 + tan(angle) ^ 2) = r ^ 2
                 * 基于此，考虑一个复杂情况，即圆环不经过x轴，存在一个水平的偏移角azimuthAngle
                 * 那么这个圆环对于x-z面切线的方程为：z = x * tan(azimuthAngle)
                 * 则x-z面上任意一点(x, z)到这个切线的距离为 distance = (x * tan(azimuthAngle) - z) / (1 + tan(azimuthAngle) ^ 2) ^ 0.5
                 * 那么y的坐标为 y = distance * tan(angle) 
                 * 即有 (x * tan(azimuthAngle) - z) ^ 2 / (1 + tan(azimuthAngle) ^ 2) * tan(angle) ^ 2 + x ^ 2 + z ^ 2 = r ^ 2
                 */
                let xyDistanceSquare = Math.pow(x, 2) + Math.pow(z, 2)
                let ySquare = Math.pow(x * azimuthAngleTan - z, 2) / (1 + azimuthAngleTanSquare) * Math.pow(polarAngleTan, 2)
                let rSquare = ySquare + xyDistanceSquare
                if (rSquare <= Math.pow(ring.radius, 2) && rSquare >= Math.pow(ring.radius - ring.width, 2)) {
                    let y = Math.sqrt(ySquare)
                    let curPos = new BlockPos(pos.x + x, pos.y + y, pos.z + z)
                    level.setBlock(curPos, ring.block, 2)
                    this.decorator.runRingDecorators(level, this, new BlockPos(x, y, z))
                    continue
                }
                
            }
        }
    })
    return
}