// src/config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.
const config = {
    baseUrl: "http://34.231.3.224:8003/api", // No trialing slash here
    stripeKey: process.env.REACT_APP_STRIPE_KEY
  };
export default config;