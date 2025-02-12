// priority: 802
/**
 * @constant
 * @type {Record<string, ContainerPropertyModel>}
 */
const ContainerProperty = {}

/**
 * 
 * @param {string} id 
 * @param {Record<string, any>} properties 
 */
function RegistryContainerProperty(id, properties) {
    ContainerProperty[id] = properties
}

function ContainerPropertyModel() {
    this.validDecorationAmount = 0
}

ContainerPropertyModel.prototype = {
    withValidDecorationAmount: function (amount) {
        this.validDecorationAmount = amount
        return this
    }
}




// 物品展示框类
const ItemFrameBlock = ['tconstruct:clear_item_frame', 'minecraft:glow_item_frame', 'minecraft:item_frame', 'tconstruct:netherite_item_frame', 'tconstruct:gold_item_frame', 'tconstruct:manyullyn_item_frame', 'tconstruct:diamond_item_frame', 'tconstruct:reversed_gold_item_frame']

ItemFrameBlock.forEach(element => {
    RegistryContainerProperty(element, new ContainerPropertyModel().withValidDecorationAmount(5))
})

// 罐子类
const JarBlock = ['refurbished_furniture:warped_storage_jar', 'refurbished_furniture:oak_storage_jar', 'refurbished_furniture:spruce_storage_jar', 'refurbished_furniture:birch_storage_jar', 'refurbished_furniture:jungle_storage_jar', 'refurbished_furniture:acacia_storage_jar', 'refurbished_furniture:dark_oak_storage_jar', 'refurbished_furniture:mangrove_storage_jar', 'refurbished_furniture:cherry_storage_jar', 'supplementaries:jar', 'refurbished_furniture:crimson_storage_jar']
JarBlock.forEach(element => {
    RegistryContainerProperty(element, new ContainerPropertyModel().withValidDecorationAmount(3))
})

// 展示台类
RegistryContainerProperty('supplementaries:pedestal', new ContainerPropertyModel().withValidDecorationAmount(3))

// 售货机
const VendingMachineBlock = ['lightmanscurrency:vending_machine', 'lightmanscurrency:vending_machine_light_gray', 'lightmanscurrency:vending_machine_gray', 'lightmanscurrency:vending_machine_black', 'lightmanscurrency:vending_machine_brown', 'lightmanscurrency:vending_machine_red', 'lightmanscurrency:vending_machine_orange', 'lightmanscurrency:vending_machine_cyan', 'lightmanscurrency:vending_machine_light_blue', 'lightmanscurrency:vending_machine_blue', 'lightmanscurrency:vending_machine_purple', 'lightmanscurrency:vending_machine_yellow', 'lightmanscurrency:vending_machine_green', 'lightmanscurrency:vending_machine_lime', 'lightmanscurrency:vending_machine_magenta', 'lightmanscurrency:vending_machine_pink']
VendingMachineBlock.forEach(element => {
    RegistryContainerProperty(element, new ContainerPropertyModel().withValidDecorationAmount(3)) 
})


const VendingMachineLargeBlock = ['lightmanscurrency:vending_machine_large', 'lightmanscurrency:vending_machine_large_light_gray', 'lightmanscurrency:vending_machine_large_gray', 'lightmanscurrency:vending_machine_large_magenta', 'lightmanscurrency:vending_machine_large_black', 'lightmanscurrency:vending_machine_large_orange', 'lightmanscurrency:vending_machine_large_lime', 'lightmanscurrency:vending_machine_large_cyan', 'lightmanscurrency:vending_machine_large_blue', 'lightmanscurrency:vending_machine_large_purple', 'lightmanscurrency:vending_machine_large_pink', 'lightmanscurrency:vending_machine_large_brown', 'lightmanscurrency:vending_machine_large_red', 'lightmanscurrency:vending_machine_large_green', 'lightmanscurrency:vending_machine_large_yellow', 'lightmanscurrency:vending_machine_large_light_blue']
VendingMachineLargeBlock.forEach(element => {
    RegistryContainerProperty(element, new ContainerPropertyModel().withValidDecorationAmount(3)) 
})