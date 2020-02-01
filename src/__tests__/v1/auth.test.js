const request = require('supertest');
//const mongoose = require('mongoose');

const server = require('../../servers/server');
const UserGooseModel = require('../../mongoose/models/userGooseModel');

// exprexs
let app;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

beforeAll(async () => {
  try {
    await server.connectToDB();
    app = await server.run();
    console.log('> SERVER connected');
  } catch(err) {
    console.log(err);
  }
});

describe('auth', () => {
  beforeEach(async () => {
    // await mongoose.connection.db.dropCollection('users');
    await UserGooseModel.deleteMany({});
  });

  describe('/v1/auth/login', () => {
    test('User able to login with proper credentials', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo1111', password: 'bar'});
      expect(res.status).toBe(200);
      
      res = await request(app)        
        .post('/v1/auth/login')
        .send({username: 'foo1111', password: 'bar'});

      expect(res.status).toBe(200);
      expect(JSON.parse(res.text).jwtToken).not.toBe(null);
    });

    test('User unable to login with wrong password', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo1111', password: 'bar'});
      expect(res.status).toBe(200);
      
      res = await request(app)        
        .post('/v1/auth/login')
        .send({username: 'foo1111', password: 'wrong'});

      expect(res.status).toBe(401);
      expect(JSON.parse(res.text).message).toBe("Username or password wrong");
    });

    test('User unable to login with no account', async () => {
      let res = await request(app)        
        .post('/v1/auth/login')
        .send({username: 'foo1111', password: 'bar'});

      expect(res.status).toBe(404);
      expect(JSON.parse(res.text).message).toBe("User not found");
    });
    
    test('User unable to login without a password', async () => {
      let res = await request(app)        
        .post('/v1/auth/login')
        .send({username: 'foo2'});

      expect(res.status).toBe(422);
      expect(JSON.parse(res.text).errors).not.toBe(null);
    });

    test('User unable to login without a username', async () => {
      let res = await request(app)        
        .post('/v1/auth/login')
        .send({password: 'foo1111'});

      expect(res.status).toBe(422);
      expect(JSON.parse(res.text).errors).not.toBe(null);
    });
  });
  
  describe('/v1/auth/register', () => {
    test('Able to register a new user', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo1111', password: 'bar'});
      
      expect(res.status).toBe(200);
      expect(JSON.parse(res.text).jwtToken).not.toBe(null);
    });

    test('Unable to register a existing user', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo1111', password: 'bar'});
      res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo1111', password: 'bar'});

      expect(res.status).toBe(409);
      expect(JSON.parse(res.text).message).toBe("User already exists");
    });


    test('User unable to register without a password', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({username: 'foo2'});

      expect(res.status).toBe(422);
      expect(JSON.parse(res.text).errors).not.toBe(null);
    });

    test('User unable to register without a username', async () => {
      let res = await request(app)        
        .post('/v1/auth/register')
        .send({password: 'foo1111'});

      expect(res.status).toBe(422);
      expect(JSON.parse(res.text).errors).not.toBe(null);
    });
  });
});