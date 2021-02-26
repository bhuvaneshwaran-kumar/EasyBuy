import React,{useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';

import UserProvider from "./contexts/UserProvider"
import {initialState, reducer} from "./reducers/UserReducer"

ReactDOM.render(
  <React.StrictMode>
    <Router>
    <UserProvider intialState={initialState} reducer={reducer}>
        <App/>
        </UserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

