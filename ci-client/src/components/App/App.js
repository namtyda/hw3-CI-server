import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Start } from '../Start/Start';
import { Settings } from '../Settings/Settings';
import { History } from '../History/History';
import { Details } from '../Details/Details';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={Start} />
          <Route path='/settings' exact component={Settings} />
          <Route path='/history' exact component={History} />
          <Route path='/build/:id' component={Details} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
