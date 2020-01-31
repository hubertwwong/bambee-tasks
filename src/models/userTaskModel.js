const UserTaskGooseModel = require('../mongoose/models/userTaskGooseModel');
const UserModel = require('./userModel');

/**
 * Creates a task in the userTask table
 * 
 * @param userID - MongoDB internal id in the user table.
 * @param task - Object that is in this format {name: yourTask, description: youDesc, dueDate: dueDate}
 */
exports.createTask = async (userID, task) => {
  try {
    if (!userID || !task || !task.name || !task.description || !task.dueDate) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    console.log("> in create task model >" + userID);
    // Find the user. Want to make sure that the user is in the db before writing to UserTask
    let user = await UserModel.find(userID);
    if (user) {
      // Find the user in UserTask table
      let userTask = null;
      try {
        console.log("> getting user in usertask");
        userTask = await this.getUser(userID);
        console.log("> got user task" + userTask);
      } catch(err) {
        console.log("> hit the catch block");
        // User not found in user task. Create it.
        userTask = new UserTaskGooseModel({
          userID: userID,
          tasks: []
        });
        await userTask.save();
      }

      // Add the task.
      console.log("> before pushing task " + userTask);
      task.stage = "New";
      userTask.tasks.push(task);
      await userTask.save();
      console.log("> after pushing task " + userTask);
      return "done";
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    // Nested error object. Think on how you how you might want to handle this.
    // Currently, i'm using passing the err object if it see ones.
    // Create a new one otherwise.
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}

/**
 * UNTESTED
 */
// exports.getTask = async (userID, id) => {
//   try {
//     let tasks = [];
    
    
//   } catch(err) {
//     return Promise.reject(new Error(err));
//   }
// }

/**
 * Get a specific user from the UserTask table
 * 
 * @param userID - User ID of the UserTask
 * @returns - UserTask object or reject the promise.
 */
exports.getUser = async (userID) => {
  try {
    if (!userID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    if (userID) {
      let userTask = await UserTaskGooseModel.findOne({userID: userID});
      console.log("> retruring " + userTask);

      // Check if UserTask was found or not once you verified the user exist.
      if (!userTask) {
        return Promise.reject(new Error(JSON.stringify({
          message: "User found but UserTask not found",
          status: 404
        })));
      }

      return userTask;
    }

    return Promise.reject(new Error(JSON.stringify({
      message: "User not found",
      status: 404
    })));
  } catch(err) {
    return Promise.reject(new Error(err));
  }
}