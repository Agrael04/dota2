import * as React from 'react'

import HeroChart from './hero-chart'
import HeroInfo from './hero-info'
import LeftBar from './left-bar'

import LocalStore from './store'
const styles = require('./style.scss')

class Page extends React.Component<any, any>{
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.teams.fetch()
    this.props.players.fetch()
    this.props.heroes.fetch()
    this.props.fetchMatches()

    this.props.store.setLocalStore(LocalStore, this.props.match.params.id)
  }

  render() {
    const { team } = this.props
    return (
      team
      ? <div className={styles.page}>
          <LeftBar {...this.props}/>
          <div className={styles.centralContent}>
            <h1 className={styles.centralTitle}>{team.name}({team.winRate}%)</h1>
            { this.props.store.localStore && <HeroChart/> }
            { this.props.store.localStore && <HeroInfo/> }
          </div>
          <div className={styles.rightBar}>
          </div>
      </div>
      : null
    )
  }
}

export default Page