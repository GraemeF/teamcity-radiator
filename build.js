var libxmljs = require("libxmljs");
var teamCity = require("./teamcity");
var BuildChange = require("./buildchange");

var _ = require('./underscore');

// Constructor
var Build = function(buildTypeId, name) {
  this.buildTypeId = buildTypeId;
  this.name = name;
};

// properties and methods
Build.prototype = {
  name: "",
  status: "",
  statusText: "",
  number: 0,
  isBroken: false,
  isRunning: false,
  id: 0,
  changes: [],
  percentageComplete: 100,
  buildTypeId: 0,
  timeLeft: 0,
  startDate: '',

  get: function(callback) {
    var requestPath = '/builds?locator=running:all,buildType:(id:' + this.buildTypeId + '),count:1';
    var self = this;

    teamCity.requestXml(requestPath, function(xmlDoc) {
      var buildElem = xmlDoc.get("//build");
      var running = buildElem.attr("running");
      var percentage = buildElem.attr("percentageComplete");
   
      self.status = buildElem.attr("status").value();
      self.number = buildElem.attr("number").value();
      self.isBroken = self.status == "FAILURE" || self.status == "ERROR"
      self.id = buildElem.attr("id").value();
      self.isRunning = false;

      if(running !== null) {
        self.isRunning = running.value() === "true";
      }
      if (percentage != null) {
        self.percentageComplete = parseInt(percentage.value());
      }
      self.getTimeLeft(function(timeLeft) {
        self.timeLeft = timeLeft;
        self.getChanges(function() {
          callback.call(self);
        });
      });
    });
  },

  getTimeLeft: function(callback) {
    self = this;
    teamCity.requestXml("/builds/" + this.id, function(xmlDoc) {
      var runningInfo = xmlDoc.get("//running-info");
      self.statusText = xmlDoc.get("//statusText").text();

      var dateTime = xmlDoc.get("//startDate").text();
      var year = dateTime.substr(0, 4);
      var month = dateTime.substr(4, 2);
      var day = dateTime.substr(6, 2);
      var hour = dateTime.substr(9, 2) - 8; // to PST
      var min = dateTime.substr(11, 2);
      var sec = dateTime.substr(13, 2);

      self.startDate = new Date(year, month, day, hour, min, sec);
      
      if(runningInfo) {
        callback(
          parseInt(runningInfo.attr("estimatedTotalSeconds").value()) - 
          parseInt(runningInfo.attr("elapsedSeconds").value()));
      }
      else {
        callback(0);
      }
    });
  },

  getChanges: function (callback) {
    var self = this;
    if(!self.isBroken) {
      return callback.call(self); // no need to get changes for green build
    }
    self.changes = [];
    teamCity.requestXml("/changes?build=" + self.id, function(xmlDoc) {
      var xmlChanges = xmlDoc.find("//change");

      if(xmlChanges.length == 0) {
        return callback.call(self);
      }
      
      for(var i = 0; i < xmlChanges.length; i++) {
        changeId = xmlChanges[i].attr('id').value();
        (function(it) {
          teamCity.requestXml("/changes/id:" + changeId, function(changeXml) {
            var newChange = new BuildChange(changeXml);
            
            if(!_.chain(self.changes).map(function(c) { return c.userName; }).include(newChange.userName).value()) {
              self.changes.push(newChange);
            }

            if(it == xmlChanges.length - 1) {
              callback.call(self);
            }
          });
        })(i);
      }
    });
  }
};
// node.js module export
module.exports = Build;