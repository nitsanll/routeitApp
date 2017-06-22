var chosenRoutes = angular.module('chosenRoutes', []);

var dailyRoutes = {}; //contains traveler's 'my routes' html
var myRoutesArr = {}; //contains traveler's 'my routes' array localy
var dailyRoutesArr = {}; 

chosenRoutes.controller('chosenRoutesController', ['$scope', '$http', '$compile', function($scope, $http, $compile){
    var userMail = localStorage.getItem("email");
    var routesContent = angular.element(document.querySelector('#content')); 
    $scope.name  = localStorage.getItem("name");
    $scope.img = localStorage.getItem("pic");

    //set the traveler's chosen route
    $scope.chosenRoute = function(tripId){
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        var currentDailyRoute = JSON.parse(localStorage.getItem("currentDailyRoute"));
        
        //if chosen cuurentRoute equal to previous chosen currentRoute
        if(currentDailyRoute.trip_id == tripId){
            /*console.log("the same chosen route");
            var chosenRouteElement = angular.element(document.querySelector('#route'+tripId));
            chosenRouteElement.css('background','yellow');*/
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    console.log("found the chosen route: " + tripId);
                    localStorage.setItem("currentDailyRoute", JSON.stringify(dailyRoutesArr[i]));
                    break;
                }
            }
        }
        //if chosen currentRoute is different from previous chosen currentRoute
        else {
            /*console.log("different route chosen! old route: " + currentDailyRoute.trip_id);
            var oldChosenRouteElement = angular.element(document.querySelector('#route'+currentDailyRoute.trip_id));
            oldChosenRouteElement.css('background','white'); 
            var chosenRouteElement = angular.element(document.querySelector('#route'+tripId));
            chosenRouteElement.css('background','yellow');*/
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    console.log("found the chosen route: " + tripId);
                    localStorage.setItem("currentDailyRoute", JSON.stringify(dailyRoutesArr[i]));
                    break;
                }
            }
        }
        var updatedCurrentDailyRoute = JSON.parse(localStorage.getItem("currentDailyRoute"));
        console.log("chosen tripId: " + updatedCurrentDailyRoute.trip_id + "\n\n");
    }

    //function that shows traveler's 'my routes'
    $scope.showMyRoutes = function(){
        console.log(JSON.parse(localStorage.getItem("currentDailyRoute")));
        var allMyRoutes = [];
        //myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        //building my routes html
        for(var i = 0; i<dailyRoutesArr.length; i++){
            var route = '<section class = "route" ng-click="chosenRoute(' + dailyRoutesArr[i].trip_id + ')" id="route' + dailyRoutesArr[i].trip_id +'"><img class="routePic" src="images/PIC_TRIP_'+i%6+'.jpg">';
            var cDate = new Date(dailyRoutesArr[i].creation_date);
            var cDateString = cDate.getDate() + '/' + (cDate.getMonth()+1) + '/' + cDate.getFullYear(); 
            route+='<p class="creationDate"> נוצר ב- '+ cDateString +'</p>';
            //+'<button class="detailedBtn" ng-click="showDetailedPlan()"></button>'
            //+ '<button class = "dailyShareBtn"></button>';
            if(dailyRoutesArr[i].disabled_flag == true){
                route+='<img id="chosenDisabledIcon" src="../images/DISABLED.png">';
            }
            route+='<img class="dots" src="../images/DOTS.png" ng-click="openIcons('+dailyRoutesArr[i].trip_id +')"><div class="iconsWrap hidden" id="icons'+ dailyRoutesArr[i].trip_id +'"><button class = "editBtn"></button> <button class = "deleteBtn" ng-click="deleteRoute(' + dailyRoutesArr[i].trip_id + ')"></button><button class = "shareBtn"></button></div>'
            +'<section class="dailyPtsDate"><h4 class="tripArea"> אזור ' + dailyRoutesArr[i].area + '</h4><h3 class = "tripPts">' + dailyRoutesArr[i].trip_start_pt + ' - ' + dailyRoutesArr[i].trip_end_pt + '</h3>';
            console.log(dailyRoutesArr[i]);
            if(dailyRoutesArr[i].start_date){
                var sDate = new Date(dailyRoutesArr[i].start_date);
                var sDateString = sDate.getDate() + '/' + (sDate.getMonth()+1) + '/' + sDate.getFullYear(); 
                var eDate = new Date(dailyRoutesArr[i].end_date);
                var eDateString = eDate.getDate() + '/' + (eDate.getMonth()+1) + '/' + eDate.getFullYear(); 
                console.log(dailyRoutesArr[i].start_date + " " + dailyRoutesArr[i].end_date); 
                if(sDateString == eDateString){
                    console.log("start and end dates are equal!");
                    route += '<p id="tripDates'+i+'" class="tripDates">' + sDateString + '</section>';
                } else {
                    route += '<p class="tripDates" id="tripDates'+i+'">' + eDateString + " - " + sDateString + '</section>';  
                }
            }
            route += '<div class = "tripDetails">';
            if(dailyRoutesArr[i].direction == "north") 
                route+= '<p class = "tripDetail"> כיוון כללי: <br> <b class="detail"> מצפון<br> לדרום </b> </p>';
            else route+= '<p class = "tripDetail">  כיוון כללי: <br> <b class="detail"> מדרום<br> לצפון </b> </p>'; 
            if(dailyRoutesArr[i].days_num == 1) {
                route += '<p class = "tripDetail"><b class="detail"><br> טיול יומי </b></p>';
            }
            else {
                route += '<p class = "tripDetail">מס'+"'"+' ימים: <br><b class="biggerFont">' + dailyRoutesArr[i].days_num +'</b></p>';
            }
            route += '<p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ ליום: <br><b class="biggerFont">' + dailyRoutesArr[i].day_km + '</b></p><p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ כולל: <br><b class="biggerFont">' + dailyRoutesArr[i].trip_km + '</b></p>'
            +'<p class = "tripDetail diffWidth" id="withoutBorder"> רמת קושי: <br><b class="diffDetail">' + dailyRoutesArr[i].trip_difficulty + '</b></p></div>'
            //+'<button class = "dailyEditBtn"></button> <button class = "dailyDeleteBtn" ng-click="deleteRoute(' + dailyRoutesArr[i].trip_id + ')"></button>'
            +'<div class="detailedTripIt"><button id="chosenTripIt" class="tripIt borderLeft" ng-click="tripIt(' + dailyRoutesArr[i].trip_id + ')"><span class="planImg"></span>&nbsp; צא לטיול </button><button  id="chosenDetailed" class="tripIt" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>'
            +'<br></section>';
            allMyRoutes+=route;
        }
        dailyRoutes = allMyRoutes;
        var routesContent = angular.element(document.querySelector('#content'));
        var linkingFunction = $compile(dailyRoutes);
        var elem = linkingFunction($scope);
        routesContent.html(elem);

        //show the current route if there is one
        var currentDailyRoute = JSON.parse(localStorage.getItem("currentDailyRoute"));
        console.log("current route is: "+ currentDailyRoute);
        if(currentDailyRoute!=null){
            console.log("calling chosenRoute with current tripId: " + currentDailyRoute.trip_id);
            $scope.chosenRoute(currentDailyRoute.trip_id);
        }
    }
    $scope.showMyRoutes();

    //function that deletes a chosen route from traveler's routes
    $scope.deleteRoute = function(tripId){
        console.log("enter delete!");
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        $http.get("https://routeit-ws.herokuapp.com/deleteRoute/" + userMail + "/" + tripId).success(function(routes){
            //delete the route from myRoutesArr
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    console.log("found the route tripId to delete: " + tripId + ", in array position: " + i);
                    myRoutesArr.splice(i,1);
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                    break;
                }
            }
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    console.log("found the route tripId to delete: " + tripId + ", in array position: " + i);
                    dailyRoutesArr.splice(i,1);
                    localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                    break;
                }
            }
            console.log("deleted");
            //console.log(JSON.parse(localStorage.getItem("myRoutes")));
            //if the route to delete is the current route
            currentDailyRoute = JSON.parse(localStorage.getItem("currentDailyRoute"));
            if(currentDailyRoute!=null){
                if(currentDailyRoute.trip_id == tripId){
                    if(dailyRoutesArr.length != 0){
                        localStorage.setItem("currentDailyRoute", JSON.stringify(dailyRoutesArr[0]));   
                    } else localStorage.setItem("currentDailyRoute", null);
                }
            }
            console.log("my routes: " + myRoutesArr);
            $scope.showMyRoutes();          
        });
    }

    //function that saves the chosen trip and redirect to daily route page
    $scope.tripIt = function(tripId){
        $http.get("https://routeit-ws.herokuapp.com/setChosen/" + userMail + "/" + tripId + "/true").success(function(isUpdated){
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    localStorage.setItem("chosenRoute", JSON.stringify(dailyRoutesArr[i]));
                    dailyRoutesArr[i].isChosen = true;
                    localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                    break;
                }
            }
            myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    myRoutesArr[i].isChosen = true;
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                    break;
                }
            }
            window.location.assign("https://routeit-app.herokuapp.com/dailyroute.html");
        });
    }

    $scope.showDetailedPlan = function(){
        localStorage.setItem("planFlag", "currentDaily");
        window.location.assign("https://routeit-app.herokuapp.com/detailedplan.html");
    }

    $scope.isIconsOpen = false;
    $scope.openIcons = function(tripId){
        var iconsWrap = angular.element(document.querySelector('#icons'+tripId));
        //if the overview is is closed
        if($scope.isIconsOpen == false){
            iconsWrap.removeClass('hidden');
            iconsWrap.addClass('visible');
            iconsWrap.addClass('fadeIn');
            $scope.isIconsOpen = true;
        } 
        //if the overview is open
        else {
            iconsWrap.removeClass('visible');
            iconsWrap.removeClass('fadeIn');
            iconsWrap.addClass('hidden');
            $scope.isIconsOpen = false;
        } 
    }
}]);