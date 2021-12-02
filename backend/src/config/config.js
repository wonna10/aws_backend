//config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.
module.exports = {
    databaseUserName: process.env.DB_USERNAME,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_DATABASE_NAME,

   
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    JWTKey: process.env.JWTKEY,
    RefreshKey: process.env.REFRESHKEY,

    mailTrapUserName: process.env.MAILTRAP_USERNAME,
    mailTrapPasswod: process.env.MAILTRAP_PASSWORD,

    stripeKey: process.env.STRIPE_KEY,
    webHookKey: process.env.STRIPE_TEST_WEBHOOK_SECRET
};
//Reference:
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786