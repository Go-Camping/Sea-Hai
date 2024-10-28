// priority: 1000

const DUNGEON_DIM = new ResourceLocation('kubejs:dungeon')
const SIDE_LENGTH = 16 * 16
const MAX_X = SIDE_LENGTH * 50

// todo 生成岛屿
/**
 * @param {Internal.Level} level 
 */
function GenDungeonIslands(level) {
    let minecraftServer = level.getServer()
    let dungeonLevel = minecraftServer.getLevel(DUNGEON_DIM)
    let dungeonStructManager = dungeonLevel.getStructureManager()

    let dungeonNum = dungeonLevel.data.getOrDefault('dungeonNum', 0)
    dungeonLevel.data.put('dungeonNum', dungeonNum + 1)

    let buildX = dungeonNum * SIDE_LENGTH % MAX_X
    let buildZ = Math.floor(dungeonNum * SIDE_LENGTH / MAX_X) * SIDE_LENGTH

    let mainIslandId = 'todo'
    let mainIslandTemplate = dungeonStructManager.getOrCreate(new ResourceLocation(mainIslandId))
    let mainIslandSizeRang = new BlockPos(32, 64, 32)
    let mainIslandBuildPos = new BlockPos(buildX, 64, buildZ)

    let chunkX = Math.floor(blockPos.x / 16)
    let chunkZ = Math.floor(blockPos.z / 16)
    let chunkAccess = dungeonLevel.getChunk(chunkX, chunkZ, $ChunkStatus.FULL, true)
    if (!chunkAccess) return

    // 此处应提取方法
    let placementSettings = new $StructurePlaceSettings().setMirror($Mirror.NONE).setRotation($Rotation.NONE).setIgnoreEntities(false)
    mainIslandTemplate.placeInWorld(dungeonLevel, position, sizeRange ,placementSettings, dungeonLevel.getRandom(), 2)

    // 结构行为
    mainIslandTemplate.filterBlocks(position, placementSettings, Blocks.STRUCTURE_BLOCK).forEach(block => {
        if (block.nbt()) {

        }
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