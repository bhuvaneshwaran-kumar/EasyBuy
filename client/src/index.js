import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';

import UserProvider from "./contexts/UserProvider"
import {initialState, reducer} from "./reducers/UserReducer"
import ProductProvider
from './contexts/ProductProvider.js'
import {productInitialState,productReducer} from './reducers/ProductReducer'
import CartProvider from "./contexts/CartProvider"
import {cartInitialState, cartReducer} from "./reducers/CartReducer"
import CompareProvider from "./contexts/CompareProvider"
import {CompareInitialState, CompareReducer} from "./reducers/CompareReducer"


ReactDOM.render(
  <React.StrictMode>
    <Router>
    <ProductProvider initialState={productInitialState} reducer={productReducer}>  
      <UserProvider initialState={initialState} reducer={reducer}>
        <CartProvider initialState={cartInitialState} reducer={cartReducer}>

          <CompareProvider initialState = {CompareInitialState} reducer={CompareReducer}>
           <App/>
          </CompareProvider>

        </CartProvider>
      </UserProvider>
    </ProductProvider>

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

