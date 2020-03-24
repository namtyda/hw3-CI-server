import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Start } from '../Start/Start';
import { Settings } from '../Settings/Settings';
// import { Button } from '../Button/Button';
// import { Input } from '../Input/Input';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={Start} />
          <Route path='/settings' exact component={Settings} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
