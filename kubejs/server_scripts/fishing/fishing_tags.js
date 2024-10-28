ServerEvents.tags('item', event => {
    event.add('aquaculture:fishing_line', ['kubejs:newer_fishing_line'])

    event.add('aquaculture:bobber', ['kubejs:newer_bobber', 'kubejs:duck_bobber'])
})