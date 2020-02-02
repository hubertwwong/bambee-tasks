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

    // Apparently the order matters of these 2 items.
    // These go frist...
    // https://stackoverflow.com/questions/39470566/request-body-undefined-in-supertest
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    // express own body parser.
    // app.use(express.bodyParser());
    // SEEMS BROKEN

    // CORS
    app.use(cors());

    // Validation
    // app.use(expressValidator());

    // Register routes
    // NOTE: PUT THIS AFTER ALL MIDDLEWARE
    // ===============
    appRoutes = require('../routes/index')(app); 

    // Start express.
    // DON'T LISTEN ON A PORT IF USING TEST ENV.
    // SUPER TEST DOES NOT NEED ONE.
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => console.log(`Bambee Tasks listening on port ${port}!`));
    }
    
    app.on('close', () => console.log('> Closing') );

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