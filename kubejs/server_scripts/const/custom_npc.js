// priority: 1000

const LINE_INTERACT = 0
const LINE_ATTACK = 1
const LINE_LEVEL = 2
const LINE_KILLED = 3
const LINE_KILL = 4
const LINE_NPC_INTERACT = 5

const NAME_VISIBLE = 0
const NAME_INVISIBLE = 1
const NAME_ATTACKING_VISIBLE = 2


const ANIMATION_NONE = 0
const ANIMATION_SIT = 1
const ANIMATION_SLEEP = 2
const ANIMATION_HUG = 3
const ANIMATION_CROUCH = 4
const ANIMATION_DANCE = 5
const ANIMATION_AIM = 6
const ANIMATION_CRAWL = 7
const ANIMATION_POINT = 8
const ANIMATION_CRY = 9
const ANIMATION_WAVE = 10
const ANIMATION_BOW = 11
const ANIMATION_NO = 12
const ANIMATION_YES = 13
const ANIMATION_DEATH = 14
const ANIMATION_WALK = 15
const ANIMATION_IDLE = 16
const ANIMATION_FLY = 17
const ANIMATION_FLY_IDLE = 18
const ANIMATION_STATIC = 19
const ANIMATION_SWIM = 20
const ANIMATION_WAG = 21


const NPC_LINE_THANKS = 'thanks'
const NPC_LINE_SORRY = 'sorry'
const NPC_LINE_SATISFIED = 'satisfied'
const NPC_LINE_TERRIBLE = 'terrible'
const NPC_LINE_FLYER_SORRY = 'flyer_sorry'
const NPC_LINE_FLYER_SATISFIED = 'flyer_satisfied'
const NPC_SURROUNDING_LINE_MAP = {
    'thanks': ['npcline.kubejs.thanks.1'],
    'sorry': ['npcline.kubejs.sorry.1'],
    'satisfied': ['npcline.kubejs.satisfied.1'],
    'terrible': ['npcline.kubejs.terrible.1'],
    'flyer_sorry': ['npcline.kubejs.flyer.sorry.1', 'npcline.kubejs.flyer.sorry.2'],
    'flyer_satisfied': ['npcline.kubejs.flyer.satisfied.1', 'npcline.kubejs.flyer.satisfied.2'],
}