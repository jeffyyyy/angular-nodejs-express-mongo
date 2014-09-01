var api = require(__dirname + '/../controllers/api')
  , index = require(__dirname + '/../controllers/index')
  , app = require(__dirname+ '/../app')
  , expressJwt = require('express-jwt')
;

// serve index
app.get('/', index.index);

//login
app.post('/authenticate', api.login);

// JSON API
app.get('/api/getUsers', expressJwt({secret: app.config.session.secret}), api.getUsers);
app.get('/api/getUser/:id', api.getUser);
app.post('/api/updateUser/:id', api.updateUser);
app.delete('/api/removeUser/:id', api.removeUser, api.getUsers);

// redirect all others to the index (HTML5 history)
app.get('*', index.index);