# Haravan NodeJS App (MERN)

## Enviroment requirements
Node < v10.0.0 (recommend v8.9.4)

## Quickstart

Config env config on `server/.env` and `client/.env`

```
  npm install
  npm start
```

**Note : Please make sure your MongoDB is running.** For MongoDB installation guide see [this](https://docs.mongodb.org/v3.0/installation/). Also `npm3` is required to install dependencies properly.

## Available Commands

1. `npm run start` - starts the development server with hot reloading enabled

2. `npm run bs` - bundles the code and starts the production server

3. `npm run test` - start the test runner

4. `npm run test-lt-node6` - start the test runner for node < v6.0.0

5. `npm run watch:test` - start the test runner with watch mode

6. `npm run cover` - generates test coverage report

7. `npm run lint` - runs linter to check for lint errors

8. `npm run script -- xx` - runs script number xx. Example: `npm run script -- 01`

## File Structure

### Client

Client directory contains all the shared components, routes, modules.

#### components
This folder contains all the common components which are used throughout the project.

#### index.js
Index.js simply does client side rendering using the data provided from `window.__INITIAL_STATE__`.

#### modules
Modules are the way of organising different domain-specific modules in the project. A typical module contains the following
```
.
└── Post
    ├── __tests__                    // all the tests for this module goes here
    |   ├── components               // Sub components of this module
    |   |   ├── Post.spec.js
    |   |   ├── PostList.spec.js
    |   |   ├── PostItem.spec.js
    |   |   └── PostImage.spec.js
    |   ├── pages
    |   |   ├── PostPage.spec.js
    |   |   └── PostViewPage.spec.js
    |   ├── PostReducer.spec.js
    |   └── PostActions.spec.js
    ├── components                   // Sub components of this module
    |   ├── Post.js
    |   ├── PostList.js
    |   ├── PostItem.js
    |   └── PostImage.js
    ├── pages                        // React Router Pages from this module
    |   ├── PostPage
    |   |   ├── PostPage.js
    |   |   └── PostPage.css
    |   └── PostViewPage
    |       ├── PostViewPage.js
    |       └── PostViewPage.css
    ├── PostReducer.js
    └── PostActions.js
```

## Misc

### Docker
There are docker configurations for both development and production.

To run docker for development,
```
docker-compose -f docker-compose-development.yml build
docker-compose -f docker-compose-development.yml up
```

To run docker for production,
```
docker-compose build
docker-compose up
```
