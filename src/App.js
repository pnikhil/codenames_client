import React, {useEffect} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
//import { HashRouter as Router } from 'react-router-dom'
import Join from './components/Join'
import Game from './components/Game'
import './css/App.css';
import './css/Button.css';

const App = () => {

  return (

      useEffect(() => {
          document.title = 'Codenames'
      }, []),

      <Router basename={'/'}>
        <Route path='/' exact component={Join} />
        <Route path='/play/:channel' component={Game} />
      </Router>
  );

}

export default App;
