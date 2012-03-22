var fs = require('fs');
var _ = require('./underscore');
var Build = require('./build');

var Config = {
	parseBuildConfigurations: function(callback) {
	  fs.readFile('config.json', function (err, data) {
		  if (err) throw err;
		  
		  var config = JSON.parse(data);
		  var builds = _.map(config.builds, function(build) {
		  	return new Build(build.buildTypeId, build.name);
		  });
		  
		  callback(builds);
		});
	}
};

module.exports = Config;