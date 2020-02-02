const request = require('supertest');
//const mongoose = require('mongoose');

const server = require('../../servers/servers');
const UserGooseModel = require('../../mongoose/models/userGooseModel');
const UserTaskGooseModel = require('../../mongoose/models/userTaskGooseModel');

// exprexs
let app;

beforeAll(async () => {
  try {
    app = await server.runTest();
  } catch(err) {
    console.log(err);
  }
});

// https://github.com/visionmedia/supertest/issues/520
afterAll(async () => {
  await server.stopTest();
	await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

describe('task', () => {
  // Tokens to reference later.
  let jwtGood;
  let jwtBad;
  const jwtNotExist = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(async () => {
    // Wipe the table before starting each test.
    await UserGooseModel.deleteMany({});
    await UserTaskGooseModel.deleteMany({});

    // Creating some users to work with.
    let res = await request(app)        
      .post('/v1/auth/register')
      .send({username: 'good', password: 'password'});
    jwtGood = JSON.parse(res.text).jwt;

    res = await request(app)
      .post('/v1/auth/register')
      .send({username: 'bad', password: 'password'});
    jwtBad = JSON.parse(res.text).jwt;
  });

  describe('POST /v1/tasks', () => {
    describe('Use cases', () => {
      test('Able to add a task', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });
        
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).message).toBe("Task created");
      });

      test('Able to add 2 task', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });

        expect(res.status).toBe(200);

        res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task2', 
            description: 'desc2',
            dueDate: Date.now()
          });
        
        res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();

        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).length).toBe(2);
      });

      test('Unknown guy not able to add a task', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtNotExist}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });
        
        expect(res.status).toBe(401);
        // TODO: Figure out how to customize the error message on express-jwt.
        //expect(res).toBe("Unauthorizedd");
      });
    });

    describe('Validation', () => {
      test('Unable to add a task with missing name', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            description: 'desc1',
            dueDate: Date.now()
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to add a task with missing desciption', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            dueDate: Date.now()
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to add a task with missing date', async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            description: 'desc1',
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });
    });
  });

  describe('DELETE /v1/tasks/{id}', () => {
    describe('Use cases', () => {
      let taskID;

      beforeEach( async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });

        res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        taskID = JSON.parse(res.text)[0]['_id'];
      });

      test('Able to delete a specific task', async () => {
        let res = await request(app)        
          .delete(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).message).toBe('Task deleted');
      });

      test('Unable to delete a specific task twice', async () => {
        let res = await request(app)        
          .delete(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();

        expect(res.status).toBe(200);

        res = await request(app)        
          .delete(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        
        expect(res.status).toBe(404);
        expect(JSON.parse(res.text).message).toBe('Task not found');
      });

      test('Bad guy not able to delete a specific task', async () => {
        let res = await request(app)        
          .delete(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtBad}`)
          .send();
        
        expect(res.status).toBe(404);
      });

      test('Unknown guy not able to delete a specific task', async () => {
        let res = await request(app)        
          .delete(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtNotExist}`)
          .send();
        
        expect(res.status).toBe(401);
      });
    });
  });

  describe('GET /v1/tasks', () => {
    describe('Use cases', () => {
      beforeEach( async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });
      });

      test('Able to see a list of tasks', async () => {
        let res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();

        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).length).toBe(1);
      });

      test('Unknown guy not to see a list of tasks', async () => {
        let res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtNotExist}`)
          .send();

        expect(res.status).toBe(401);
        // TODO: Figure out how to customize the error message express-jwt.
        // expect(JSON.parse(res.text).length).toBe(0);
      });

      // TODO: 
      // Unsure of 404 for no task by a user.
      test('Bad guy not to see a list of tasks', async () => {
        let res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtBad}`)
          .send();

        expect(res.status).toBe(404);
        // expect(JSON.parse(res.text).length).toBe(0);
      });
    });
  });

  describe('GET /v1/tasks/{id}', () => {
    describe('Use cases', () => {
      let taskID;

      beforeEach( async () => {
        let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1', 
            description: 'desc1',
            dueDate: Date.now()
          });

        res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        taskID = JSON.parse(res.text)[0]['_id'];
      });

      test('Able to see a specific task', async () => {
        let res = await request(app)        
          .get(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text).name).toBe('task1');
      });

      test('Bad guy not able to see a specific task', async () => {
        let res = await request(app)        
          .get(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtBad}`)
          .send();
        
        expect(res.status).toBe(404);
      });

      test('Unknown guy not able to see a specific task', async () => {
        let res = await request(app)        
          .get(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtNotExist}`)
          .send();
        
        expect(res.status).toBe(401);
      });
    });
  });

  describe('PATCH /v1/tasks/{id}', () => {
    let taskID;
    let origTask = {
      name: 'task1', 
      description: 'desc1',
      dueDate: Date.now()
    };
    
    beforeEach( async () => {
      let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send(origTask);

        res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        taskID = JSON.parse(res.text)[0]['_id'];
    });

    describe('Use cases', () => {
      let updateTask = {
        name: 'task2', 
        description: 'desc2',
        dueDate: '01/01/2020',
        stage: "Completed"
      };

      test('Able to update all fields', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send(updateTask);

        expect(res.status).toBe(200);
        
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(updateTask.name);
         expect(resObj.description).toBe(updateTask.description);
         expect(resObj.dueDate).toBe(new Date(updateTask.dueDate).toISOString());
         expect(resObj.stage).toBe(updateTask.stage);
      });

      describe('Able to set specifc field', () => {
        test('stage: Completed', async () => {
          res = await request(app)        
           .patch(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send({stage: "Completed"});
  
          expect(res.status).toBe(200);
          
          res = await request(app)        
           .get(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send();
          
           resObj = JSON.parse(res.text);
           expect(res.status).toBe(200);
           expect(resObj.stage).toBe("Completed");
        });

        test('stage: New', async () => {
          res = await request(app)        
           .patch(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send({stage: "New"});
  
          expect(res.status).toBe(200);
          
          res = await request(app)        
           .get(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send();
          
           resObj = JSON.parse(res.text);
           expect(res.status).toBe(200);
           expect(resObj.stage).toBe("New");
        });

        test('name: foooo', async () => {
          res = await request(app)        
           .patch(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send({name: "foooo"});
  
          expect(res.status).toBe(200);
          
          res = await request(app)        
           .get(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send();
          
           resObj = JSON.parse(res.text);
           expect(res.status).toBe(200);
           expect(resObj.name).toBe("foooo");
        });

        test('description: newDesc', async () => {
          res = await request(app)        
           .patch(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send({description: "newDesc"});
  
          expect(res.status).toBe(200);
          
          res = await request(app)        
           .get(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send();
          
           resObj = JSON.parse(res.text);
           expect(res.status).toBe(200);
           expect(resObj.description).toBe("newDesc");
        });

        test('date: 2000-01-03', async () => {
          res = await request(app)        
           .patch(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send({dueDate: "2000-01-03"});
  
          expect(res.status).toBe(200);
          
          res = await request(app)        
           .get(`/v1/tasks/${taskID}`)
           .set('Authorization', `Bearer ${jwtGood}`)
           .send();
          
           resObj = JSON.parse(res.text);
           expect(res.status).toBe(200);
           expect(resObj.dueDate).toBe(new Date("2000-01-03").toISOString());
        });
      });

      test('Bad guy not able to update fields', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtBad}`)
         .send(updateTask);
        
        // bad guy can't update.
        expect(res.status).toBe(404);
        
        // Verify that the update did nothing.
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(origTask.name);
         expect(resObj.description).toBe(origTask.description);
         expect(resObj.dueDate).toBe(new Date(origTask.dueDate).toISOString());
      });

      test('Unknown guy not able to update fields', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtNotExist}`)
         .send(updateTask);
        
        // unknown guy can't update.
        expect(res.status).toBe(401);
        
        // Verify that the update did nothing.
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(origTask.name);
         expect(resObj.description).toBe(origTask.description);
         expect(resObj.dueDate).toBe(new Date(origTask.dueDate).toISOString());
      });
    });

    describe('Validation', () => {
      test('Unable to set a illegal stage value. {stage: "NOTVALID"}', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send({stage: "NOTVALID"});

        expect(res.status).toBe(422);
        
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.stage).toBe("New");
      });

      test('Unable to set a illegal stage value. {stage: "In-Progress"}', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send({stage: "In-Progress"});

        expect(res.status).toBe(422);
        
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.stage).toBe("New");
      });

      test('Unable to set a illegal key. {foo: "NOTVALID"}', async () => {
        res = await request(app)        
         .patch(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send({foo: "NOTVALID"});

        expect(res.status).toBe(422);
        
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.stage).toBe("New");
      });
    });
  });

  describe('PUT /v1/tasks/{id}', () => {
    let taskID;
    let origTask = {
      name: 'task1', 
      description: 'desc1',
      dueDate: Date.now()
    };
    
    beforeEach( async () => {
      let res = await request(app)        
          .post('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send(origTask);

        res = await request(app)        
          .get('/v1/tasks')
          .set('Authorization', `Bearer ${jwtGood}`)
          .send();
        taskID = JSON.parse(res.text)[0]['_id'];
    });

    describe('Use cases', () => {
      let updateTask = {
        name: 'task2', 
        description: 'desc2',
        dueDate: '2000-01-03',
        stage: "Completed"
      };

      test('Able to update fields', async () => {
        res = await request(app)        
         .put(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send(updateTask);

        expect(res.status).toBe(200);
        
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(updateTask.name);
         expect(resObj.description).toBe(updateTask.description);
         expect(resObj.dueDate).toBe(new Date(updateTask.dueDate).toISOString());
         expect(resObj.stage).toBe(updateTask.stage);
      });

      test('Bad guy not able to update fields', async () => {
        res = await request(app)        
         .put(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtBad}`)
         .send(updateTask);
        
        // bad guy can't update.
        expect(res.status).toBe(404);
        
        // Verify that the update did nothing.
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(origTask.name);
         expect(resObj.description).toBe(origTask.description);
         expect(resObj.dueDate).toBe(new Date(origTask.dueDate).toISOString());
      });

      test('Unknown guy not able to update fields', async () => {
        res = await request(app)        
         .put(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtNotExist}`)
         .send(updateTask);
        
        // unknown guy can't update.
        expect(res.status).toBe(401);
        
        // Verify that the update did nothing.
        res = await request(app)        
         .get(`/v1/tasks/${taskID}`)
         .set('Authorization', `Bearer ${jwtGood}`)
         .send();
        
         resObj = JSON.parse(res.text);
         expect(res.status).toBe(200);
         expect(resObj.name).toBe(origTask.name);
         expect(resObj.description).toBe(origTask.description);
         expect(resObj.dueDate).toBe(new Date(origTask.dueDate).toISOString());
      });
    });

    describe('Validation', () => {
      test('Unable to update a task with missing name', async () => {
        let res = await request(app)        
          .put(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            description: 'desc1',
            dueDate: Date.now(),
            stage: "Completed"
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to update a task with missing desciption', async () => {
        let res = await request(app)        
          .put(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            dueDate: Date.now(),
            stage: "Completed"
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to update a task with missing date', async () => {
        let res = await request(app)        
          .put(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            description: 'desc1',
            stage: "Completed"
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to update a task with missing stage', async () => {
        let res = await request(app)        
          .put(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            description: 'desc1',
            dueDate: Date.now()
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });

      test('Unable to update a task with an illegal stage value {stage: "ILLEGAL"}', async () => {
        let res = await request(app)        
          .put(`/v1/tasks/${taskID}`)
          .set('Authorization', `Bearer ${jwtGood}`)
          .send({
            name: 'task1',
            description: 'desc1',
            dueDate: Date.now(),
            stage: "ILLEGAL"
          });
        
        expect(res.status).toBe(422);
        expect(JSON.parse(res.text).errors).not.toBe(null);
      });
      // Probably should have input type validation test.
    });
  });
});