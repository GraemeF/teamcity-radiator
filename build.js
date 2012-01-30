var libxmljs = require("libxmljs");
var teamCity = require("./teamcity");
var BuildChange = require("./buildchange");

// Constructor
var Build = function(buildTypeId, name) {
  this.buildTypeId = buildTypeId;
  this.name = name;
};

// properties and methods
Build.prototype = {
  name: "",
  status: "",
  number: 0,
  isBroken: false,
  isRunning: false,
  id: 0,
  changes: [],
  percentageComplete: 100,
  buildTypeId: 0,
  timeLeft: 0,

  get: function(callback) {
    var self = this;
    var requestPath = '/builds?locator=running:all,buildType:(id:' + self.buildTypeId + '),count:1';

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
        self.isRunning = running.value === "true";
      }
      if (percentage != null) {
        self.percentageComplete = parseInt(percentage.value());
      }
      if (self.isRunning) {
        self.getTimeLeft(function(timeLeft) {
          self.timeLeft = timeLeft;
          self.getChanges(function() {
            callback.call(self);
          });
        });
      }
      else {
        self.getChanges(function() {
          callback.call(self);
        });
      }
    });
  },

  getTimeLeft: function(callback) {
    teamCity.requestXml("/builds/" + this.id, function(xmlDoc) {
      var runningInfo = xmlDoc.find("//running-info");

      callback(parseInt(runningInfo.attr("estimatedTotalSeconds").value) - 
        parseInt(runningInfo.attr("elapsedSeconds").value));
    });
  },

  getChanges: function (callback) {
    var self = this;
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
            self.changes.push(new BuildChange(changeXml));

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