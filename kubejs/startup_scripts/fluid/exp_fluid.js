// priority: 900
StartupEvents.registry('fluid', event => {
    event.create('glutinous_lemon_juice_fluid')
        .color(0xF7EB8D)
        .temperature(100)
        .viscosity(1000)
        .density(2000)
        .flowingTexture('kubejs:fluid/glutinous_lemon_juice_fluid')
        .stillTexture('kubejs:fluid/glutinous_lemon_juice_fluid')
        
})