var routeForm = angular.module('routeForm', []);

var startPts = {}; //holds all of the areas start points

routeForm.run(function($rootScope, $http) {
    $http.get("https://routeit-ws.herokuapp.com/getStartPts").success(function(points){
        //create an array of all areas and their start points options
        points[0].area_id = 0;
        points[1].area_id = 1;
        var areasArr = ["הגליל התחתון", "רכס הכרמל", "השרון", "ירושלים", "השפלה", "המכתשים", "הערבה", "הרי אילת"];
        for(var i = 0; i<areasArr.length; i++){
            var newArea = {
                "area": areasArr[i],
                "area_id": i+2,
                "points": []
            }
            points.push(newArea); 
        }
        startPts = points;
        $rootScope.$broadcast('init');
    });
});

routeForm.controller('FormController', ['$scope', '$rootScope', '$http', '$parse', function($rootScope, $scope, $http, $parse){
    function init() {
        $scope.name =  localStorage.getItem("name");
        $scope.img = localStorage.getItem("pic");
        $scope.startPts = startPts; //an array contains all of the areas and their start points options
        $scope.dirArr = [{"name": "צפון לדרום", "value": "north"}, {"name": "מדרום לצפון", "value": "south"}];
        $scope.kmArr = [{'name': 'עד 5 ק"מ', 'value': '5', 'label': 'עד 5'}, {'name': '5-10 ק"מ ביום', 'value': '10', 'label': '5-10'}, {'name': '10-15 ק"מ ביום', 'value': '15', 'label': '10-15'}];
        $scope.diffArr = [{'name': 'ללא העדפה', 'value': 'ללא'}, {'name': 'קל', 'value': 'קל'}, {'name': 'בינוני', 'value': 'בינוני'}, {'name': 'קשה', 'value': 'קשה'}];
        $scope.typeArr = [{'name': 'ללא העדפה', 'value': 'ללא'}, {'name': 'מתאים למשפחות', 'value': 'מתאים למשפחות'}, {'name': 'מתאים לבעלי מוגבלויות', 'value': 'מתאים לבעלי מוגבלויות'}, {'name': 'מאתגר', 'value': 'מאתגר'}, {'name': 'מיטיבי לכת', 'value': 'מיטיבי לכת'}];

        //if the user had planned a route and go back to it - save the inputs he filled in form
        if(localStorage.getItem("suggestedBack") == "true"){
            var suggestedRoute = JSON.parse(localStorage.getItem("suggestedRoute"));
            for(var i=0; i<startPts.length; i++){
                if(suggestedRoute.area == startPts[i].area){
                    $scope.area = startPts[i];
                    for(var j=0; j<startPts[i].points.length; j++){
                        if(suggestedRoute.trip_start_pt == startPts[i].points[j].point_name){
                             $scope.sPoint = startPts[i].points[j];
                        }
                    }
                }
            }
            if(suggestedRoute.direction == "north") $scope.dir = $scope.dirArr[0]; 
            else $scope.dir = $scope.dirArr[1];
            $scope.daysNum = Number(suggestedRoute.days_num);
            for(var i=0; i<$scope.kmArr.length; i++){
                if(suggestedRoute.day_km == $scope.kmArr[i].label) $scope.km = $scope.kmArr[i];
            }
            $scope.diff = $scope.diffArr[0];
            $scope.type = $scope.typeArr[0];
            localStorage.setItem("suggestedBack", false);
        //if the user hasn't planned a route before
        } else {
            $scope.area = startPts[0];
            $scope.dir = $scope.dirArr[0]; 
            $scope.km = $scope.kmArr[0];
            $scope.daysNum = 1;
            $scope.diff = $scope.diffArr[0];
            $scope.type = $scope.typeArr[0];

            if($scope.area.area == "כל השביל"){
                var elements = angular.element(document.querySelectorAll('.disable'));
                elements.attr('disabled', 'disabled');  
                elements.css('background', '#EDF0F2');  
                $scope.daysNum = "";     
            }
        }
    }

    var unbindHandler = $rootScope.$on('init', function($scope){
        init();
        unbindHandler();
    });

    
    $scope.south = false; //flag that points weather the traveler chose south to north direction

    //function that orders the start points of the chosen area by the chosen direction
    $scope.dirValue = function(dir, area){
        var northPointsArr = []; 
        if(dir == 'north'){
            if($scope.south == false){}
            else {
                $scope.startPts[area.area_id].points.reverse();               
                $scope.sPoint = $scope.startPts[area.area_id].points[0];
                $scope.south = false;
            }
        }
        else if(dir == 'south'){
            $scope.south = true;
            $scope.startPts[area.area_id].points.reverse();
            $scope.sPoint = $scope.startPts[area.area_id].points[0];
        }
    };
    
    //function that checks if the chosen route is all of the route, and disable relevant fields
    $scope.checkArea = function(area){
        if(area.area == "כל השביל"){
            var elements = angular.element(document.querySelectorAll('.disable'));
            elements.attr('disabled', 'disabled');
            elements.css('background', '#EDF0F2');
            $scope.daysNum = "";
            $scope.sPoint = $scope.startPts[area.area_id].points[0];     
        }
        else {
            $scope.sPoint = $scope.startPts[area.area_id].points[0]; 
            var elements = angular.element(document.querySelectorAll('.disable'));
            elements.removeAttr('disabled');
            elements.css('background', '#D9F1FB');    
        }
    };

    //function that sends the chosen criteria filled in form in order to calculate the route
    $scope.calcRoute = function(area, dir, sPoint, km, daysNum, diff, type){
        if(daysNum != ''){
            var email = localStorage.getItem("email");
            $http.get("https://routeit-ws.herokuapp.com/calculate/" + area+ "/" + km + "/" + dir + "/" + daysNum + "/" + sPoint + "/" + diff + "/" + type + "/" + email).success(function(route){
                var routeStr = JSON.stringify(route);
                localStorage.setItem("suggestedRoute", routeStr);
                var sugRoute = JSON.parse(localStorage.getItem("suggestedRoute"));
                var popupContentElement = angular.element(document.querySelector('#popupContent'));
                var popupElement = angular.element(document.querySelector('#myPopup'));
                var maskElement = angular.element(document.querySelector('#pageMask'));
                if(sugRoute == "segmentsErr"){
                    popupContentElement.html('אין מספיק ימי טיול עבור נקודת ההתחלה שנבחרה. <br> נסה להוריד את ימי הטיול/את מספר הק"מ ליום'); 
                    popupElement.addClass("show");
                    maskElement.addClass("pageMask");
                } else if(sugRoute == "typeErr"){
                    popupContentElement.html('המסלול אינו תואם את אופי הטיול שבחרת'); 
                    popupElement.addClass("show");
                    maskElement.addClass("pageMask"); 
                } else if(sugRoute == "diffErr"){
                    popupContentElement.html('המסלול אינו תואם את רמת הקושי שבחרת'); 
                    popupElement.addClass("show");
                    maskElement.addClass("pageMask");  
                } else if(sugRoute == "typeDiffErr"){
                    popupContentElement.html('המסלול אינו תואם את אופי הטיול ואת רמת הקושי שבחרת'); 
                    popupElement.addClass("show");
                    maskElement.addClass("pageMask"); 
                } else window.location.assign("https://routeit-app.herokuapp.com/suggested.html");
            });
        }
    };

    //function that closes the popup that checks if the user wants to go back 
    $scope.closePopup =function(){
        var popupElement = angular.element(document.querySelector('#myPopup'));
        popupElement.removeClass("show");
        var maskElement = angular.element(document.querySelector('#pageMask'));
        maskElement.removeClass("pageMask");
    }
}]);