import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';// I left this default code alone.
import reportWebVitals from './reportWebVitals';
import Routes from './Routes.js';
import colour from "./Components/Colours/Colours"
import config from "./Config"
// Importing the Bootstrap CSS
// Referred to https://codesandbox.io/s/github/react-bootstrap/code-sandbox-examples/tree/master/basic?file=/src/index.js:87-164

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import 'bootstrap/dist/css/bootstrap.min.css'; // Main tutorial only asked me to do this
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-toastify/dist/ReactToastify.css';

document.body.style.backgroundColor = colour.c4;
const promise = loadStripe(config.stripeKey);

ReactDOM.render(
  <Elements stripe={promise}>
    <Routes />
  </Elements>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
