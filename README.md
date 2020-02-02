# Bambee Tasks

A demo project to show of express.js and mongodb.



## Requirements

1. Docker and docker-compose.

or

1. Node.js. I was using v10 on alpine but any version 10 or newer should be fine.
2. Mongodb on the localhost with the default install of no passsword. If this is not the case, add in the appropiate env values.



## Usage

#### Docker version

Copy the contents of `.env.docker` to `.env`

To start the server
```
docker-compose up
```

This creates an alias to find docker container ips.
```
alias dockerips="docker ps -q | xargs docker inspect --format '{{ .Id }} - {{ .Name }} - {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}'"
```

Then you can run the following to get the ip of express.
You should see 2 ips. `app` is express and `db` is mongodb. You want the ip of `app`.
```
dockerips
```


To run the test.
Open a new window.
```
docker-compose exec app npm test
```


#### Non docker version

Copy `.env.local` to `.env`

Install packages
```
npm install
```

Start the server
```
npm start
```

To run the test

```
npm test
```


## Postman

I used postman to test the API initally and have included the exports for user.

If you are trying to make a non `GET` request.
1. Use the `body` to input the data.
2. Set `body` to raw and the format to `JSON`. This dropdown should to the right of `body`.
3. Set the header `Content-Type` to `application/json`
4. JWT tokens can be put in the authorization section. Set the type to `Bearer Token` and you should be able to enter the JWT token on the right.



## API

| Verb   | Route                    | Description                                                 | JWT required |
|--------|--------------------------|-------------------------------------------------------------|-----|
| POST   | /v1/auth/register        | Registers a user. Returns a JWT token if successful.        | no |
| POST   | /v1/auth/login           | Logins a user. Returns a JWT token if successful.           | no |
| POST   | /v1/tasks                | Creates a task. Returns an array of task object.            | yes |
| PUT    | /v1/tasks/{id}           | Updates a task.                                             | yes |
| PATCH  | /v1/tasks/{id}           | Updates a task.                                             | yes |
| DELETE | /v1/tasks/{id}           | Deletes a task.                                             | yes |
| GET    | /v1/tasks                | Get all tasks by a user.                                    | yes |
| GET    | /v1/tasks/{id}           | Get a specific task by the user.                            | yes |
| POST   | /v2/tasks                | Creates a task. Returns an array of task object.            | yes |
| PUT    | /v2/tasks/{id}           | Updates a task.                                             | yes |
| PATCH  | /v2/tasks/{id}           | Updates a task.                                             | yes |
| DELETE | /v2/tasks/{id}           | Deletes a task.                                             | yes |
| GET    | /v2/tasks                | Get all tasks by a user.                                    | yes |
| GET    | /v2/tasks/{id}           | Get a specific task by the user.                            | yes |

In general, if you need to pass in values, you can do it in the body in JSON format.
Set the `Content-Type` to `application/json` 

PUT /v2/tasks/{id}
```
{
  "name": "name of task",
  "description": "description",
  "dueDate": "2020-02-03T00:00:00.000Z",
  "stage": "New"
}
```

POST /v2/tasks
```
{
  "name": "name of task",
  "description": "description",
  "dueDate": "2100-02-03"
}
```

POST /v1/auth/register
```
{
  "username": "foo",
  "password": "password"
}
```

JWT are passed in by the authorization header as a bearer token.

```
Authorization: Bearer <token>
```

Note:

Dates are check using this function `.isISO8601()` from express validator. You can put a date like `2020-01-02` and it should work.



## API versioning and upgrade considerations.

1. API version was done on the route level.
2. Routes are versioned but controllers and models are not.
 
Lets say the task schema has an `stage` to `status`:

One solution might be:
1. Have a v3 set of routes.
2. DB would have both `status` and `stage` fields.
3. UserTask model would functions to deal with both formats. Keep the original one and add a new set of functions with the v3 suffix.
4. Modify the original set of function to return `stage` and not status.
5. Have the new set of function deal with `status`.
6. Controller would check the API version and route to the correct model.
7. Update the mongoose schema and model. 
8. Add a set of v3 routes.
9. Update and add new integration test.   



## Directories

#### postman

Added the postman files that I used to test the API.
There are two files.
1. List of routes
2. Enviroment. Used to set the base url. Generally `localhost` or `172.x.x.x` depending on what docker assign the ip of express to.

#### __tests__

- This contains all of the e2e test.
- Test are broken out by routes.
- Using Jest for the test cases and supertest to interact with the API.

#### controllers

- Just calls the model of interest and renders the results.
- Mostly of the validation are done by the middleware or models.

#### middleware

- Custom middleware.
- `validate.js` - Contains the express-validator settings.
- `errors.js` -  A simple middleware that handles validation errors and displays them.
- `constants.js` - Currently just has business rules specified by the project. Used by the validation.js to enforce the rules.

#### models

- API models that interfaces with mongodb.
- Not using the mongoose middleware so these files are probably bigger. I'm not that familiar with mongoose to decided against it.

#### mongoose

- Contains the mongoose models and schemas.
- These files are dumb. Just basic schema and model setup.

#### routes

- Contains the express routes.
- Split the routes per API version and controller.
- No logic in the routes per the instructions.

#### servers

- These contains the main server files.
- I split up the logic into functions to allow seperate use if needed.

#### index.js

- Main file that starts up express.
- Basically just calls servers run() function.