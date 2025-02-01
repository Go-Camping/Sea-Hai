// priority: 900
StartupEvents.registry('block', event => {
    event.create('kubejs:menu_workbench', 'custommachinery')
        .machine('kubejs:menu_workbench')
    event.create('kubejs:planet_workbench', 'custommachinery')
        .machine('kubejs:planet_workbench')
})