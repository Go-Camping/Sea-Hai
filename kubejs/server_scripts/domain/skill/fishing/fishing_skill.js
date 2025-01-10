// priority: 800

/**
 * @type {Object<string, function(Internal.MiniGameStartJS): void>}
 */
const FishingMiniGameStartSkill = {
    'yxtohohyspzl8hov': (event) => {
        let behavior = event.getFishBehavior()
        behavior.setBobberHeight(Math.ceil(behavior.getBobberHeight() * 1.15))
    },
    'v1g7c9iyq6rrs0dj': (event) => {
        let behavior = event.getFishBehavior()
    },

}


