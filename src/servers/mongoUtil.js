const mongoose = require('mongoose');

/**
 * This is a helper function to connect to the mongodb instance.
 */

// Store the db instance.
let _db;

module.exports = {
  // 
  connectToServer: (callback) => {
    // Connect to db.
    mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`, 
    // mongoose.connect(`mongodb://${process.env.DB_URL}/${process.env.DB_NAME}`, 
    {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    }
    );
    _db = mongoose.connection;

    _db.on('error', () => {
      console.log("> Connection error");
      process.exit(1);
    });
    _db.once('open', () => {
      console.log("> Connected to db");
      callback();
    });
  },

  // Used to grab the db instance.
  // I don't think you need this for mongoose.
  // You need this if you are using mongodb
  // getDb: function() {
  //   return _db;
  // },

  // getMongoose: function() {
  //   return mongoose;
  // }
};