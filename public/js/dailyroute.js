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
    
    console.log(myRoutes);
    //if the user has no routes
    if(myRoutes == "[]" || myRoutes == null || myRoutes == "null"){
        console.log("there are no routes");
        dailyContent.html(noRoutesContent);
    }
    //if the user has routes
    else {
        chosenRoute = JSON.parse(localStorage.getItem("chosenRoute"));
        //if there is a chosen route for the day 
        console.log(chosenRoute);
        if(chosenRoute != "null" || chosenRoute != null || chosenRoute != ""){
            console.log("there is a chosen route planned for today");
            chosenRoute = JSON.parse(localStorage.getItem("chosenRoute")); //getting the current route
            //htmlContent ="";
            console.log(chosenRoute.daily_sections.length);
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
                    var daysNum = chosenRoute.days_num;
                    htmlContent = '<div id = "map"></div><div id="detailedHeadlineDiv"></div><h1 id="detailedHeadline">'+ start + ' - ' + end +'</h1>'
                    +'<h1 id="detailedDate">' + currentDayStr + ', ' + currentDateStr + '</h1>';
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
                    htmlContent+='<div id="dailyTripDetails">';       
                    if(daysNum > 1) {
                       htmlContent += '<p id="dailyDayNum" class="dailyTripDetail"><b> יום ' + dayNum + ' מתוך ' + daysNum + '<br> ימי טיול</b><button class="dailyDetailedBtn" ng-click="showDetailedPlan()"> לתכנית הטיול </button></p>'; 
                    }
                    else {
                        htmlContent += '<p id="dailyDaysNum" class="dailyTripDetail"><b> טיול יומי </b></p>'; 
                    }
                    htmlContent+='<p id="dailyDesc" class="dailyTripDetail"><b> מאפייני המסלול: </b><br>';
                    for(var j=0; j<chosenRoute.daily_sections[i].description.length; j++){
                        console.log(chosenRoute.daily_sections[i].description[j]);
                        if(j==(chosenRoute.daily_sections[i].description.length)-1){
                            htmlContent += chosenRoute.daily_sections[i].description[j] +'</p>';
                        } else {
                            htmlContent += chosenRoute.daily_sections[i].description[j] + ', ';
                        }
                    }
                    htmlContent+='<p id="dailyDiff" class="dailyTripDetail"> <b> רמת קושי: </b><br>' + diff + '</p>'
                    +'<p class="dailyTripDetail" id="dailyDuration"> <b> משך המסלול: </b><br>' + duration + ' שעות<br><button class="endTrip" ng-click="endTrip()"> הפסק טיול </button></p>'
                    +'<p class="dailyTripDetail" id="dailyAlert" ng-click="showAlert()"><img src="images/ADD_ALERT.png"><br><span id="appendAlert"> הוסף התראה </span></p><div class="clear"></div></div>';
                    console.log(htmlContent);
                    var linkingFunction = $compile(htmlContent);
                    var elem = linkingFunction($scope);
                    dailyContent.html(elem);
                }
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
                console.log("there are no routes starts on this date");
                dailyContent.html(noRoutesContent);
            }
            //if the user has routes for the curret day that weren't chosen yet
            else {
                localStorage.setItem("currentDailyRoute", JSON.stringify(dailyRoutesArr[0]));
                console.log("there are routes planned for today");
                htmlContent = '<div id = "map"></div><div id="dayHeadlineDiv"></div><h1 id="dayHeadline">' + currentDayStr + ', ' + currentDateStr + '</h1>' +
                '<a id="routesExist" href="https://routeit-app.herokuapp.com/chosenroutes.html"> קיים/ים מסלול/ים עבור יום זה &nbsp;&nbsp;&nbsp; >> </a>';
                dailyContent.html(htmlContent);
            }
        }
    }

    $scope.showDetailedPlan = function(){
        localStorage.setItem("planFlag", "chosen");
        window.location.assign("https://routeit-app.herokuapp.com/detailedplan.html");
    }

    $scope.endTrip = function(){
        var popupElement = angular.element(document.querySelector('#endPopup'));
        popupElement.addClass("show"); 
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");  
    }

    $scope.stay = function(){
        var popupElement = angular.element(document.querySelector('#endPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }

    $scope.stop = function(){
        localStorage.setItem("chosenRoute", null);
        location.reload();
    }

    $scope.showAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.addClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");
        var alertTextElement = angular.element(document.querySelector('#alertText'));
        $scope.alertText ='';
    }

    $scope.stopAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }

    $scope.addAlert = function(){
        var popupElement = angular.element(document.querySelector('#alertPopup'));
        popupElement.removeClass("show");
        var popupElement = angular.element(document.querySelector('#sendAlertPopup'));
        popupElement.addClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.addClass("pageMask");
    }

    $scope.closePopup =function(){
        var popupElement = angular.element(document.querySelector('#sendAlertPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }
}]);