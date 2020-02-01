const UserTaskGooseModel = require('../mongoose/models/userTaskGooseModel');
const UserModel = require('./userModel');

/**
 * Creates a task in the userTask table
 * 
 * @param userID - MongoDB internal id in the user table.
 * @param task - Object that is in this format {name: yourTask, description: youDesc, dueDate: dueDate}
 * @returns - Resolved or rejected promise.
 */
exports.createTask = async (userID, task) => {
  try {
    if (!userID || !task || !task.name || !task.description || !task.dueDate) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    // Find the user. Want to make sure that the user is in the db before writing to UserTask
    let user = await UserModel.find(userID);
    if (user) {
      // Find the user in UserTask table
      let userTask = null;
      try {
        // console.log("> getting user in usertask");
        userTask = await this.getUser(userID);
        // console.log("> got user task" + userTask);
      } catch(err) {
        // console.log("> hit the catch block");
        // User not found in user task. Create it.
        userTask = new UserTaskGooseModel({
          userID: userID,
          tasks: []
        });
        await userTask.save();
      }

      // Add the task.
      // console.log("> before pushing task " + userTask);
      task.stage = "New";
      userTask.tasks.push(task);
      await userTask.save();
      // console.log("> after pushing task " + userTask);
      return "done";
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    // Nested error object. 
    // Currently passing the original error back. Thinking on how this might be better.
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}

/**
 * Delete a task by a user.
 * 
 * @param userID - MongoDB internal user id.
 * @param taskID - MongoDB internal id for user tasks.
 * @returns - Resolved or rejected promise.
 */
exports.deleteTask = async (userID, taskID) => {
  try {
    // console.log("> delete task model");
    if (!userID || !taskID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    // Find the user. Want to make sure that the user is in the db.
    let user = await UserModel.find(userID);
    // console.log("> AFTER user " + user);
    if (user) {
      // Find the user in UserTask table
      let userTask = null;
      try {
        // console.log("> getting user in usertask");
        userTask = await this.getUser(userID);
      } catch(err) {
        // If it could not find the actual user in userTask, task can't be found so return an error.
        return Promise.reject(new Error(JSON.stringify({
          message: "Task not found",
          status: 404
        })));
      }

      // Find the specific task off the user.
      // console.log("> before pushing task " + userTask);
      let foundTask = userTask.tasks.id(taskID);
      // Make a check if the task exist for the user
      // If not, return an error.
      if (!foundTask) {
        return Promise.reject(new Error(JSON.stringify({
          message: "Task not found",
          status: 404
        })));
      }

      // Delete the task.
      // console.log(foundTask);
      foundTask.remove();
      await userTask.save();
      // console.log("> after pushing task " + userTask.tasks);
      
      return "done";
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    // Nested error object. 
    // Currently passing the original error back. Thinking on how this might be better.
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}

/**
 * Get a specific task by a user.
 * 
 * @param userID - MongoDB internal user id.
 * @param taskID - MongoDB internal id for user tasks.
 * @returns a single task or a promise rejection.
 */
exports.getTask = async(userID, taskID) => {
  try {
    if (!userID || !taskID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    const userTask = await this.getUser(userID);
    const task = userTask.tasks.id(taskID); 

    if (!task) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Task not found",
        status: 404
      })));
    }
    return task;
  } catch(err) {
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}

/**
 * Get all tasks for the user.
 * 
 * if the id is specified, it returns the specific task.
 * 
 * @param userID - mongo id of the user.
 * @returns array of tasks or a promise rejection
 */
exports.getTasks = async (userID) => {
  try {
    if (!userID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    const userTask = await this.getUser(userID);
    return userTask.tasks;
  } catch(err) {
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}

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
      // console.log("> retruring " + userTask);

      // Check if UserTask was found or not once you verified the user exist.
      if (!userTask) {
        // Favoring returning an empty array rathen than an error.
        // return Promise.resolve({tasks:[]});
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

/**
 * Update a task in the userTask table.
 * This is used for PUT/PATCH
 * 
 * @param userID - MongoDB internal id of the user.
 * @param taskID - MongoDB internal id of the user task.
 * @param task - Task object to be updated.
 * @returns - Resolved or rejected promise.
 */
exports.updateTask = async (userID, taskID, task) => {
  try {
    // console.log("> updateTask model");
    if (!userID || !task || !taskID) {
      return Promise.reject(new Error(JSON.stringify({
        message: "Param not specified",
        status: 422
      })));
    }

    // Find the user. Want to make sure that the user is in the db before writing to UserTask
    let user = await UserModel.find(userID);
    // console.log("> AFTER user " + user);
    if (user) {
      // Find the user in UserTask table
      let userTask = null;
      try {
        // console.log("> getting user in usertask");
        userTask = await this.getUser(userID);
      } catch(err) {
        // If it could not find the actual user in userTask, task can't be found so return an error.
        return Promise.reject(new Error(JSON.stringify({
          message: "Task not found",
          status: 404
        })));
      }

      // Find the specific task off the user.
      // console.log("> before pushing task " + userTask);
      let foundTask = userTask.tasks.id(taskID);
      // Make a check if the task exist for the user
      // If not, return an error.
      if (!foundTask) {
        return Promise.reject(new Error(JSON.stringify({
          message: "Task not found",
          status: 404
        })));
      }

      // Update the task.
      // Checking if each field exist before updating them.
      if (task.name) { foundTask.name = task.name };
      if (task.description) { foundTask.description = task.description };
      if (task.stage) { foundTask.stage = task.stage };
      if (task.dueDate) { foundTask.dueDate = task.dueDate };
      // console.log(foundTask);
      await userTask.save();
      // console.log("> after pushing task " + userTask.tasks);
      
      return "done";
    }
    
    return Promise.reject(new Error(JSON.stringify({
        message: "User not found",
        status: 404
      })));
  } catch(err) {
    // Nested error object. 
    // Currently passing the original error back. Thinking on how this might be better.
    if (err.message) {return Promise.reject(err); }
    return Promise.reject(new Error(err));
  }
}