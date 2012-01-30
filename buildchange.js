require('./inflections');

var BuildChange = function(xmlDoc) {
  this.comment = xmlDoc.get("//comment").text().capitalize();
  this.userName = xmlDoc.root().attr("username").value().titleize();
  this.avatar = this.avatarsMap[this.userName];
};

// properties and methods
BuildChange.prototype = {
  comment: "",
  userName: "",
  avatarsMap: { 
    "Elad": "elad.png",
    "Elad Ossadon": "elad.png",
    "Avi Tzurel": "avi.png",
    "Felipe Lima": "felipe.png",
    "felipecsl": "felipe.png",
    "Eduardo Sasso": "eduardo.png",
    "Rodrigo Soares": "rodrigo.png",
    "Steve Mui": "steve.png",
    "smui": "steve.png",
    "Dave Ward": "dave.png",
    "Emon Tjokro": "emon.png"
  }
};

// node.js module export
module.exports = BuildChange;