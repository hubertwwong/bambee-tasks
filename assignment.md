# ASSIGMENT

## tech

nodejs
mongo

## Authentication service
- handle a username & password registration and login.
- Successful authorization results in a JWT token for the authorized client to use moving forward.

## Create a Task service

User can
1. Create a task (name, description, and due date)
  a. A task will have two statuses: “New” and “Completed”
  b. “New” is a default status
2. Get a list of all created Tasks
3. Get a single task by id
4. Update a task name, description, due date, and stage (“New” to “Completed”)
5. Delete a task

## Create API segmentation

1. See above
2. Version 2 of the API will introduce a new status called “In-Progress”.
  a. “In-Progress” will not be an available option when updating a task using V1

## E2E testing

Using a framework you’re familiar with, formulate necessary test cases that would ensure
functionality coverage of 100% of all API endpoints.

## Goals

1. Avoid writing business logic directly into the route handlers. We are looking for your ability to organize code.
2. Demonstrate familiarity of the express middleware system and implement Auth & Access Control. IE: Routes that require authorization vs don’t require authorization
3. Ensure access control of Task items to the creator
4. For each of the services, consider and implement 4xx scenarios. Ie: attempting to access a Task route without proper Authorization results in 401 or 403.
5. Think about how versioning can be applied to any of the routes for feature additions and breaking changes


