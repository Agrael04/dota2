import { observable, action, createTransformer } from 'mobx'
import api from 'api'

import Hero from './types/hero'
import League from './types/league'
import Match from './types/match'
import Player from './types/player'
import Team from './types/team'

class Store {
  @observable heroes: Array<Hero> = []
  @observable leagues: Array<League> = []
  @observable players: Array<Player> = []
  @observable teams: Array<Team> = []

  @observable matches: Array<Match> = []
  @observable loadingMatches: boolean = false

  @action async loadHeroes () {
    const res = !this.heroes.length ? await api.fetchHeroes() : []
    this.heroes.push(...res.map(item => new Hero(item)))
  }

  @action async loadLeagues () {
    const res = !this.leagues.length ? await api.fetchLeagues() : []
    this.leagues.push(...res.map(item => new League(item)))
  }

  @action async loadPlayers () {
    const res = !this.players.length ? await api.fetchPlayers() : []
    this.players.push(...res.map(item => new Player(item)))
  }

  @action async loadTeams () {
    const res = !this.teams.length ? await api.fetchTeams() : []
    this.teams.push(...res.map(item => new Team(item)))
  }

  @action async loadMatchesWithExtras (count: number = 5, fromStart: boolean = true, filters: object = {}) {
    await this.loadMatches(count, fromStart)
    const ids = this.getMatches(filters).map(match => match.id)
    this.loadMatchesExtra(ids)
  }

  @action async loadMatches (count: number = 5, fromStart: boolean = true) {
    const matchesCount = this.matches.length
    const resCount = fromStart ? count - matchesCount / 100 : count
    this.loadingMatches = false

    let res = []
    for (let i = 0; i < resCount; i++) {
      let tempRes = await api.fetchProMatches(
        res.length > 0
          ? res[res.length - 1].match_id
          : matchesCount > 0
            ? this.matches[matchesCount - 1].id
            : undefined
      )
      res = [...res, ...tempRes]
    }

    this.matches.push(...res.map(match => new Match(match)))
    this.loadingMatches = true
  }

  @action async loadMatchExtra (id: number) {
    const matches = this.matches.filter((item) => item.id == id && !item.withExtra)
    matches.map(async(match) => {
      const res = await api.fetchMatchInfo(match.id)
      match.loadExtra(res)
    })
  }

  @action async loadMatchesExtra (ids: Array<number>) {
    const matches = this.matches.filter((item) => ids.includes(item.id) && !item.withExtra)
    matches.map(async(match) => {
      const res = await api.fetchMatchInfo(match.id)
      match.loadExtra(res)
    })
  }

  getHero = createTransformer((id: number): Hero => {
    return this.heroes.find(item => item.id == id)
  })

  getLeague = createTransformer((id: number): League => {
    return this.leagues.find(item => item.id == id)
  })

  getPlayer = createTransformer((id: number): Player => {
    return this.players.find(item => item.id == id)
  })

  getTeam = createTransformer((id: number): Team => {
    return this.teams.find(item => item.id == id)
  })

  getMatches = createTransformer((filters: any): Array<Match> => {
    const { loaded, league, team, side, rival, duration, matches, heroes } = filters
    let data = this.matches

    if (league) data = data.filter(item => item.leagueId == league)

    if (team) {
      if (side) data = data.filter(item => item[side] == team)
      else data = data.filter(item => item.radiantTeam == team || item.direTeam == team)

      if (rival) data = data.filter(item => item.radiantTeam == rival || item.direTeam == rival)
    }

    if (duration) data = data.filter(item => item.duration >= duration.min && item.duration < duration.max)

    if (matches) data = data.filter(match => matches.reduce((res, item) => res || match.id == item, false))

    if (loaded) {
      data = data.filter(item => item.withExtra == loaded)

      if (heroes) {
        data = data.filter(match => {
          const werePickedByRadiant = heroes.reduce(
            (result, hero) => result && match.radiantPicks.reduce((a, b) => a || b.hero == hero, false),
            true
          )
          const werePickedByDire = heroes.reduce(
            (result, hero) => result && match.direPicks.reduce((a, b) => a || b.hero == hero, false),
            true
          )

          if (team) return match.radiantTeam == team ? werePickedByRadiant : werePickedByDire

          return werePickedByRadiant || werePickedByDire
        })
      }
    }

    return data
  })
}

export default Store