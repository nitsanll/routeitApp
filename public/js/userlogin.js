var login = angular.module('login', []);

login.controller('UserController', ['$scope','$http', function($scope, $http){
    var name, image, email;

    //function that gets the current registered user information from google+
    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        name = profile.getName();
        localStorage.setItem("name", name); //saving the user's name
        image = profile.getImageUrl();
        localStorage.setItem("pic", image); //saving the user's picture
        var newchar = '*';
        image = image.split('/').join(newchar);
        email = profile.getEmail();
        localStorage.setItem("email", email); //saving the user's email 

        var url = "https://routeit-ws.herokuapp.com/createTraveler/" + email +"/" + name + "/" + image;
        $http.get(url).success(function(data){
            if(data == "userExists") {
                $http.get("https://routeit-ws.herokuapp.com/getIdCounter/" + email).success(function(data){
                    localStorage.setItem("idCounter", 0);
                    console.log(data);
                    window.location.assign("https://routeit-app.herokuapp.com/dailyroute.html");
                });
            }
            else {
                localStorage.setItem("idCounter", 0);
                localStorage.setItem("currentRoute", null);
                localStorage.setItem("chosenRoute", null);
                localStorage.setItem("myRoutes", null);
                localStorage.setItem("dailyRoutes", null);
                localStorage.setItem("currentDailyRoute", null);
                window.location.assign("https://routeit-app.herokuapp.com/dailyroute.html");
            } 
        });
    }

    window.onSignIn = onSignIn;
}]);

