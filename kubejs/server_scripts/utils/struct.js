// priority: 1000

const DUNGEON_DIM = new ResourceLocation('kubejs:dungeon')
const SIDE_LENGTH = 512
const MAX_X = SIDE_LENGTH * 50
const ISLAND_SIDE_LENGTH = 32

const MAINISLAND_TEMPLATE_LIST = []
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
    let dungeonNum = dungeonLevel.data.getOrDefault('islandNum', 0)
    
    let buildX = dungeonNum * SIDE_LENGTH % MAX_X
    let buildZ = Math.floor(dungeonNum * SIDE_LENGTH / MAX_X) * SIDE_LENGTH

    let mainIslandId = RandomGet(MAINISLAND_TEMPLATE_LIST)
    
    let mainIslandTemplate = dungeonStructManager.getOrCreate(new ResourceLocation(mainIslandId))
    let mainIslandSizeRang = new BlockPos(32, 64, 32)
    let mainIslandBuildPos = new BlockPos(buildX, 64, buildZ)

    let chunkX = Math.floor(blockPos.x / 16)
    let chunkZ = Math.floor(blockPos.z / 16)
    let chunkAccess = dungeonLevel.getChunk(chunkX, chunkZ, $ChunkStatus.FULL, true)
    if (!chunkAccess) return

    // 主岛
    let placementSettings = new $StructurePlaceSettings().setMirror($Mirror.NONE).setRotation($Rotation.NONE).setIgnoreEntities(false)
    mainIslandTemplate.placeInWorld(dungeonLevel, mainIslandBuildPos, mainIslandSizeRang ,placementSettings, dungeonLevel.getRandom(), 2)
    HandleDataBlock(mainIslandTemplate)
    // 副岛
    let subIslandTemplateList = RandomGetN(SUBISLAND_TEMPLATE_LIST, 8)
    for (let i = 0; i < 8; i++) {
        if (Math.random() < 0.7) return
        let subIslandTemplate = dungeonStructManager.getOrCreate(new ResourceLocation(subIslandTemplateList[i]))
        let subIslandSizeRang = new BlockPos(32, 64, 32)
        let subIslandBuildPos = new BlockPos(buildX, 64, buildZ).offset(BUILDPOS_OFFSET[i])
        let subIslandPlacementSettings = new $StructurePlaceSettings().setMirror($Mirror.NONE).setRotation($Rotation.NONE).setIgnoreEntities(false)
        subIslandTemplate.placeInWorld(dungeonLevel, subIslandBuildPos, subIslandSizeRang, subIslandPlacementSettings, dungeonLevel.getRandom(), 2)
        HandleDataBlock(subIslandTemplate)
    }

    dungeonLevel.data.put('islandNum', dungeonNum + 1)
}

/**
 * @param {Internal.StructureTemplate} template 
 */
function HandleDataBlock(template) {
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
 */
function SetChunkBiomeAtBlockPos(level, chunkAccess, biomeName) {
    let levelBiomeRegistryOpt = level.registryAccess().registry(Registry.WorldgenBiome)
    if (!levelBiomeRegistryOpt.isPresent()) return
    let biomeHolderOpt = levelBiomeRegistryOpt.get().getHolder(biomeName)
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