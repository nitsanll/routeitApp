//drawing suggested route map
function initMap() {
    document.getElementById('map').className = 'miniMap';
    console.log("suggestedmap");
    var sugJson = JSON.parse(localStorage.getItem("suggestedRoute"));
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
    console.log("suggestedjs");
    localStorage.setItem("suggestedCoords", suggestedCoords);
    var coords = JSON.parse(localStorage.getItem("suggestedCoords"));
    var centerCoord = coords[parseInt(coords.length/2)];
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: centerCoord, //{lat: 33.240884, lng: 35.575751},
        mapTypeId: google.maps.MapTypeId.ROAD
    });
    var lineCoordinatesPath = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: '#004d00',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    lineCoordinatesPath.setMap(map);
}