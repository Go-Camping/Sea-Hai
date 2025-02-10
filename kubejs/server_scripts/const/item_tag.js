// priority: 1000
const AllowQualityTag = 'kubejs:allow_quality'
const AquaticProductsSaleTag = 'kubejs:aquatic_products'
ServerEvents.tags('item', event => {
    event.add('stardew_fishing:starts_minigame', [
        'lavafishing:quartz_fish',
        'lavafishing:agni_fish',
        'lavafishing:steam_flying_fish',
        'lavafishing:lava_lamprey',
        'lavafishing:scaly_foot_snail',
        'lavafishing:yeti_crab',
        'lavafishing:arowana_fish',
        'lavafishing:obsidian_sword_fish',
        'lavafishing:flame_squat_lobster',
    ])

    event.add('aquaculture:fishing_line', [
        'kubejs:newer_fishing_line',
        'kubejs:hard_fishing_line',
        'kubejs:iron_fishing_line',
        'kubejs:golden_fishing_line',
        'kubejs:glowing_fishing_line',
        'kubejs:lucky_fishing_line',
        'kubejs:echo_fishing_line',
        'kubejs:ender_fishing_line',
    ])

    event.add('aquaculture:bobber', [
        'kubejs:newer_bobber',
        'kubejs:octopus_bobber',
        'kubejs:duck_bobber',
        'kubejs:iron_bobber',
        'kubejs:golden_bobber',
        'kubejs:ball_bobber',
        'kubejs:dish_bobber',
        'kubejs:feather_bobber',
        'kubejs:pants_bobber',
    ])

    event.add('kubejs:crab_bait', [
        '#forge:seeds'
    ])
})