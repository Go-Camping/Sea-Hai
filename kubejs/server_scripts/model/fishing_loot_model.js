// priority: 900


/**
 * 自定义结构的鱼类战利品表
 * @param {Internal.ItemStack} item 
 * @returns 
 */
function CustomFishingLootModel(item, weight) {
    this.item = item
    this.weight = weight
    this.fluid = {}
    this.biome = {}
    this.weather = {}
    /**@type {function(number, number)} */
    this.timeRange = null
    /**@type {function(number, number)} */
    this.playerFunc = null
}

CustomFishingLootModel.prototype = {
    /**
     * 流体类型对于战利品的权重影响
     * @param {string} fluidType 
     * @param {number} modifier 
     * @returns 
     */
    withFluidModifier: function (fluidType, modifier) {
        this.fluid[fluidType] = modifier
        return this
    },
    /**
     * 生态群系对于战利品的权重影响
     * @param {string} biomeType 
     * @param {number} modifier 
     * @returns 
     */
    withBiomeModifier: function (biomeType, modifier) {
        this.biome[biomeType] = modifier
        return this
    },
    /**
     * 天气类型对于战利品的权重影响
     * @param {string} weatherType 
     * @param {number} modifier 
     * @returns 
     */
    withWeatherModifier: function (weatherType, modifier) {
        this.weather[weatherType] = modifier
        return this
    },
    /**
     * 时间对于战利品的影响
     * @param {string} timeType 
     * @param {function(number, number): number} modifier 
     * @returns 
     */
    withTimeRangeModifier: function (modifier) {
        this.timeRange = modifier
        return this
    },
    /**
     * 自定义战利品影响
     * @param {function(Internal.ServerPlayer, number): number} modifier 
     * @returns 
     */
    withPlayerModifier: function (modifier) {
        this.playerFunc = modifier
        return this
    },
}