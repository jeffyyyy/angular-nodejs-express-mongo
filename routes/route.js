var api = require(__dirname + '/../controllers/api')
  , index = require(__dirname + '/../controllers/index')
  , app = require(__dirname+ '/../app')
  , expressJwt = require('express-jwt')
;

// serve index
app.get('/', index.index);

// service config

//login authentication
app.post('/authenticate', api.login);

// JSON API
app.get('/api/getUsers', api.getUsers);
app.get('/api/getConfig', api.getConfig);
app.get('/api/getUser/:id', api.getUser);
app.get('/api/getCurrentUser', api.getCurrentUser);
app.post('/api/updateUser/:id', api.updateUser);
app.post('/api/logout', api.logout);
app.post('/api/check/:field', api.checkUsername);
app.delete('/api/removeUser/:id', api.removeUser, api.getUsers);

// redirect all others to the index (HTML5 history)
app.get('*', index.index);