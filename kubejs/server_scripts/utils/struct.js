// priority: 1000

const DUNGEON_DIM = new ResourceLocation('kubejs:dungeon')

const ISLAND_SIDE_LENGTH = 32
const ISLAND_BUILD_INTERVAL = 512

const MAINISLAND_TEMPLATE_LIST = ['kubejs:test']
const SUBISLAND_TEMPLATE_LIST = []
const BUILDPOS_OFFSET = [
    new Vec3i(-ISLAND_SIDE_LENGTH, 0, ISLAND_SIDE_LENGTH),
    new Vec3i(ISLAND_SIDE_LENGTH, 0, ISLAND_SIDE_LENGTH),
    new Vec3i(ISLAND_SIDE_LENGTH, 0, -ISLAND_SIDE_LENGTH),
    new Vec3i(-ISLAND_SIDE_LENGTH, 0, -ISLAND_SIDE_LENGTH),
    new Vec3i(ISLAND_SIDE_LENGTH, 0, 0),
    new Vec3i(-ISLAND_SIDE_LENGTH, 0, 0),
    new Vec3i(0, 0, ISLAND_SIDE_LENGTH),
    new Vec3i(0, 0, -ISLAND_SIDE_LENGTH)]

// todo 生成
/**
 * @param {Internal.Level} level 
 */
function GenDungeonIslands(level) {
    let minecraftServer = level.getServer()
    let dungeonLevel = minecraftServer.getLevel(DUNGEON_DIM)
    let dungeonStructManager = dungeonLevel.getStructureManager()
    let dungeonNum = 0
    if (dungeonLevel.persistentData.contains('islandNum')) {
        dungeonNum = dungeonLevel.persistentData.getInt('islandNum')
    }
    
    console.log('Generate Dungeon Island', dungeonNum)
    let buildOffset = caculateStructureCenterPos(dungeonNum)
    let buildX = buildOffset.x * ISLAND_BUILD_INTERVAL
    let buildZ = buildOffset.z * ISLAND_BUILD_INTERVAL
    console.log('buildX:', buildX, 'buildZ:', buildZ)
    let mainIslandId = RandomGet(MAINISLAND_TEMPLATE_LIST)

    let mainIslandTemplate = dungeonStructManager.getOrCreate(new ResourceLocation(mainIslandId))
    let mainIslandSizeRange = ConvertVec3i2BlockPos(mainIslandTemplate.getSize())
    let mainIslandBuildPos = new BlockPos(buildX, 0, buildZ)

    let chunkX = Math.floor(mainIslandBuildPos.x / 16)
    let chunkZ = Math.floor(mainIslandBuildPos.z / 16)
    let chunkAccess = dungeonLevel.getChunk(chunkX, chunkZ, $ChunkStatus.FULL, true)
    if (!chunkAccess) return

    // 主岛
    let placementSettings = new $StructurePlaceSettings().setMirror($Mirror.NONE).setRotation($Rotation.NONE).setIgnoreEntities(false)
    mainIslandTemplate.placeInWorld(dungeonLevel, mainIslandBuildPos, mainIslandSizeRange, placementSettings, dungeonLevel.getRandom(), 2)
    HandleDataBlock(mainIslandTemplate, mainIslandBuildPos, placementSettings)
    // 副岛
    let subIslandTemplateList = RandomGetN(SUBISLAND_TEMPLATE_LIST, 8)
    for (let i = 0; i < 8; i++) {
        if (Math.random() < 0.7) return
        let subIslandTemplate = dungeonStructManager.getOrCreate(new ResourceLocation(subIslandTemplateList[i]))
        let subIslandSizeRange = ConvertVec3i2BlockPos(subIslandTemplate.getSize())
        let subIslandBuildPos = new BlockPos(buildX, 64, buildZ).offset(BUILDPOS_OFFSET[i])
        let subIslandPlacementSettings = new $StructurePlaceSettings().setMirror($Mirror.NONE).setRotation($Rotation.NONE).setIgnoreEntities(false)
        subIslandTemplate.placeInWorld(dungeonLevel, subIslandBuildPos, subIslandSizeRange, subIslandPlacementSettings, dungeonLevel.getRandom(), 2)
        HandleDataBlock(subIslandTemplate)
    }

    dungeonLevel.persistentData.putInt('islandNum', dungeonNum + 1)
}

/**
 * @param {Vec3i} vec3i 
 * @returns {BlockPos}
 */
function ConvertVec3i2BlockPos(vec3i) {
    return new BlockPos(vec3i.x, vec3i.y, vec3i.z)
}


/**
 * @param {Internal.StructureTemplate} template 
 * @param {BlockPos} position
 * @param {Internal.StructurePlaceSettings} placementSettings
 */
function HandleDataBlock(template, position, placementSettings) {
    // 结构行为
    template.filterBlocks(position, placementSettings, Blocks.STRUCTURE_BLOCK).forEach(block => {
        if (block.nbt()) {
            let structureMode = $StructureMode.valueOf(block.nbt().getString('mode'))
            if (structureMode == $StructureMode.DATA) {

            }
        }
        return
    })
}


/**
 * 在某区块
 * @param {Internal.ServerLevel} level 
 * @param {Internal.ChunkAccess} chunkAccess
 * @param {string} biomeName
 */
function SetBiomeByChunk(level, chunkAccess, biomeName) {
    let levelBiomeRegistryOpt = level.registryAccess().registry($Registries.BIOME)
    if (!levelBiomeRegistryOpt.isPresent()) return
    
    let biomeHolderOpt = levelBiomeRegistryOpt.get().getHolder($ResourceKey.create($Registries.BIOME, new ResourceLocation(biomeName)))
    if (!biomeHolderOpt.isPresent()) return
    let biomeHolder = biomeHolderOpt.get()

    chunkAccess.getSections().forEach(section => {
        let biomes = section.getBiomes()
        if (biomes instanceof $PalettedContainer) {
            let biomeId = biomes.data.palette().idFor(biomeHolder)
            let size = biomes.data.storage().getSize()
            let i = 0
            while (i <= (size - 1)) {
                biomes.data.storage().set(i, biomeId)
                i++
            }
        }
    })
    chunkAccess.setUnsaved(true)
}


const X_SIDE_MODIFIER = [0, -1, 0, 1]
const Z_SIDE_MODIFIER = [1, 0, -1, 0]
const X_POINT_MODIFIER = [1, 1, -1, -1]
const Z_POINT_MODIFIER = [-1, 1, 1, -1]
/**
 * 
 * @param {number} n 
 * @returns {{x: number, z: number}}
 */
function caculateStructureCenterPos(n) {
    if (n == 0) return {x: 0, z: 0}
    let rad = Math.floor((Math.pow(n, 1 / 2) + 1) / 2)

    let perimeter = 8 * rad
    let sideLength = 2 * rad + 1
    let left = perimeter - Math.pow(sideLength, 2) + n

    let sideNum = Math.floor(left / sideLength)
    let moveNum = left % sideLength
    let x = rad * X_POINT_MODIFIER[sideNum] + X_SIDE_MODIFIER[sideNum] * moveNum
    let z = rad * Z_POINT_MODIFIER[sideNum] + Z_SIDE_MODIFIER[sideNum] * moveNum
    return {x: x, z: z}
}