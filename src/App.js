import React, {useEffect} from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import Join from './components/Join'
import Game from './components/Game'
import './css/App.css';
import './css/Button.css';

const App = () => {

  return (

      useEffect(() => {
          document.title = 'Codenames'
      }, []),

      <HashRouter basename={'/'}>
        <Route path='/' exact component={Join} />
        <Route path='/play/:channel' component={Game} />
      </HashRouter>
  );

}

export default App;
