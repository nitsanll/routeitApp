var routesHistory = angular.module('routesHistory', []);

var prevRoutesArr = [];
var userMail = localStorage.getItem("email");

routesHistory.run(function($rootScope ,$http) { 
    //getting traveler's routes history
    $http.get("https://routeit-ws.herokuapp.com/getPrevRoutes/" + userMail).success(function(prevRoutes){
        prevRoutesArr = prevRoutes.previous_routes;
        $rootScope.$broadcast('init');
    });   
});

routesHistory.controller('RoutesHistoryController', ['$rootScope', '$scope', '$http', '$compile', function($rootScope, $scope, $http, $compile){
    var routesContent = angular.element(document.querySelector('#content')); 
    function init(){
        //get user profile details
        $scope.name  = localStorage.getItem("name");
        $scope.img = localStorage.getItem("pic");
        $scope.showRoutesHistory();
    }

    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });

    //function that shows traveler's 'routes history'
    $scope.showRoutesHistory = function(){
        var allPrevRoutes = [];
        if(prevRoutesArr.length == 0) {
             angular.element(document.querySelector('#content')).html('<h2 class="noRoutesHead"> לא קיימים מסלולים</h2>');
        } else {
            for(var i = 0; i<prevRoutesArr.length; i++){
                var route = '<section class = "route"><img class="routePic" src="images/PIC_TRIP_'+i%6+'.jpg">';
                var cDate = new Date(prevRoutesArr[i].creation_date);
                var cDateString = cDate.getDate() + '/' + (cDate.getMonth()+1) + '/' + cDate.getFullYear(); 
                route+='<p class="creationDate"> נוצר ב- '+ cDateString +'</p>'
                +'<section class="ptsDate"><h4 class="tripArea"> אזור ' + prevRoutesArr[i].area + '</h4><h3 class = "tripPts">' + prevRoutesArr[i].trip_start_pt + ' - ' + prevRoutesArr[i].trip_end_pt + '</h3>';
                if(prevRoutesArr[i].start_date){
                    var sDate = new Date(prevRoutesArr[i].start_date);
                    var sDateString = sDate.getDate() + '/' + (sDate.getMonth()+1) + '/' + sDate.getFullYear(); 
                    var eDate = new Date(prevRoutesArr[i].end_date);
                    var eDateString = eDate.getDate() + '/' + (eDate.getMonth()+1) + '/' + eDate.getFullYear();   
                    if(sDateString == eDateString){
                        route += '<p id="tripDates'+i+'" class="tripDates">' + sDateString + '</section>';
                    } else {
                        route += '<p class="tripDates" id="tripDates'+i+'">' + eDateString + " - " + sDateString + '</section>';  
                    }
                }
                route += '<div class = "tripDetails">';
                if(prevRoutesArr[i].direction == "north") 
                    route+= '<p class = "tripDetail"> כיוון כללי: <br> <b class="detail"> מצפון<br> לדרום </b> </p>';
                else route+= '<p class = "tripDetail">  כיוון כללי: <br> <b class="detail"> מדרום<br> לצפון </b> </p>'; 
                if(prevRoutesArr[i].days_num == 1) {
                    route += '<p class = "tripDetail"><b class="detail"><br> טיול יומי </b></p>';
                }
                else {
                    route += '<p class = "tripDetail">מס'+"'"+' ימים: <br><b class="biggerFont">' + prevRoutesArr[i].days_num +'</b></p>';
                }
                route += '<p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ ליום: <br><b class="biggerFont">' + prevRoutesArr[i].day_km + '</b></p><p class = "tripDetail biggerWidth"> מס'+"'"+' ק"מ כולל: <br><b class="biggerFont">' + prevRoutesArr[i].trip_km + '</b></p>'
                +'<p class = "tripDetail diffWidth" id="withoutBorder"> רמת קושי: <br><b class="diffDetail">' + prevRoutesArr[i].trip_difficulty + '</b></p></div>'
                +'<button class = "historyDeleteBtn" ng-click="deletePrevRoute(' + prevRoutesArr[i].trip_id + ')"></button><br></section>';
                allPrevRoutes+=route;
            }
            $scope.prevRoutes = allPrevRoutes;
            var routesContent = angular.element(document.querySelector('#content'));
            var linkingFunction = $compile($scope.prevRoutes);
            var elem = linkingFunction($scope);
            routesContent.html(elem);
        }
    }

    //function that deletes a certain route from traveler's 'routes history'
    $scope.deletePrevRoute = function(tripId){
        $http.get("https://routeit-ws.herokuapp.com/deletePrevRoute/" + userMail + "/" + tripId).success(function(routes){
            //delete the route from myRoutesArr
            for(var i = 0; i<prevRoutesArr.length; i++){
                if(prevRoutesArr[i].trip_id == tripId){
                    prevRoutesArr.splice(i,1);
                    break;
                }
            }
            $scope.showRoutesHistory();          
        });
    }
}]);