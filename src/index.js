const express = require('express');
const mongoose = require('mongoose');

const db = require('./servers/mongoUtil');

// Connect to db
db.connectToServer(() => {
  // TESTING
  //const mongoose = db.getMongoose();
  console.log(">>>>>>>>>>>>>>>>>.");
  var kittySchema = new mongoose.Schema({
    name: String
  });
  var Kitten = mongoose.model('Kitten', kittySchema);
  var silence = new Kitten({ name: 'Silence' });
  silence.save(function (err, silence) {
    if (err) return console.error(err);
    console.log(">>> cat saved", silence);
  });
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log("???????");
    console.log(kittens);
  });

  // const UserSchema = require('./schemas/user');
  // let UserModel = mongoose.model('User', UserSchema);
  let UserModel = require('./schemas/user');
  let u = new UserModel({
    name: "foo2", 
    password: "pass3",
    salt: "saltt4"
  });
  u.save((err, res) => {
    console.log("User saved");
  });
  // let UserTasksSchema = require('./schemas/userTask');
  // let UserTasksModel = mongoose.model('UserTask', UserTasksSchema);
  let UserTasksModel = require('./schemas/userTask');
  let t = new UserTasksModel({
    userID: u._id,
    tasks: [{
      name: "task2",
      description: "desc3",
      status: "New",
      dueDate: new Date()
    }]
  });
  t.save((err, res) => {
    console.log("Task save");
  });

  UserTasksModel.find(function (err, res) {
    if (err) return console.error(err);
    console.log(">>> res");
    res.forEach((item) => {
      console.log(item);
    });
  });

  // TESTING
  // =====================================

  // Spin up express after the db is connected.
  const app = express();
  const port = process.env.APP_PORT || 3000;
  const appRoutes = require('./routes/index')(app); 

  // routes...
  app.get('/', (req, res) => res.send('Hello World!'))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});