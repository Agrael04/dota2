import * as React from 'react'
import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools'
// import Loadable from 'react-loadable'

const styles = require('./style.less')

import Header from 'components/others/header'
// import loading from 'components/others/loader'

import Home from 'components/pages/home-page'
import Team from 'router/team-page'
import Teams from 'router/teams-page'
// const Home = Loadable({
//   loader: () => import('components/pages/home-page'),
//   loading
// })

export default ({ store }) => (
  <Provider {...store} store={store}>
    <Router history={createBrowserHistory()}>
      <div>
        <Header/>
        <div className={styles.page}>
          <div className={styles.wrapper}>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/teams/:id' component={Team}/>
              <Route path='/teams' component={Teams}/>
            </Switch>
          </div>
        </div>
        <DevTools />
      </div>
    </Router>
  </Provider>
)