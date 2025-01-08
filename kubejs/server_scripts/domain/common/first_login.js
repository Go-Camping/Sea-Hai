// priority: 900
PlayerEvents.loggedIn(event => {
    let player = event.player

    event.server.scheduleInTicks(5, (callback) => {
        if (player.persistentData.getInt('firstJoin') != 1) {
            // player.inventory.clear()
            player.persistentData.putInt('firstJoin', 1)
        }
    })
})