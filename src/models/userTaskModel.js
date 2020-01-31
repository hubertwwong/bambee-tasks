const UserTasksMongoModel = require('../mongoose/schemas/userTaskSchema');

exports.read = async (id) => {
  try {
    let tasks = [];
    if (!id) {
      tasks = await UserTasksMongoModel.find();
    } else {
      tasks = await UserTasksMongoModel.find(id);
    }
    
  } catch(err) {
    return Promise.reject(new Error(err));
  }
}