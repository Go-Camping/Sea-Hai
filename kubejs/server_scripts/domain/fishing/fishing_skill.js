// priority: 550
/**
 * 技能的接入按照两个模式：松散和策略
 * 如果一个位置只应用了单个技能，那么只需要松散的放在对应位置即可
 * 如果一个位置应用了多个（超过4个）技能，那么需要使用策略查找
 */
const MiniGameEndSkillMap = {
    'u6ha8lmyutfg2qxs': () => {

    }
}

// const skillModel = new PufferskillModel(player)
// const fishingCategory = skillModel.getSkillCategory('fishing')
// Object.keys(MiniGameEndSkillMap).forEach(key => {
//     let skillState = skillModel.getSkillState(fishingCategory, key)
// })