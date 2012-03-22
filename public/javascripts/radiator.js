(function() {
  $(function() {
    var failure = new Audio("/audio/lasier.mp3");
    var success = new Audio("/audio/woohoo.mp3");

    var startBuild = function(build) {
      console.log("Build started: " + build.buildFullName);
    };

    var changeBuildStatus = function(build) {
      console.log("Build changed: " + build.buildFullName + " - " + build.buildResult);
    };

    var finishBuild = function(build) {
      var buildDiv = $("." + build.buildTypeId);
      buildDiv.find(".percentage").hide();

      if(build.buildResult == 'failure') {
        buildDiv.removeClass("green").addClass("red");
        failure.play();
      }
      else if(build.buildResult == 'success') {
        buildDiv.removeClass("red").addClass("green");
        success.play();
      }
    };

    setTimeout(function(){
      window.location.reload();
    }, 180000); //refresh every 3 minutes

    $(".percentage").each(function() {
      $(this).animate({
        width: "100%"
      }, parseInt($(this).attr("data-seconds-left")) * 1000, 'linear');
    });

    now.receiveBuildEvent = function(build){
      switch(build.notifyType) {
        case "buildStarted":
          startBuild(build);
          break;
        case "statusChanged":
          changeBuildStatus(build);
          break;
        case "buildFinished":
          finishBuild(build);
          break;
      }
    }
  });
})();