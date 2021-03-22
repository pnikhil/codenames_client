import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'

import Join from './components/Join'
import Game from './components/Game'
import Footer from './components/Footer'
import './css/Button.css';
import NotFoundPage from "./components/NotFoundPage";

const App = () => {

  return (
      <Router basename={'/'}>
          <Switch>
        <Route path='/' exact component={Join} />
        <Route path='/channel/:channel' exact component={Game} />
          <Route path="*" component={NotFoundPage} />
              </Switch>
        <Footer />
      </Router>
  );

}
export default App;
