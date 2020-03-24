import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Start } from '../Start/Start';
// import { Button } from '../Button/Button';
// import { Input } from '../Input/Input';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={Start} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
