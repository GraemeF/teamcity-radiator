
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , Build = require('./build');

require('./underscore');

var app = module.exports = express.createServer();

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

// Routes

app.get('/', function(req, res) {
  var builds = [new Build("bt2", "Unit Tests"), new Build("bt5", "Integration Tests")];
  var done = false;
  
  // ugliest hack ever to make it sequential.. was having weird results in lixmljs when in parallel
  builds[0].get(function() { done = true; });
  
  var interval = setInterval(function() {
    if(done) {
      clearInterval(interval);
      builds[1].get(function() { 
        res.render('index', { builds: builds });
      });
    }
  }, 200);
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
