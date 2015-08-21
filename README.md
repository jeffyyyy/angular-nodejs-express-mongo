angular-nodejs-express-mongo
============================

An experiment of using MEAN stack.

Containing basic functions such as user authentication and management, chatroom using socket.io, canvas painting, google visualization tools.


A few Steps to make it work:
----------------------------

	A. Install Mongo and start mongo server

	B. Install Node.js and Bower

	C. cd into project folder and run command 'npm install'

	D. run command 'bower install'

	E. run command 'node init.js' 
	   (Create a sample user with username admin@admin.com, and password is admin)

	F. run command 'node app.js' to start the application, 
	   then view in browser with url http://localhost:5040


Code distribution:
------------------

	NodeJS code is "app.js" and in folder "routes" and "controllers". 
	Server side route file is "routes/route.js"

	MongoDb related code is in folder "models" and "schemas"

	AngularJs code is in folder "public/js".
	Angular view templates are in folder "public/partials"

	Main index page is in folder "views"

	Css is using Bootstrap 3 and fontawesome