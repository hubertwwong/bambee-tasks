const express = require('express');
const db = require('./servers/mongoUtil');

// connect to db.
console.log("connect.....");
db.connectToServer(() => {
  const app = express();
  const port = process.env.APP_PORT || 3000;

  // routes...
  app.get('/', (req, res) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});