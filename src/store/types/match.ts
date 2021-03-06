import { observable, computed, createTransformer } from 'mobx'

import PickBan from './pick'
import Draft from './draft'

class _Match {
  id: number
  duration: Date
  onsetTime: Date

  league: League

  direScore: number
  radiantScore: number

  direTeam: Team
  radiantTeam: Team

  winnerTeam: Team

  // @observable firstbloodTime: number

  // @observable radiantGoldAdv: Array<number>
  // @observable radiantExpAdv: Array<number>

  @observable picksbans: Array<PickBan>
  @observable players: any
  // @observable teamfights: any

  @observable withExtra: boolean

  @computed get radiantPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get radiantBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.radiantTeam.id)
    else
      return []
  }

  @computed get direPicks() {
    if (this.picksbans)
      return this.picksbans.filter(item => item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  @computed get direBans() {
    if (this.picksbans)
      return this.picksbans.filter(item => !item.isPick && item.team.id == this.direTeam.id)
    else
      return []
  }

  constructor(match, getLeague: (number) => League, getTeam: (number) => Team) {
    // console.log(getTeam(match.dire_team_id))
    this.id = match.match_id
    this.duration = new Date(match.duration * 1000 - 10800000)
    this.onsetTime = new Date(match.start_time * 1000)

    this.league = getLeague(match.leagueid)

    this.direScore = match.dire_score
    this.radiantScore = match.radiant_score

    this.direTeam = getTeam(match.dire_team_id)
    this.radiantTeam = getTeam(match.radiant_team_id)

    this.winnerTeam = match.radiant_win ? this.radiantTeam : this.direTeam

    // this.firstbloodTime = null

    // this.radiantGoldAdv = null
    // this.radiantExpAdv = null

    this.picksbans = null
    this.players = null
    // this.teamfights = null

    this.withExtra = false

  }

  teamPicks = createTransformer((team: Team) => {
    return this.radiantTeam == team ? this.radiantPicks : this.direPicks
  })

  teamDraft = createTransformer((team: Team) => {
    return new Draft(this.teamPicks(team), this.id, this.winnerTeam == team, team)
  })

  didHeroWin = createTransformer((hero: Hero) => {
    const PickBan = this.direPicks.find(PickBan => PickBan.hero.id == hero.id) || this.radiantPicks.find(PickBan => PickBan.hero.id == hero.id)
    if (PickBan)
      return this.winnerTeam.id == PickBan.team.id
    else
      return null
  })
}

declare global {
  class Match extends _Match { }
}

export default _Match