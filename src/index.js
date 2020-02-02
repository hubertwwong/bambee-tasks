const server = require('./servers/server');

// Starts connection to mongo.
server.connectToDB();
// Start express.
server.run();