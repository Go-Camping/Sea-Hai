// priority: 1000
ServerEvents.tags('fluid', event => {
    event.add('kubejs:ceramics_hook_fluid', [
        'tconstruct:molten_amethyst_bronze',
        'tconstruct:molten_slimesteel',
        'tconstruct:molten_debris',
        'tconstruct:molten_diamond',
        'tconstruct:molten_quartz',
        'tconstruct:molten_emerald',
        'tconstruct:molten_ender',
        'tconstruct:molten_netherite',
        'tconstruct:molten_amethyst',
        'tconstruct:molten_copper',
        'tconstruct:molten_iron',
        'tconstruct:molten_gold',
        'tconstruct:molten_cobalt',
        'tconstruct:molten_pig_iron',
        'tconstruct:molten_manyullyn',
        'tconstruct:molten_hepatizon',
        'tconstruct:molten_bronze',
        'tconstruct:molten_tin',
        'tconstruct:molten_rose_gold',
        'tconstruct:magma',
        'tconstruct:molten_clay',
        'tconstruct:scorched_stone',
        'tconstruct:seared_stone',
        'tconstruct:molten_glass',
    ])

    event.add('kubejs:oil_hook_fluid', ['forestry:seed_oil'])

    event.add('kubejs:lava_hook_fluid', ['minecraft:lava'])

    event.add('kubejs:bread_hook_fluid', [
        'tconstruct:honey',
        'tconstruct:mushroom_stew',
        'tconstruct:rabbit_stew',
        'tconstruct:meat_soup',
        'tconstruct:beetroot_soup',
        'kubejs:glutinous_lemon_juice_fluid',
    ])

    event.add('kubejs:silme_hook_fluid', [
        'tconstruct:venom',
        'tconstruct:earth_slime',
        'tconstruct:sky_slime',
        'tconstruct:molten_queens_slime',
        'tconstruct:ender_slime',
    ])
    
    event.add('kubejs:blood_hook_fluid', [
        'tconstruct:liquid_soul',
        'tconstruct:blazing_blood',
    ])


    event.remove('minecraft:water', ['hotbath:honey_bath_fluid', 'hotbath:herbal_bath_fluid', 'hotbath:hot_water_fluid', 'hotbath:milk_bath_fluid', 'hotbath:peony_bath_fluid'])
})
