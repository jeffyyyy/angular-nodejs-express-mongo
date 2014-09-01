var api = require(__dirname + '/../controllers/api')
  , index = require(__dirname + '/../controllers/index')
  , app = require(__dirname+ '/../app');
;

// serve index
app.get('/', index.index);

//login
app.post('/api/login', api.login);

// JSON API
app.get('/api/getUsers', api.getUsers);
app.get('/api/getUser/:id', api.getUser);
app.post('/api/updateUser/:id', api.updateUser);
app.delete('/api/removeUser/:id', api.removeUser, api.getUsers);

// redirect all others to the index (HTML5 history)
app.get('*', index.index);