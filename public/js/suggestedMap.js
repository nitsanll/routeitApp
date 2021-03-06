//drawing suggested route on google map
function initMap() {
    document.getElementById('map').className = 'miniMap';
    var sugJson = JSON.parse(localStorage.getItem("suggestedRoute")); //getting the suggested route
    //merge daily sections coord arrays
    var tripCoordsArr = []; // all daily sections coords
    var tmpCoordsArr = []; // holds coords temporarily 
    var dailyCoordsArray = []; // holds one daily section's coords
    for(var i=0; i<sugJson.daily_sections.length; i++){
        for(var j=0; j<sugJson.daily_sections[i].coord_array.length; j++){
            var dailyCoord = {
                lat: Number(sugJson.daily_sections[i].coord_array[j].lat),
                lng: Number(sugJson.daily_sections[i].coord_array[j].lng)
            }
            dailyCoordsArray.push(dailyCoord);
        }
        tripCoordsArr = tmpCoordsArr.concat(dailyCoordsArray);
        dailyCoordsArray = [];
        tmpCoordsArr = tripCoordsArr;
    }
    var suggestedCoords = JSON.stringify(tripCoordsArr);
    localStorage.setItem("suggestedCoords", suggestedCoords);
    var coords = JSON.parse(localStorage.getItem("suggestedCoords"));
    var centerCoord = coords[parseInt(coords.length/2)];
    
    //creating the map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: centerCoord, 
        mapTypeId: google.maps.MapTypeId.ROAD
    });
    
    //drawing the suggested route line on the map
    var lineCoordinatesPath = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#004d00',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    lineCoordinatesPath.setMap(map);
}