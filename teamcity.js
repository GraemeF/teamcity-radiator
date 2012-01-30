
/*
 * TeamCity API client
 */
var libxmljs = require("libxmljs");
var http = require("http");

exports.requestXml = function(path, callback) {
  var base_url = "ci.gogobot.com";
  var client = http.createClient(80, base_url);
  var username = 'hubot';
  var password = 'windyhill99';
  var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  
  var request = client.request('GET', "/httpAuth/app/rest" + path, {'host': 'ci.gogobot.com', 'Authorization': auth});

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