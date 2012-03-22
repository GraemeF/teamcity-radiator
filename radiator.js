exports.requestData = function(buildArray, callback) {
  var index = -1;

  var parseBuilds = function(callback) {
    index++;
    var fn;

    if(index >= buildArray.length) return;

    if(index < buildArray.length - 1) {
      fn = function() { parseBuilds(callback); };
    }
    else {
      fn = callback;
    }

    if(index < buildArray.length) {
      buildArray[index].get(fn);
    }
  };

  parseBuilds(callback);
};