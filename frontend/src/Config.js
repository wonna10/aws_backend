// src/config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.
const config = {
    baseUrl: "http://54.157.189.30:8003/api", // No trialing slash here
    stripeKey: process.env.REACT_APP_STRIPE_KEY
  };
export default config;