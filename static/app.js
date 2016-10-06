var map;
var markers = [];
var currentLocation;
var defaultCoords = {lat: 42.876680, lng: 74.588665};

var locIcon = '/static/loc.png';
var browserLocation;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCoords,
    zoom: 14,
    disableDefaultUI: true
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };


      map.setCenter(pos);
      browserLocation = pos;
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
  // Try HTML5 geolocation.
  google.maps.event.addListener(map, 'click', function (e) {
    changeLocationPin(e.latLng);
  });
  $('.center_my_location').on('click', function(e) {
    e.preventDefault();
    currentLocation.setPosition(browserLocation);
    requestNearest(browserLocation.lat, browserLocation.lng);
  });
}

function changeLocationPin(latlng) {
  // map.panTo(latlng);
  currentLocation.setPosition(latlng);
  requestNearest(latlng.lat(), latlng.lng());
}

function fillCompanyContact(company) {
  var filledContact = {
    phoneNumber: "n/a",
    shortNumber: "",
    webSite: "#",
    android: "#",
    icon: "static/img/icon_namba.png",
    iOS: "#"
  };

  if (company.contacts) {
    var contacts = company.contacts;

    for (var l = 0, lenC=contacts.length; l < lenC; l++) {
      var contactData = company.contacts[l];
      // console.log(c);
      filledContact = fillContact(filledContact, contactData);
    }
  }
  return filledContact;
}

function fillContact(contact, contactData){
  switch (contactData.type) {
    case 'phone':
      contact.phoneNumber = contactData.contact;
      break;
    case 'sms':
      contact.shortNumber = contactData.contact;
      break;
    case 'android':
      contact.android = contactData.contact;
      break;
    case 'ios':
      contact.iOS = contactData.contact;
      break;
    case 'website':
      contact.webSite = contactData.contact;
      break;
    case 'icon':
      contact.icon = contactData.icon;
      break;
  }
  return contact;
}

function renderDriversSidebar(company, drivers, contact){
	var countOfAllDrivers = 0;
  var source = document.getElementById('result').innerHTML;
  var template = Handlebars.compile(source);
	countOfAllDrivers += drivers.length;

		var html = template({
    name: company.name,
    icon: company.icon,
		countOfAllDrivers: countOfAllDrivers,
    driversCount: drivers.length,
    phoneNumber: contact.phoneNumber,
    shortNumber: contact.shortNumber,
    webSite: contact.webSite,
    android: contact.android,
    iOS: contact.iOS
  });

  return html;
}

function renderDriverMarkers(drivers, company){
  var driverMarkers = [];
  for (var j = 0; j < drivers.length; j++) {
    var item = drivers[j];
    var options = {
      position: {lat: item.lat, lng: item.lon},
      map: map,
      title: company.name
    };
    if (company.icon !== "" && company.icon !== window.location.origin) {
      options.icon = company.icon
    }
    driverMarkers.push(
        new google.maps.Marker(options)
        )
  }
  return driverMarkers;
}

function requestNearest(lat, lng) {
	var url = "http://127.0.0.1:8090/nearest/" + lat + "/" + lng;

  // var url = window.location.origin + "/nearest/" + lat + "/" + lng;

  var xmlhttp;
  // compatible with IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);
      // console.log(data);
      if (data.success) {
        data.companies = data.companies.sort(function (a, b) {
          return a.drivers.length < b.drivers.length
        });
        cleanMarkers();
        for (var i = 0, len=data.companies.length; i < len; i++) {
          var company = data.companies[i];
          var drivers = company.drivers;
          var contact = fillCompanyContact(company);
          var $resultWrap = $(".result_wrap");
          $resultWrap.find('.result_title-phone').off('click');

          var driverSidebarHtml = renderDriversSidebar(company, drivers, contact);

          $resultWrap.append(driverSidebarHtml);

          markers = markers.concat(renderDriverMarkers(drivers, company));
          $resultWrap.find('.result_title-phone').click(function(){
            var phone = $(this).data("phone");
            $(this).val(phone);
          });
        }
        console.log(countOfAllDrivers);
      }
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function cleanMarkers() {
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    marker.setMap(null);
  }
  markers = [];
  $(".result_wrap").html("");
}
