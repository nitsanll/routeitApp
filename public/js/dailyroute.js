var dailyRoute = angular.module('dailyRoute', []);

dailyRoute.controller('dailyController', ['$scope', '$http', '$compile', function($scope, $http, $compile){    
    var userMail = localStorage.getItem("email");
    var myRoutes = localStorage.getItem("myRoutes");
    var chosenRoute = localStorage.getItem("chosenRoute");
    $scope.name =  localStorage.getItem("name");
    $scope.img = localStorage.getItem("pic");
    var currentDate = new Date(); //today's trip date
    var currentDateStr = currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();
    var currentWeekDay = currentDate.getDay();
    var daysArr = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
    var currentDayStr = daysArr[currentWeekDay];
    var noRoutesContent = '<div id = "map"></div><div id="dayHeadlineDiv"></div><h1 id="dayHeadline">' + currentDayStr + ', ' + currentDateStr + '</h1><div id="noRoutesDiv"></div><p id="noRoutes"> אין מסלול מתוכנן עבור יום זה </p><a id="newRouteBtn" href="https://routeit-app.herokuapp.com/routeform.html">תכנן <br> מסלול <br> חדש</a>';
    var htmlContent;
    var dailyContent = angular.element(document.querySelector('#dailyContent'));

    //if the user has no routes
    if(myRoutes == "[]" || myRoutes == null || myRoutes == "null"){
        dailyContent.html(noRoutesContent);
    }
    //if the user has routes
    else {
        chosenRoute = localStorage.getItem("chosenRoute");
        //if there is a chosen route for the day 
        var isFinished = true;
        if(chosenRoute != "null"){
            chosenRoute = JSON.parse(localStorage.getItem("chosenRoute")); //getting the current route
            //serching the current day
            for(var i = 0; i< chosenRoute.daily_sections.length; i++){
                var tmpDate = new Date(chosenRoute.daily_sections[i].date);
                if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) 
                    && (currentDate.getFullYear() == tmpDate.getFullYear())){ 
                    var start = chosenRoute.daily_sections[i].start_pt;
                    var end = chosenRoute.daily_sections[i].end_pt;
                    var duration = chosenRoute.daily_sections[i].duration;
                    var diff = chosenRoute.daily_sections[i].difficulty;
                    var dayNum = chosenRoute.daily_sections[i].day_num;
                    var dayKm = chosenRoute.daily_sections[i].total_km;
                    var daysNum = chosenRoute.days_num;
                    htmlContent = '<div id = "map"></div><div id="detailedHeadlineDiv"></div><h1 id="detailedHeadline">'+ start + ' - ' + end +'</h1>'
                    +'<h1 id="detailedDate">' + currentDayStr + ', ' + currentDateStr + '</h1>'
                    +'<div id="dotsWrap"><img class="dailyDots" src="../images/DAILY_DOTS.png" ng-click="openIcons()"></div><div class="dailyIconsWrap"><button class="dailyDetailedBtn" ng-click="showDetailedPlan()"> לתכנית <br> הטיול </button><button class="endTrip" ng-click="endTrip()"> הפסק טיול </button><button id="addAlert" ng-click="showAlert()"> הוסף התראה </button></div>';
                    //if the traveler didn't choose accommodation
                    if(chosenRoute.daily_sections[i].chosen_accomm == null) {
                        var accommName = "לא נבחר מקום לינה ליום זה";
                        var accommPhone = "";
                        //if the traveler chose accommodation
                    } else {
                        var accommName = chosenRoute.daily_sections[i].chosen_accomm.accomm_name;
                        var accommPhone = chosenRoute.daily_sections[i].chosen_accomm.phone;
                    }
                    var descriptionArr = [];
                    var alertsArr = [];
                    htmlContent+='<img src="images/OPEN1.png" id="openDailyDetails" ng-click="toggleDailyDetails('+ true +')"><img src="images/CLOSE1.png" id="closeDailyDetails" ng-click="toggleDailyDetails('+ false +')"><div id="dailyTripDetails">';       
                    if(daysNum > 1) {
                       htmlContent += '<p id="dailyDayNum" class="dailyTripDetail"><b> יום ' + dayNum + '<br> מתוך ' + daysNum + '<br> ימי טיול</b></p>'; 
                    }
                    else {
                        htmlContent += '<p id="dailyDayNum" class="dailyTripDetail"><b> טיול יומי </b></p>'; 
                    }
                    htmlContent+='<p id="dailyDesc" class="dailyTripDetail"><b> מאפייני המסלול: </b><br>';
                    for(var j=0; j<chosenRoute.daily_sections[i].description.length; j++){
                        if(j==(chosenRoute.daily_sections[i].description.length)-1){
                            htmlContent += chosenRoute.daily_sections[i].description[j] +'</p>';
                        } else {
                            htmlContent += chosenRoute.daily_sections[i].description[j] + ', ';
                        }
                    }
                    htmlContent+='<p id="dailyDiff" class="dailyTripDetail"> <b> רמת קושי: </b><br>' + diff + '</p>'
                    +'<p class="dailyTripDetail" id="dailyDuration"><b> משך: </b><br>' + duration + ' שעות <br><br><b> מס'+"'"+ ' ק"מ: </b><br>' + dayKm +'</p><div class="clear"></div></div>';
                    var linkingFunction = $compile(htmlContent);
                    var elem = linkingFunction($scope);
                    dailyContent.html(elem);
                    isFinished = false;
                    break;
                } else {
                    isFinished = true; //the trip has ended
                }
            }
            //the trip has ended
            if(isFinished == true){
                localStorage.setItem("chosenRoute", null);
                myRoutes = JSON.parse(localStorage.getItem("myRoutes"));
                //delete the route from travelre's 'my routes'
                $http.get("https://routeit-ws.herokuapp.com/deleteRoute/" + userMail + "/" + chosenRoute.trip_id).success(function(routes){
                    //delete the route from myRoutesArr
                    for(var i = 0; i<myRoutes.length; i++){
                        if(myRoutes[i].trip_id == chosenRoute.trip_id){
                            myRoutes.splice(i,1);
                            localStorage.setItem("myRoutes", JSON.stringify(myRoutes));
                            break;
                        }
                    }
                    var routeStr = chosenRoute.trip_id + "," + chosenRoute.area + "," + chosenRoute.direction +"," + chosenRoute.creation_date +"," + chosenRoute.trip_start_pt +"," + chosenRoute.trip_end_pt +"," + chosenRoute.start_date +"," + chosenRoute.end_date +"," + chosenRoute.days_num +"," + chosenRoute.trip_km +"," + chosenRoute.day_km + "," + chosenRoute.trip_difficulty;
                    //save route to traveler's 'routes history'
                    $http.get("https://routeit-ws.herokuapp.com/addPrevRoute/" + userMail + "/" + routeStr).success(function(routes){  
                    });
                });
            }
        } else {
            //check if there are trips for the current day  
            var myRoutes = JSON.parse(localStorage.getItem("myRoutes"));
            var dailyRoutesArr = [];
            for(var i = 0; i<myRoutes.length; i++){
                var tmpDate = new Date(myRoutes[i].start_date);
                if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) 
                    && (currentDate.getFullYear() == tmpDate.getFullYear())){
                    dailyRoutesArr.push(myRoutes[i]);
                }
            }
            localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
            //if the user has no routes starts on the current day
            if(dailyRoutesArr.length == 0){
                dailyContent.html(noRoutesContent);
            }
            //if the user has routes for the curret day that weren't chosen yet
            else {
                localStorage.setItem("currentDailyRoute", JSON.stringify(dailyRoutesArr[0]));
                htmlContent = '<div id = "map"></div><div id="dayHeadlineDiv"></div><h1 id="dayHeadline">' + currentDayStr + ', ' + currentDateStr + '</h1>' +
                '<a id="routesExist" href="https://routeit-app.herokuapp.com/chosenroutes.html"> קיים/ים מסלול/ים עבור יום זה &nbsp;&nbsp;&nbsp; >> </a>';
                dailyContent.html(htmlContent);
            }
        }
    }

    //show current route's detailed plan
    $scope.showDetailedPlan = function(){
        localStorage.setItem("planFlag", "chosen");
        window.location.assign("https://routeit-app.herokuapp.com/detailedplan.html");
    }

    //end the current trip
    $scope.endTrip = function(){
        var popupElement = angular.element(document.querySelector('#endPopup'));
        popupElement.addClass("show"); 
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");  
    }

    //choose to stay in the endtrip popup - stay on the current trip
    $scope.stay = function(){
        var popupElement = angular.element(document.querySelector('#endPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }

    //choose to stop in the endtrip popup - stop the current trip
    $scope.stop = function(){
        var tripId = JSON.parse(localStorage.getItem("chosenRoute")).trip_id;
        //set chosen route to false
        $http.get("https://routeit-ws.herokuapp.com/setChosen/" + userMail + "/" + tripId + "/false").success(function(isUpdated){
            localStorage.setItem("chosenRoute", null);
            var dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
            //set the route "isChosen" flag to false localy
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    dailyRoutesArr[i].isChosen = false;
                    localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                    break;
                }
            }
            myRoutes = JSON.parse(localStorage.getItem("myRoutes"));
            for(var i = 0; i<myRoutes.length; i++){
                if(myRoutes[i].trip_id == tripId){
                    myRoutes[i].isChosen = false;
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutes));
                    break;
                }
            }
            location.reload();
        });
    }

    //show 'add alert' popup
    $scope.showAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.addClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");
        var alertTextElement = angular.element(document.querySelector('#alertText'));
        $scope.alertText ='';
    }

    //cancel 'add alert' popup
    $scope.stopAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }

    //"send" the alert
    $scope.addAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.removeClass("show");
        var popupElement = angular.element(document.querySelector('#sendAlertPopup'));
        popupElement.addClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");
    }

    //closing the 'your alert has been sent succesfuly' popup
    $scope.closePopup =function(){
        var popupElement = angular.element(document.querySelector('#sendAlertPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }

    //open the 'more' menu
    $scope.openIcons = function(){
        var iconsWrap = angular.element(document.querySelector('.dailyIconsWrap'));
        iconsWrap.slideToggle("slow");
    }

    //toggle between open and close the bottom daily details bar
    $scope.toggleDailyDetails = function(isOpen){
        var closeButton = angular.element(document.querySelector('#closeDailyDetails'));
        var openButton = angular.element(document.querySelector('#openDailyDetails'));
        if(isOpen == false){   
            closeButton.fadeOut();
            openButton.fadeIn();  
        } else {
            closeButton.fadeIn();
            openButton.fadeOut();  
        }
        var dailyDetailsWrap = angular.element(document.querySelector('#dailyTripDetails'));
        dailyDetailsWrap.slideToggle("slow");
    }
}]);