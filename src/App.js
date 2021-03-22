import React, {useEffect} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import Join from './components/Join'
import Game from './components/Game'
import Footer from './components/Footer'
import './css/Button.css';

const App = () => {

  return (

      useEffect(() => {
          document.title = 'Codenames - Play Multiplayer Game Online'
      }, []),

      <Router basename={'/'}>
        <Route path='/' exact component={Join} />
        <Route path='/play/:channel' component={Game} />
        <Footer />
      </Router>
  );

}
export default App;
