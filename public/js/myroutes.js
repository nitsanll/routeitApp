var userRoutes = angular.module('userRoutes', []);

var myRoutes = {}; //contains traveler's 'my routes' html
var myRoutesArr = {}; //contains traveler's 'my routes' array localy
var dailyRoutesArr = {}; //contains traveler's 'daily routes' array localy

userRoutes.controller('RoutesController', ['$scope', '$http', '$compile', function($scope, $http, $compile){
    var userMail = localStorage.getItem("email");
    var routesContent = angular.element(document.querySelector('#content')); 
    $scope.name  = localStorage.getItem("name");
    $scope.img = localStorage.getItem("pic");

    //set the traveler's chosen current route
    $scope.chosenRoute = function(tripId){
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        var currentRoute = JSON.parse(localStorage.getItem("currentRoute"));       
        //if chosen cuurentRoute equal to previous chosen currentRoute
        if(currentRoute.trip_id == tripId){
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    localStorage.setItem("currentRoute", JSON.stringify(myRoutesArr[i]));
                    break;
                }
            }
        }
        //if chosen currentRoute is different from previous chosen currentRoute
        else {
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    localStorage.setItem("currentRoute", JSON.stringify(myRoutesArr[i]));
                    break;
                }
            }
        }
        var updatedCurrentRoute = JSON.parse(localStorage.getItem("currentRoute"));
    }

    //function that shows traveler's 'my routes'
    $scope.showMyRoutes = function(){
        var allMyRoutes = [];
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        //if there the traveler has no routes - set current route to null
        if(myRoutesArr == null || myRoutesArr == "[]" || myRoutesArr.length == 0) {
            angular.element(document.querySelector('#content')).html('<h2 class="noRoutesHead"> לא קיימים מסלולים</h2>');
            localStorage.setItem("currentRoute", null);
        }
        //if there the traveler has routes
        else {
            //building my routes html
            var currentDate = new Date();
            for(var i = (myRoutesArr.length)-1; i>=0; i--){
                var route = '<section class = "route" ng-click="chosenRoute(' + myRoutesArr[i].trip_id + ')" id="route' + myRoutesArr[i].trip_id +'"><img class="routePic" src="images/PIC_TRIP_'+i%6+'.jpg">';
                var cDate = new Date(myRoutesArr[i].creation_date);
                var cDateString = cDate.getDate() + '/' + (cDate.getMonth()+1) + '/' + cDate.getFullYear(); 
                route+='<p class="creationDate"> נוצר ב- '+ cDateString +'</p>';
                if(myRoutesArr[i].disabled_flag == true){
                    route+='<img id="myRoutesDisabledIcon" src="../images/DISABLED.png">';
                }
                route+='<img class="dots" src="../images/DAILY_DOTS.png" ng-click="openIcons('+myRoutesArr[i].trip_id +')"><div class="iconsWrap hidden" id="icons'+ myRoutesArr[i].trip_id +'"><button class = "editBtn"></button> <button class = "deleteBtn" ng-click="deleteRoute(' + myRoutesArr[i].trip_id + ')"></button><button class = "shareBtn"></button></div>'
                + '<section class="dailyPtsDate"><h4 class="tripArea"> אזור ' + myRoutesArr[i].area + '</h4><h3 class = "tripPts">' + myRoutesArr[i].trip_start_pt + ' - ' + myRoutesArr[i].trip_end_pt + '</h3>';
                if(myRoutesArr[i].start_date){
                    var sDate = new Date(myRoutesArr[i].start_date);
                    var sDateString = sDate.getDate() + '/' + (sDate.getMonth()+1) + '/' + sDate.getFullYear(); 
                    var eDate = new Date(myRoutesArr[i].end_date);
                    var eDateString = eDate.getDate() + '/' + (eDate.getMonth()+1) + '/' + eDate.getFullYear();  
                    if(sDateString == eDateString){
                        route += '<p id="tripDates'+i+'" class="tripDates">' + sDateString;
                        if(localStorage.getItem("chosenRoute") != "null"){
                            if(myRoutesArr[i].trip_id == JSON.parse(localStorage.getItem("chosenRoute")).trip_id) {
                               route+='</p><section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';
                            } else {
                                route+='<span id ="closeDates" ng-click="deleteDates('+ myRoutesArr[i].trip_id +')"></span></p>'
                                +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';
                            }
                        } else {
                           route+='<span id ="closeDates" ng-click="deleteDates('+ myRoutesArr[i].trip_id +')"></span></p>'
                            +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';
                        }    
                    } else {
                        if(localStorage.getItem("chosenRoute") != "null"){
                            if(myRoutesArr[i].trip_id == JSON.parse(localStorage.getItem("chosenRoute")).trip_id) {
                                route += '<p class="tripDates" id="tripDates'+i+'">' + eDateString + " - " + sDateString+'</p>'
                                +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';  
                            } else {
                                route += '<p class="tripDates" id="tripDates'+i+'">' + eDateString + " - " + sDateString+'<span id ="closeDates" ng-click="deleteDates('+ myRoutesArr[i].trip_id +')"></span></p>'
                                +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';  
                            }
                        } else {
                            route += '<p class="tripDates" id="tripDates'+i+'">' + eDateString + " - " + sDateString+'<span id ="closeDates" ng-click="deleteDates('+ myRoutesArr[i].trip_id +')"></span></p>'
                            +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';  
                        } 
                    }
                } else {
                    route+='<p id="dates'+i+'" class="tripDates underline" ng-click="addDateInput(2,'+i+')"> עדכן תאריך לטיול </p>'
                    +'<section class="updateDate" id="updateDate'+i+'"><input type="date" ng-model = "date'+i+'" class = "date"> <button class = "dateBtn" ng-click="updateDate(' + myRoutesArr[i].trip_id + ',date' + i + ',' + myRoutesArr[i].days_num + ')"> &#10004; </button></section></section>';
                }
                route += '<div class = "tripDetails">';
                if(myRoutesArr[i].direction == "north") 
                    route+= '<p class = "tripDetail"> כיוון כללי: <br> <b class="detail"> מצפון<br> לדרום </b> </p>';
                else route+= '<p class = "tripDetail">  כיוון כללי: <br> <b class="detail"> מדרום<br> לצפון </b> </p>'; 
                if(myRoutesArr[i].days_num == 1) {
                    route += '<p class = "tripDetail"><b class="detail"><br> טיול יומי </b></p>';
                }
                else {
                    route += '<p class = "tripDetail">מס'+"'"+' ימים: <br><b class="biggerFont">' + myRoutesArr[i].days_num +'</b></p>';
                }
                route += '<p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ ליום: <br><b class="biggerFont">' + myRoutesArr[i].day_km + '</b></p><p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ כולל: <br><b class="biggerFont">' + myRoutesArr[i].trip_km + '</b></p>'
                + '<p class = "tripDetail diffWidth" id="withoutBorder"> רמת קושי: <br><b class="diffDetail">' + myRoutesArr[i].trip_difficulty + '</b></p></div>';     
                var tmpDate = new Date(myRoutesArr[i].start_date);
                if(localStorage.getItem("chosenRoute") != "null"){
                    if(myRoutesArr[i].trip_id == JSON.parse(localStorage.getItem("chosenRoute")).trip_id) {
                        route+='<div class="detailedTripIt"><button id="chosenTripIt" class="tripIt borderLeft" ng-click="goToDaily()"><span class="planImg"></span>&nbsp; בזמן טיול </button><button  id="chosenDetailed" class="tripIt" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>';  
                    } else if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) 
                    && (currentDate.getFullYear() == tmpDate.getFullYear())){
                        route+='<div class="detailedTripIt"><button id="chosenTripIt" class="tripIt borderLeft" ng-click="tripIt(' + myRoutesArr[i].trip_id + ')"><span class="planImg"></span>&nbsp; צא לטיול </button><button  id="chosenDetailed" class="tripIt" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>';
                    } else {
                        route+='<div class="detailedTripIt"><button  id="chosenDetailed" class="onlyDetialed" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>';
                    }
                } else {
                    if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) 
                    && (currentDate.getFullYear() == tmpDate.getFullYear())){
                        route+='<div class="detailedTripIt"><button id="chosenTripIt" class="tripIt borderLeft" ng-click="tripIt(' + myRoutesArr[i].trip_id + ')"><span class="planImg"></span>&nbsp; צא לטיול </button><button  id="chosenDetailed" class="tripIt" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>';
                    } else {
                        route+='<div class="detailedTripIt"><button  id="chosenDetailed" class="onlyDetialed" ng-click="showDetailedPlan()"> לתכנית הטיול </button></div>';
                    }
                }

                route+='<br></section>';
                allMyRoutes+=route;
            }
            myRoutes = allMyRoutes;
            var routesContent = angular.element(document.querySelector('#content'));
            var linkingFunction = $compile(myRoutes);
            var elem = linkingFunction($scope);
            routesContent.html(elem);

            var currentRoute = JSON.parse(localStorage.getItem("currentRoute"));
            if(currentRoute!=null){
                $scope.chosenRoute(currentRoute.trip_id);
            }
        }
    }
    $scope.showMyRoutes();

    //function that deletes a chosen route from traveler's routes
    $scope.deleteRoute = function(tripId){
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        $http.get("https://routeit-ws.herokuapp.com/deleteRoute/" + userMail + "/" + tripId).success(function(routes){
            //delete the route from myRoutesArr and dailyRoutesArr
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    myRoutesArr.splice(i,1);
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                    break;
                }
            }
            for(var i = 0; i<dailyRoutesArr.length; i++){
                if(dailyRoutesArr[i].trip_id == tripId){
                    dailyRoutesArr.splice(i,1);
                    localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                    break;
                }
            }
            //if the route to delete is the current route - set it to null
            var currentRoute = JSON.parse(localStorage.getItem("currentRoute"));
            if(currentRoute!=null){
                if(currentRoute.trip_id == tripId){
                    if(myRoutesArr.length != 0){
                        localStorage.setItem("currentRoute", JSON.stringify(myRoutesArr[0]));   
                    } else localStorage.setItem("currentRoute", null);
                }
            }
            $scope.showMyRoutes();          
        });
    }

    //function that updates a certain trip dates
    $scope.updateDate = function(tripId, date, daysNum){
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        //update the dates in database and in local variables myRoutesArr and dailyRoutesArr
        if(date == null) {}
        else {
            $http.get("https://routeit-ws.herokuapp.com/updateDates/" + userMail + "/" + tripId + "/" + date + "/" + daysNum + "/no/no").success(function(route){
                var updatedTripId;
                for(var i = 0; i<myRoutesArr.length; i++){
                    if(myRoutesArr[i].trip_id == tripId){
                        updatedTripId = i;
                        myRoutesArr[i] = route;
                        localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                        break;
                    }
                }
                if(dailyRoutesArr.length!=0){
                    for(var i = 0; i<dailyRoutesArr.length; i++){
                        if(dailyRoutesArr[i].trip_id == tripId){
                            dailyRoutesArr.splice(i,1);
                            localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                            break;
                        }
                    }
                }
                $scope.showMyRoutes();          
            });
        }
    }

    //function that deletes chosen dates for a certain trip
    $scope.deleteDates = function(tripId){
        myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
        dailyRoutesArr = JSON.parse(localStorage.getItem("dailyRoutes"));
        //update the dates in database and in local variables myRoutesArr and dailyRoutesArr
        $http.get("https://routeit-ws.herokuapp.com/deleteDates/" + userMail + "/" + tripId).success(function(route){
            var updatedTripId;
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    updatedTripId = i;
                    myRoutesArr[i] = route;
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                    break;
                }
            }
            if(dailyRoutesArr.length!=0){
                for(var i = 0; i<dailyRoutesArr.length; i++){
                    if(dailyRoutesArr[i].trip_id == tripId){
                        dailyRoutesArr.splice(i,1);
                        localStorage.setItem("dailyRoutes", JSON.stringify(dailyRoutesArr));
                        break;
                    }
                }
            }
            $scope.showMyRoutes();          
        });
    }

    //show a certain route's detailed plan
    $scope.showDetailedPlan = function(){
        localStorage.setItem("planFlag", "current");
        window.location.assign("https://routeit-app.herokuapp.com/detailedplan.html");
    }

    //function that opens the 'choose date' input for a certain trip
    $scope.addDateInput = function(id, i){
        var datesElement;
        if(id==1) datesElement = angular.element(document.querySelector('#tripDates'+i));
        else datesElement = angular.element(document.querySelector('#dates'+i));
        var updateaDatesElement = angular.element(document.querySelector('#updateDate'+i));
        datesElement.css('display', 'none');
        updateaDatesElement.css('display', 'block');
    }

    //function that sets a certain trip the traveler chose to be the chosen trip to execute
    $scope.tripIt = function(tripId){
        $http.get("https://routeit-ws.herokuapp.com/setChosen/" + userMail + "/" + tripId + "/true").success(function(isUpdated){
            myRoutesArr = JSON.parse(localStorage.getItem("myRoutes"));
            for(var i = 0; i<myRoutesArr.length; i++){
                if(myRoutesArr[i].trip_id == tripId){
                    localStorage.setItem("chosenRoute", JSON.stringify(myRoutesArr[i]));
                    myRoutesArr[i].isChosen = true;
                    localStorage.setItem("myRoutes", JSON.stringify(myRoutesArr));
                    break;
                }
            }
            window.location.assign("https://routeit-app.herokuapp.com/dailyroute.html");
        });
    }

    $scope.isIconsOpen = false;
    //function that toggles between open and close a certain route 'more' menu
    $scope.openIcons = function(tripId){
        var iconsWrap = angular.element(document.querySelector('#icons'+tripId));
        //if the menu is is closed
        if($scope.isIconsOpen == false){
            iconsWrap.removeClass('hidden');
            iconsWrap.addClass('visible');
            iconsWrap.addClass('fadeIn');
            $scope.isIconsOpen = true;
        } 
        //if the menu is open
        else {
            iconsWrap.removeClass('visible');
            iconsWrap.removeClass('fadeIn');
            iconsWrap.addClass('hidden');
            $scope.isIconsOpen = false;
        } 
    }

    //function that sends the traveler to 'daily route' page, if the route it the chosen route in execution time
    $scope.goToDaily = function(){
        window.location.assign("https://routeit-app.herokuapp.com/dailyroute.html");
    }
}]);