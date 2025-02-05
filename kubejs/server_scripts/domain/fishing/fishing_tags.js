ServerEvents.tags('item', event => {
    event.add('stardew_fishing:starts_minigame', ['lavafishing:quartz_fish', 'lavafishing:agni_fish', 'lavafishing:steam_flying_fish', 'lavafishing:lava_lamprey', 'lavafishing:scaly_foot_snail', 'lavafishing:yeti_crab', 'lavafishing:arowana_fish', 'lavafishing:obsidian_sword_fish', 'lavafishing:flame_squat_lobster'])

    event.add('aquaculture:fishing_line', [
        'kubejs:hard_fishing_line'
    ])

    event.add('aquaculture:bobber', [
        'kubejs:octopus_bobber',
        'kubejs:duck_bobber',
        'kubejs:iron_bobber',
        'kubejs:golden_bobber',
        'kubejs:ball_bobber',
        'kubejs:dish_bobber',
        'kubejs:feather_bobber',
    ])

    event.add('kubejs:fishing_scorable', [
        '#stardew_fishing:starts_minigame'
    ])

    event.add('kubejs:crab_bait', [
        '#forge:seeds'
    ])
})