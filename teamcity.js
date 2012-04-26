
/*
 * TeamCity API client
 */
var libxmljs = require("libxmljs");
var http = require("http");

exports.requestXml = function(path, callback) {
  var base_url = process.env.npm_package_config_teamcity_host;
  var client = http.createClient(80, base_url);
  var username = process.env.npm_package_config_teamcity_username;
  var password = process.env.npm_package_config_teamcity_password;
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  
  var request = client.request('GET', "/httpAuth/app/rest" + path, {'host': base_url, 'Authorization': auth});

  request.end();

  request.on('response', function(response) {
    var data = "";

    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback(libxmljs.parseXmlString(data));
    }); 
  });
};