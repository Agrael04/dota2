// import Hero from './hero'
// import Team from './team'

export default class Pick{
  isPick: boolean
  order: number
  hero: number
  team: number

  constructor(pick, dire, radiant) {
    this.isPick = pick.is_pick,
    this.order = pick.order,
    this.hero = pick.hero_id,
    this.team = (pick.team) ? dire : radiant
  }
}