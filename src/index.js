const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require('./servers/mongoUtil');

// Connect to db
db.connectToServer(() => {
  // Spin up express after the db is connected.
  const app = express();
  const port = process.env.APP_PORT || 3000;
  
  // Register middleware
  // ===================
  // NOTE TO SELF. REMEMBER TO PUT MIDDLEWARE BEFORE ROUTES.
  
  // express own body parser.
  // app.use(express.bodyParser());

  // parse application/x-www-form-urlencoded
  // extended: true strips out extra spaces.
  app.use(bodyParser.urlencoded({ extended: true }))

  // parse application/json
  app.use(bodyParser.json())
  
  // CORS
  app.use(cors());

  // Register routes
  // ===============
  appRoutes = require('./routes/index')(app); 


  // Start express.
  app.listen(port, () => console.log(`Bambee Tasks listening on port ${port}!`));
});