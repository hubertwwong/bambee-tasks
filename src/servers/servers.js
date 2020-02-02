// Load the env file in case you are not using docker-compose.
require('dotenv').config();

const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');

const mongooseAsync = require('./mongooseAsync');

let mongoDBconn;

// Tries to figure out the connection based on if the user password env values were set.
if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
  mongoDBconn = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`;
} else {
  mongoDBconn = `mongodb://${process.env.DB_URL}/${process.env.DB_NAME}`;
}      

let app;
let db;

const port = process.env.APP_PORT || 3000;

/**
 * Connects to mongodb using mongoose.
 */
async function connectMongoose() {
  try {
    // Wait for the db to connect.
    db = await mongooseAsync.connect(mongoDBconn);
    return db;
  } catch(err) {
    console.log(err);
  }
}

async function closeMongoose() {
  try {
    mongoose.connection.close();
  } catch(err) {
    console.log(err);
  }
}

/**
 * Configure express but does not listen on a port.
 * This is to allow testing. See the run function.
 */
function configExpress() {
  // Spin up express after the db is connected.
  app = express();
  
  // Register middleware
  // ===================

  // Apparently the order matters of these 2 items.
  // These go frist...
  // https://stackoverflow.com/questions/39470566/request-body-undefined-in-supertest
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  
  // CORS
  app.use(cors());

  // Register routes
  // NOTE: PUT THIS AFTER ALL MIDDLEWARE
  // ===============
  appRoutes = require('../routes/index')(app); 
  
  return app;
}

function listenExpress() {
  app.listen(port, () => console.log(`Bambee Tasks listening on port ${port}!`));
}

/**
 * This is the main API.
 * Just run this function to start the api.
 * index.js calls this function.
 */
async function run() {
  try {
    await connectMongoose();
    configExpress();
    listenExpress();

    return "done";
  } catch(err) {
    console.log(err);
  }
}

/**
 * This is used for testing.
 * The only difference between this and run() is that the listen function is not work.
 * Supertest does not need it.
 */
async function runTest() {
  try {
    await connectMongoose();
    configExpress();

    return app;
  } catch(err) {
    console.log(err);
  }
}

/**
 * Stop all servers.
 * For now its mongoose but it migth be more.
 */
async function stopTest() {
  try {
    closeMongoose();
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  configExpress,
  connectMongoose,
  closeMongoose,
  listenExpress,
  run,
  runTest,
  stopTest,
  app,
  db
}