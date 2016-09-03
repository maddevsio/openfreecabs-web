var map;
var markers = [];
var currentLocation;
function initMap() {
  var locIcon = '/static/loc.png';
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


      map.setCenter(pos);
      map.setZoom(14);
      currentLocation = new google.maps.Marker({
        position: {lat: position.coords.latitude,lng: position.coords.longitude},
        map: map,
        icon: locIcon
      });
      requestNearest(position.coords.latitude, position.coords.longitude);




    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  google.maps.event.addListener(map, 'click', function(e) {
    changeLocationPin(e.latLng);
  })
}

function changeLocationPin(latlng) {
  // map.panTo(latlng);
  currentLocation.setPosition(latlng);
  requestNearest(latlng.lat(), latlng.lng());
}

function requestNearest(lat, lng){
  var url = window.location.href + "/nearest/" + lat + "/" + lng;


  var xmlhttp;
  // compatible with IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        data = JSON.parse(xmlhttp.responseText);
        if (data.success) {
          cleanMarkers();
          for (i = 0; i < data.companies.length; i++) {
            var company = data.companies[i];
            for (j = 0; j < company.drivers.length; j++) {
              var item = company.drivers[j];
              var options = {
                  position: {lat: item.lat, lng: item.lon},
                  map: map,
                  title: company.name,
              }
              if (company.icon !== "") {
                options.icon = company.icon
              }
              markers.push(
                  new google.maps.Marker(options)
              )
            }
          }
        }
      }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function cleanMarkers() {
  for (i =0; i < markers.length; i++) {
    var marker=markers[i];
    marker.setMap(null);
  }
  markers = []
}
