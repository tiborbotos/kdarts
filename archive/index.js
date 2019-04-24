// var express = require('express')
// var app = express();

// app.set('port', (process.env.PORT || 5000))
// app.use(express.static(__dirname + '/public'))

// app.listen(app.get('port'), function() {
//   console.log("Node app is running at localhost:" + app.get('port'))
// })

// require deployd
var deployd = require('deployd');

// configure database etc.
var server = deployd({
  port: process.env.PORT || 5000,
  env: 'production',
  db: {
    host: 'ds063630.mongolab.com',
    port: 63630,
    name: 'kdarts',
    credentials: {
      username: 'rocky2',
      password: 'dslkcj23e3dasxasii'
    }
  }
});

// heroku requires these settings for sockets to work
// server.sockets.manager.settings.transports = ["xhr-polling"];

// start the server
server.listen();

// debug
server.on('listening', function() {
  console.log("Server is listening on port: " + process.env.PORT);
});

// Deployd requires this
server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
