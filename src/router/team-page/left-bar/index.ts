import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router'
import { compose, mapProps } from 'recompose'

import Component from './component'

export default compose(
  inject('store'),
  withRouter,
  observer,
  mapProps(
    ({ store, history, team }) => ({
      loading: store.dataStore.loadingMatches,
      matchesLength: store.localStore.filteredMatches.length,
      fetchMatches: () => store.dataStore.loadMatchesWithExtras(5, false, { team: store.localStore.team }),
      teams: store.dataStore.teams
        .sort((a, b) => b.rating - a.rating)
        .filter((item, key) => key < 100),
      team,
      chooseTeam: (team) => {
        store.localStore.setTeam(team.id)
        history.push(`/teams/${team.id}`)
      }
    })
  ),
  observer
)(Component)