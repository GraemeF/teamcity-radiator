var express = require('express')
  , config = require('./config')
  , routes = require('./routes')
  , Build = require('./build')
  , radiator = require('./radiator')
  , _ = require('./underscore')
  , nowjs = require("now");

var app = module.exports = express.createServer();
var stream = nowjs.initialize(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var parseBuildPayload = function(json) {
  var buildStatus = data.build.buildStatus;
  var buildResult = data.build.buildResult;
  var buildNum    = data.build.buildNumber;
  var buildName   = data.build.buildName;
  var projName    = data.build.projectName;
  var message     = data.build.message;
};

app.post('/build', function(req, res) {
  res.send("OK");
  
  if(stream.now.receiveBuildEvent) {
    stream.now.receiveBuildEvent(req.body.build);
  }
});

app.get('/', function(req, res) {
  config.parseBuildConfigurations(function(builds) {
    try {
      radiator.requestData(builds, function() {
        res.render('index', { 
          builds: _.sortBy(builds, function(b) { return !b.isBroken; })
        });
      });
    }
    catch(exc) {
      // Probably failed to communicate with TeamCity
      console.log(exc);
      res.render('index', { builds: [] });
    }
  });
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);