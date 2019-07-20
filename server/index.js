// Install and require the following packages and store them as const variables: express, express-session, massive, dotenv
// When you require dotenv, immediately invoke the config method from this module.
require('dotenv').config();
const express = require('express'); 
const session = require('express-session');
const massive = require('massive');
const app = express();
// Define a const variable called PORT equal to 4000
const PORT = 4000;
// destructure CONNECTION_STRING and SESSION_SECRET from process.env, storing it on a const variable.
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
// require the authController.js file storing it on a const variable called authCtrl
const authCtrl = require('../controllers/authController');
// require treasureController.js storing it on a const variable called treasureCtrl.
const treasureCtrl = require('../controllers/treasureController');
// Define a const variable called app equal to express invoked.
// Require authMiddleware.js and store it on a const variable called auth.
const auth = require('../server/middleware/authMiddleware');
// Use the json method of the express package as top level middleware.
app.use(express.json());
// Create the database connection by invoking massive and passing in the CONNECTION_STRING
// Add a .then on the massive invocation passing in a function, and store the resulting database connection using app.set
massive(CONNECTION_STRING).then( (db) => {
    app.set('db', db);
    console.log('The database is connected.');
});
// Set up session as top-level middleware by invoking app.use and passing in session invoked with a configuration object.
// The session configuration object should have properties resave set to true, saveUninitialized set to false, and secret    // set to SESSION_SECRET
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);
// Create a POST endpoint with '/auth/register' as the URL and authCtrl.register as the controller function.
app.post('/auth/register', authCtrl.register);
// Create a POST endpoint with '/auth/login' as the URL and authCtrl.login as the controller function.
app.post('/auth/login', authCtrl.login);
// Create a GET endpoint with url '/auth/logout' and method authCtrl.logout
app.get('/auth/logout', authCtrl.logout);
// Create a get endpoint, '/api/treasure/dragon', with the function treasureCtrl.dragonTreasure.
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
// Create a get endpoint, '/api/treasure/user', with the function treasureCtrl.getUserTreasure.
// Apply the usersOnly middleware that we have just created by referencing the middleware function between the endpoint path and the controller function.
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get("/api/treasure/all", auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);
// Make the server listen on the previously mentioned port number using app.listen
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));