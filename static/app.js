var map;
var markers = [];
var currentLocation;
var defaultCoords = {lat: 42.876680, lng: 74.588665};
function initMap() {
		var locIcon = '/static/loc.png';
		map = new google.maps.Map(document.getElementById('map'), {
				center: defaultCoords,
				zoom: 14
		});

		// Try HTML5 geolocation.
		if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
						var pos = {
								lat: position.coords.latitude,
								lng: position.coords.longitude
						};


						map.setCenter(pos);
						map.setZoom(14);
						currentLocation = new google.maps.Marker({
								position: {lat: position.coords.latitude, lng: position.coords.longitude},
								map: map,
								icon: locIcon
						});
						requestNearest(position.coords.latitude, position.coords.longitude);


				}, function () {
						console.log("Can't get coords");
						currentLocation = new google.maps.Marker({
								position: defaultCoords,
								map: map,
								icon: locIcon
						})
				});
		} else {
				// Browser doesn't support Geolocation
				console.log("Browser doesn't support geolocation")
		}
		google.maps.event.addListener(map, 'click', function (e) {
				changeLocationPin(e.latLng);
		})
}

function changeLocationPin(latlng) {
		// map.panTo(latlng);
		currentLocation.setPosition(latlng);
		requestNearest(latlng.lat(), latlng.lng());
}

function requestNearest(lat, lng) {
		var url = window.location.origin + "/nearest/" + lat + "/" + lng;


		var xmlhttp;
		// compatible with IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						data = JSON.parse(xmlhttp.responseText);
						console.log(data);
						if (data.success) {
								cleanMarkers();
								data.companies = data.companies.sort(function(a, b) {
										return a.drivers.length < b.drivers.length
								});
								for (i = 0; i < data.companies.length; i++) {
										var company = data.companies[i];
										var source = document.getElementById('result').innerHTML;
										var template = Handlebars.compile(source);
										var html = template({name: company.name, driversCount: company.drivers.length});
										$(".result_wrap").append(html);
										for (j = 0; j < company.drivers.length; j++) {
												var item = company.drivers[j];
												var options = {
														position: {lat: item.lat, lng: item.lon},
														map: map,
														title: company.name
												};
												if (company.icon !== "" && company.icon !== window.location.origin) {
														options.icon = company.icon
												}
												markers.push(
														new google.maps.Marker(options)
												)
										}
								}
						}
				}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
}

function cleanMarkers() {
		for (i = 0; i < markers.length; i++) {
				var marker = markers[i];
				marker.setMap(null);
		}
		markers = [];
		$(".result_wrap").html("");
}

var result = $(".result_wrap");

$("#choose_taxi").click(function () {
		if (result.is(':hidden')) {
				result.slideDown('slow');
		} else {
				result.slideUp('slow');
		}
});
