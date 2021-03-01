import React,{useEffect} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';

import UserProvider from "./contexts/UserProvider"
import {initialState, reducer} from "./reducers/UserReducer"
import ProductProvider
from './contexts/ProductProvider.js'
import {productInitialState,productReducer} from './reducers/ProductReducer'



ReactDOM.render(
  <React.StrictMode>
    <Router>
    <ProductProvider initialState={productInitialState} reducer={productReducer}>  
      <UserProvider initialState={initialState} reducer={reducer}>
        <App/>
      </UserProvider>
    </ProductProvider>

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

