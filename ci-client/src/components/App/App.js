import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import './App.scss';
import { StartConnect } from '../Start/Start';
import { Settings } from '../Settings/Settings';
import { HistoryConnect } from '../History/History';
import { Details } from '../Details/Details';


function App() {
  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <Switch>
            <Route path='/' exact component={StartConnect} />
            <Route path='/settings' exact component={Settings} />
            <Route path='/history' exact component={HistoryConnect} />
            <Route path='/build/:id' component={Details} />
          </Switch>
        </div>
      </Provider>
    </Router>
  );
}

export default  App;
