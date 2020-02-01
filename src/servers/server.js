const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");

const mongooseAsync = require('./mongooseAsync');

let app;
let db;

const port = process.env.APP_PORT || 3000;

async function connectToDB() {
  try {
    // Wait for the db to connect.
    console.log('> connecting to mongoose');
    db = await mongooseAsync.connect();
    return "done";
  } catch(err) {
    console.log(err);
  }
}

async function run() {
  try {
    // Connect to db.
    //await connectToDB();

    // Spin up express after the db is connected.
    app = express();
    
    // Register middleware
    // ===================
    // NOTE TO SELF. REMEMBER TO PUT MIDDLEWARE BEFORE ROUTES.
    
    // express own body parser.
    // app.use(express.bodyParser());

    // parse application/x-www-form-urlencoded
    // extended: true strips out extra spaces and \n\t.
    //app.use(bodyParser.urlencoded({ extended: true }))
    
    // parse application/json
    //app.use(bodyParser.json())
    
    // Apparently the order matters of these 2 items.
    // https://stackoverflow.com/questions/39470566/request-body-undefined-in-supertest
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // CORS
    app.use(cors());

    // Validation
    // app.use(expressValidator());

    // Register routes
    // ===============
    appRoutes = require('../routes/index')(app); 

    // Start express.
    console.log("> on server");
    app.listen(port, () => console.log(`Bambee Tasks listening on port ${port}!`));
    return app;
  } catch(err) {
    console.log(err);
  }
}

// Used for testing.
module.exports = {
  connectToDB,
  run,
  app,
  db
};