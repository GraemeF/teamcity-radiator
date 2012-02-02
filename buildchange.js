require('./inflections');

var BuildChange = function(xmlDoc) {
  this.comment = xmlDoc.get("//comment").text().capitalize();
  this.userName = xmlDoc.root().attr("username").value().titleize();
  this.avatar = this.avatarsMap[this.userName.toLowerCase()] || (this.userName + ".png");
};

// properties and methods
BuildChange.prototype = {
  comment: "",
  userName: "",
  avatarsMap: { 
    "elad": "elad.png",
    "elad ossadon": "elad.png",
    "avi tzurel": "avi.png",
    "felipe lima": "felipe.png",
    "felipecsl": "felipe.png",
    "eduardo sasso": "eduardo.png",
    "rodrigo soares": "rodrigo.png",
    "steve mui": "steve.png",
    "smui": "steve.png",
    "dave ward": "dave.png",
    "emon tjokro": "emon.png"
  }
};

// node.js module export
module.exports = BuildChange;