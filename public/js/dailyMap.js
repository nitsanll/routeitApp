//initialize daily route's map
function initMap() {
    var chosenRoute = JSON.parse(localStorage.getItem("chosenRoute"));
    var myRoutes = localStorage.getItem("myRoutes");
    //if the user is on a chosen trip
    if(chosenRoute != null){
        var currentDate = new Date(); //today's date
        var foundDay = false; //flag to check if the trip days have the current date
        for(var i = 0; i< chosenRoute.daily_sections.length; i++){
            var tmpDate = new Date(chosenRoute.daily_sections[i].date);
            if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) && (currentDate.getFullYear() == tmpDate.getFullYear())){
                currentDayPos = i;
                foundDay = true;
            }  
        }
        if(foundDay == false) localStorage.setItem("chosenRoute", null); //the chosen trip has ended, set chosenroute to null
    }
    var chosenRoute = JSON.parse(localStorage.getItem("chosenRoute"));
    //if there isn't a chosen trip for the current day - show a map with the traveler's current position
    if(chosenRoute == null){
         navigator.geolocation.getCurrentPosition(function(position){
            window.lat = position.coords.latitude;
            window.lng = position.coords.longitude;
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat:window.lat, lng:window.lng},
                zoom:13,
                mapTypeId: google.maps.MapTypeId.ROAD
            });
            var mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
            document.getElementById('map').className = 'backgroundMap';
        }, function(error){ 
            console.warn(error);
            map = new google.maps.Map(document.getElementById('map'), {
                center:{lat: 32.090565, lng: 34.803046},
                zoom:13,
                mapTypeId: google.maps.MapTypeId.ROAD
            });
            var mark = new google.maps.Marker({position:{lat:32.090565, lng:34.803046}, map:map});
            document.getElementById('map').className = 'backgroundMap'; 
        }, 
        {
            enableHighAccuracy: false,
            timeout: 10000
        });
    }
    //if there is a chosen trip for the current day
    else {
        var dailyCoordsArray = []; // holds one daily section's coords
        // get the current day coords
        var currentDate = new Date(); //today's date
        var currentDayPos = 0;
        var foundDay = false; //flag to check if the trip days have the current date
        //find the current trip day 
        for(var i = 0; i< chosenRoute.daily_sections.length; i++){
            var tmpDate = new Date(chosenRoute.daily_sections[i].date);
            if((currentDate.getDate() == tmpDate.getDate()) && (currentDate.getMonth() == tmpDate.getMonth()) && (currentDate.getFullYear() == tmpDate.getFullYear())){
                currentDayPos = i;
                foundDay = true;
                break;
            }  
        }
        //when the current trip day was found - fill the daily coords array
        if(foundDay == true){
            for(var j=0; j<chosenRoute.daily_sections[currentDayPos].coord_array.length; j++){
                var dailyCoord = {
                    lat: Number(chosenRoute.daily_sections[currentDayPos].coord_array[j].lat),
                    lng: Number(chosenRoute.daily_sections[currentDayPos].coord_array[j].lng)
                }
                dailyCoordsArray.push(dailyCoord);
            }
        }
        var centerCoord = dailyCoordsArray[parseInt(dailyCoordsArray.length/2)];

        var map; //holds the google map
        var mark; //pin on map that shows user's position

        //creating 'user location' button to add to the map
        function CenterControl(controlDiv, map) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.padding = '2%';
            controlUI.style.borderRadius = '50px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.position = 'fixed';
            controlUI.style.left = '2%';
            controlUI.style.top = '20vh';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.border = 'none';
            controlText.display = 'block';
            controlText.width = '100px';
            controlText.height = '100px';
            controlText.innerHTML = '<img src="../images/LOCATION.png">'; 
            controlUI.appendChild(controlText);

            // Setup the click event listeners - set the map to the user's current trip area
            controlUI.addEventListener('click', function() {
                navigator.geolocation.getCurrentPosition(function(position){
                    window.lat = position.coords.latitude;
                    window.lng = position.coords.longitude;
                    map.setCenter({lat:window.lat, lng:window.lng, alt:0});
                });
            });
        }

        //get the user's current position and put it on the map 
        navigator.geolocation.getCurrentPosition(function(position){
            window.lat = position.coords.latitude;
            window.lng = position.coords.longitude;
            map  = new google.maps.Map(document.getElementById('map'), {
                center:centerCoord,
                zoom:13,
                mapTypeId:google.maps.MapTypeId.ROAD
            });

            //draw the route on map by its coordinates
            var lineCoordinatesPath = new google.maps.Polyline({
                path: dailyCoordsArray,
                geodesic: true,
                strokeColor: '#004d00',
                strokeOpacity: 1.0,
                strokeWeight: 4
            });
            lineCoordinatesPath.setMap(map);
            
            //add daily alerts markers to map
            var dayAlerts = chosenRoute.daily_sections[currentDayPos].alert;
            var alertMarkers = [];
            if(dayAlerts.length != 0){
                for(var i =0; i<dayAlerts.length; i++){
                    var coord = {
                        lat: Number(dayAlerts[i].coord.lat),
                        lng: Number(dayAlerts[i].coord.lng)
                    }
                    alertMarkers[i] = new google.maps.Marker({
                        position: coord,
                        map: map,
                        icon: "../images/ALERT.png",
                        title: dayAlerts[i].content
                    });
                    var infowindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(alertMarkers[i], 'click', function() {
                        var marker = this;
                        var content = '<div id="alertContent">' + this.title +'</div>';   
                        infowindow.setContent(content);
                        infowindow.open(map, this);
                    });
                }
            }
            document.getElementById('map').className = 'backgroundMap'; //change map display settings

            //add a pin to map with the chosen accomm for the day
            if(chosenRoute.daily_sections[currentDayPos].chosen_accomm != null){
                var infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(map);

                service.getDetails({
                  placeId: chosenRoute.daily_sections[currentDayPos].chosen_accomm.accomm_id
                }, function(place, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        var marker = new google.maps.Marker({
                            map: map,
                            icon: '../images/BED.png',
                            position: place.geometry.location
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            var content = '<div><strong>' + place.name + '</strong><br>' + place.vicinity + '<br>'; 
                            if(place.formatted_phone_number) {
                                content += place.formatted_phone_number;
                            }
                            content+='</div>';
                            infowindow.setContent(content);
                            infowindow.open(map, this);
                        });
                    }
                });
            }

            //add the 'user current locaiton' button to map
            var centerControlDiv = document.createElement('div');
            var centerControl = new CenterControl(centerControlDiv, map);
            centerControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
            mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
        });
        //function that redraws the user's current position on map
        var redraw = function(payload) {
            lat = payload.message.lat;
            lng = payload.message.lng;
            mark.setPosition({lat:lat, lng:lng, alt:0});
        }; 
        var pnChannel = "map-channel";
        var pubnub = new PubNub({
            publishKey: 'pub-c-17c5478f-c63f-436a-8f06-8e0da70e9069',
            subscribeKey: 'sub-c-36f24c50-dafe-11e6-9c30-0619f8945a4f'
        });    
        pubnub.subscribe({channels: [pnChannel]});
        pubnub.addListener({message:redraw});
        //check the user's position every 5 secs
        setInterval(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
                window.lat = position.coords.latitude;
                window.lng = position.coords.longitude;
                pubnub.publish({channel:pnChannel, message:{lat:window.lat, lng:window.lng}});
            });  
        }, 5000);
    }
}