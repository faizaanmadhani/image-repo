import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Upload from './pages/Upload'
import Search from './pages/Search'

class App extends Component<{}, {}> {

  render() {

    return (
      <Router>
          <Switch>
            <Route exact path="/" component={Upload} />
            <Route exact path="/search" component={Search} />
          </Switch>
      </Router>
    )
  }

}

export default App;
