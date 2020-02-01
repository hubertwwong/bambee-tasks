const mongoose = require('mongoose');

module.exports = {
  // Wrapping the mongoose connection in a promise.
  connect: () => {
    return new Promise ((resolve, reject) => {
      try {
        const conStr = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?authSource=admin`;
        const args = {
          useNewUrlParser: true, 
          useUnifiedTopology: true
        }
        // connect to mongo.
        let db = mongoose.connection;
        mongoose.connect(conStr, args);
        db.on('error', () => {
          reject(`Can't connect to mongodb`);
        });
        db.once('open', () => {
          resolve(db);
        });
      } catch (err) {
        console.log(err);
      }
    })
  }
}