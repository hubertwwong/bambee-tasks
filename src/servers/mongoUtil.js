const mongoose = require('mongoose');

// store the db instance.
let _db;
// connect to db.
mongoose.connect(`mongodb://${process.env.DB_URL}/test`, 
// mongoose.connect(`mongodb://db/test`, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);
_db = mongoose.connection;

module.exports = {
  connectToServer: (callback) => {
    // Wait for server to connect before running the cb.
    _db.on('error', () => {
      console.log(">>>> Error");
      process.exit(1);
    });
    _db.once('open', () => {
      console.log(">>>> Connected to db");
      callback();
    });
  },

  getDb: function() {
    return _db;
  }
};