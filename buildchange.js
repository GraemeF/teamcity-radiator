var BuildChange = function(xmlDoc) {
  this.comment = xmlDoc.get("//comment").text();
  this.userName = xmlDoc.root().attr("username").value();
};

// properties and methods
BuildChange.prototype = {
  comment: "",
  userName: ""
};

// node.js module export
module.exports = BuildChange;