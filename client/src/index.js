import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import './index.css';
import App from './App';
import Profile from './Profile';
import Following from './Following';
import NewAccount from './NewAccount'

import * as serviceWorker from './serviceWorker';

const routing = (
  <BrowserRouter >
    <div>
    <Switch>
      <Route exact path="/" component= {App}/>
      <Route path="/profile" component={Profile} />
      <Route path="/following" component={Following} />
      <Route path="/new" component={NewAccount} />
    </Switch>
    </div>
  </BrowserRouter>
)


ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
