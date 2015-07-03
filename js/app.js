angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });


var app = angular.module("compwnentApp", ['firebase', 'ngRoute', 'filters']);

	app.controller("compwnentCtrl", ['$scope', '$firebaseArray', '$firebaseAuth', '$location', '$rootScope', function($scope, $firebaseArray, $firebaseAuth, $location, $rootScope){
		var ref = new Firebase("https://compwnents.firebaseio.com/");

		$scope.compwnents = $firebaseArray(ref);
		$scope.compName = "";
		$scope.compType = "";
		$scope.compTypeImg = "img/html5Png.png";
    $scope.compHeadingColor = "";
		$scope.compDemo = "";
		$scope.compDocs = "";
		$scope.compDesc = "";
		$scope.compExamples = "";
		$scope.compPic = "";
		$scope.compPaid = false;
		$scope.compPrice = "";
    $scope.userName = "";
    $scope.passWord = "";

    $scope.deleteCompwnent = function(e) {
      var item = $scope.compwnents[this.comp];
      $scope.compwnents.$remove(item).then(function(ref) {
        ref.key() === item.$id;
      });
    }


    $scope.submitUpVote = function(e){
      var theIndex = $scope.compwnents.indexOf(this.comp);
      var item = $scope.compwnents;
      $scope.compwnents[theIndex].upVotes += 1;
      item.$save(theIndex).then(function(ref){
        ref.key() === item[theIndex].$id;
      })
    }

    $scope.submitDownVote = function(e){
      var theIndex = $scope.compwnents.indexOf(this.comp);
      var item = $scope.compwnents;
      $scope.compwnents[theIndex].upVotes -= 1;
      item.$save(theIndex).then(function(ref){
        ref.key() === item[theIndex].$id;
      })
    }

    $scope.loginNow = function() {
      ref.authWithPassword({
        email : $scope.userName,
        password : $scope.passWord
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $location.path("/");
          $rootScope.loggedin = true;
          $rootScope.displayName = authData.password.email;
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    }
  




		$scope.checkTypeImg = function(){
			if($scope.compType == "HTML5") {
				$scope.compTypeImg = "img/html5Png.png";
			}
			if($scope.compType == "CSS") {
				$scope.compTypeImg = "img/css3Png.png";
			}
			if($scope.compType == "Bootstrap") {
				$scope.compTypeImg = "img/bootstraPng.png";
			}
			if($scope.compType == "Foundation") {
				$scope.compTypeImg = "img/foundationPng.svg";
			}
			if($scope.compType == "Javascript") {
				$scope.compTypeImg = "img/javascriptPng.png";
			}
		}


    $scope.checkTypeColor = function(){
      if($scope.compType == "HTML5") {
        $scope.compHeadingColor = "#E44D26";
      }
      if($scope.compType == "CSS") {
        $scope.compHeadingColor = "#0170BA";
      }
      if($scope.compType == "Bootstrap") {
        $scope.compHeadingColor = "#50244A";
      }
      if($scope.compType == "Foundation") {
        $scope.compHeadingColor = "#29A9DF";
      }
      if($scope.compType == "Javascript") {
        $scope.compHeadingColor = "#F0BB1C";
      }
    }

          $scope.addMessage = function(e) {

				//Send compwnent
            	$scope.compwnents.$add({ 
              					compName: $scope.compName, 
              					compType: $scope.compType, 
              					compTypeImg: $scope.compTypeImg, 
              					compDemo: $scope.compDemo, 
              					compDocs: $scope.compDocs, 
              					compDesc: $scope.compDesc, 
              					compExamples: $scope.compExamples, 
              					compPic: $scope.compPic, 
              					compPaid: $scope.compPaid, 
              					compPrice: $scope.compPrice,
                        compHeadingColor: $scope.compHeadingColor
              });

				//Reset compwnent
				$scope.compwnents = $firebaseArray(ref);
				$scope.compName = "";
				$scope.compType = "";
				$scope.compTypeImg = "";
				$scope.compDemo = "";
				$scope.compDocs = "";
				$scope.compDesc = "";
				$scope.compExamples = "";
				$scope.compPic = "";
				$scope.compPaid = false;
				$scope.compPrice = "";
          };

          $scope.filterTypeJavascript = function(compType) {
          	if(compType === "Javascript") {
          		return true
          	} else {
          		return false
          	}
          }
          $scope.filterTypeHtml = function(compType) {
          	if(compType === "HTML5") {
          		return true
          	} else {
          		return false
          	}
          }
          $scope.filterTypeCss = function(compType) {
          	if(compType === "CSS") {
          		return true
          	} else {
          		return false
          	}
          }
          $scope.filterTypeBootstrap = function(compType) {
          	if(compType === "Bootstrap") {
          		return true
          	} else {
          		return false
          	}
          }
          $scope.filterTypeFoundation = function(compType) {
          	if(compType === "Foundation") {
          		return true
          	} else {
          		return false
          	}
          }


          var ress = new Firebase("https://compwnentusers.firebaseio.com/");
          var auth = $firebaseAuth(ress);

          auth.$onAuth(function(authData){
            $scope.authData = authData;
            if($scope.authData) {
              $rootScope.loggedin = true;


              //Saves state for displayName
              if(authData.twitter) {
                $rootScope.displayName = authData.twitter.displayName;
                $rootScope.username = authData.twitter.username;
                $rootScope.email = false;
                $rootScope.htmlurl = "https://twitter.com/" + $rootScope.username;
                $rootScope.description = authData.twitter.cachedUserProfile.description;
                $rootScope.location = authData.twitter.cachedUserProfile.location;
                if($rootScope.displayName === "Chris Pena") {
                $rootScope.avatar = "https://pbs.twimg.com/profile_images/616883704464453632/R7FVewV4_400x400.jpg";
                } else {
                  $rootScope.avatar = authData.twitter.cachedUserProfile.profile_image_url;
                }
                $rootScope.accountType = "twitter";
                $rootScope.titleColor = "#55acee";

                $scope.tweetName = authData.twitter.cachedUserProfile.status.in_reply_to_screen_name;
                $scope.tweetContent = authData.twitter.cachedUserProfile.status.text;
              }

              if(authData.github) {
                $rootScope.displayName = authData.github.displayName;
                $rootScope.email = authData.github.cachedUserProfile.email;
                $rootScope.avatar = authData.github.cachedUserProfile.avatar_url;
                $rootScope.htmlurl = authData.github.cachedUserProfile.html_url;
                $rootScope.location = authData.github.cachedUserProfile.location;
                $rootScope.username = authData.github.username;
                $rootScope.accountType = "github"
                $rootScope.titleColor = "#444";
                $rootScope.description = false;


              }
              if(authData.facebook) {
                $rootScope.displayName = authData.facebook.displayName;
                $rootScope.htmlurl = authData.facebook.cachedUserProfile.link;
                $rootScope.accountType = "facebook"
                $rootScope.avatar = authData.facebook.cachedUserProfile.picture.data.url;
                $rootScope.username = authData.facebook.displayName;
                $rootScope.email = false;
                $rootScope.location = false;
                $rootScope.titleColor = "#3b5998";
                $rootScope.description = false;
              }

            }
            console.log(authData);
          });
          
          $scope.twitterLogin = function (){
          auth.$authWithOAuthPopup("twitter").then(function(authData) {
              console.log("Logged in as:", authData);
              $location.path("/");
              $rootScope.loggedin = true;
              $rootScope.displayName = authData.twitter.displayName;
            }).catch(function(error) {
              console.log("Authentication failed:", error);
            });
          }

          $scope.githubLogin = function (){
          auth.$authWithOAuthPopup("github").then(function(authData) {
              console.log("Logged in as:", authData);
              $location.path("/");
              $rootScope.loggedin = true;
              $rootScope.displayName = authData.github.displayName;
            }).catch(function(error) {
              console.log("Authentication failed:", error);
            });
          }

          $scope.facebookLogin = function (){
          auth.$authWithOAuthPopup("facebook").then(function(authData) {
              console.log("Logged in as:", authData);
              $location.path("/");
              $rootScope.loggedin = true;
              $rootScope.displayName = authData.facebook.displayName;
            }).catch(function(error) {
              console.log("Authentication failed:", error);
            });
          }

          $rootScope.logout = function() {
            auth.$unauth();
            $rootScope.loggedin = false;
            $location.path("/");
          }



	}]);

$('#example').popover(options)






