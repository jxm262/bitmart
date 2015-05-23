//Markers = new Mongo.Collection('markers');
Meteor.subscribe('markers');

var centerLocation;

Template.searchbox

Template.map.onCreated(function () {
    GoogleMaps.ready('mymap', function (map) {
        google.maps.event.addListener(map.instance, 'click', function (event) {
            Markers.insert({lat: event.latLng.lat(), lng: event.latLng.lng()});
        });

        var markers = {};

        //var image = {
        //    url: 'http://placehold.it/32',
        //    // This marker is 20 pixels wide by 32 pixels tall.
        //    size: new google.maps.Size(20, 32),
        //    // The origin for this image is 0,0.
        //    origin: new google.maps.Point(0,0),
        //    // The anchor for this image is the base of the flagpole at 0,32.
        //    anchor: new google.maps.Point(0, 32)
        //};

        console.log(GoogleMaps.maps.mymap.instance);
        console.log('centerLocation: ' + centerLocation);

        function CenterControl(controlDiv, map) {

            // Set CSS for the control border
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';
            controlText.innerHTML = 'Center Map';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to
            // Chicago
            //google.maps.event.addDomListener(controlUI, 'click', function() {
            //    map.setCenter(centerLocation)
            //});

        };


        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map.instance);

        centerControlDiv.index = 1;
        map.instance.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

        Markers.find().observe({
            added: function (document) {
                var marker = new google.maps.Marker({
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(document.lat, document.lng),
                    map: map.instance,
                    //icon: image,
                    id: document._id
                });

                //console.log(JSON.stringify(marker));

                google.maps.event.addListener(marker, 'dragend', function (event) {
                    Markers.update(marker.id, {$set: {lat: event.latLng.lat(), lng: event.latLng.lng()}});
                });

                markers[document._id] = marker;
            },
            changed: function (newDocument, oldDocument) {
                console.log('was changed..');

                markers[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
            },
            removed: function (oldDocument) {
                console.log('was removed..');

                markers[oldDocument._id].setMap(null);
                google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
                delete markers[oldDocument._id];
            }
        });
    });
});

Meteor.startup(function () {
    GoogleMaps.load();
});

//function(){
//
//    console.log('loaded');
//}

Template.map.helpers({
    mapOptions: function () {
        if (GoogleMaps.loaded()) {
            centerLocation = new google.maps.LatLng(19.9325862, 7.5140332);

            return {
                center: centerLocation,
                zoom: 3
            };
        }
    }
});



//function CenterControl(controlDiv, map) {
//
//    // Set CSS for the control border
//    var controlUI = document.createElement('div');
//    controlUI.style.backgroundColor = '#fff';
//    controlUI.style.border = '2px solid #fff';
//    controlUI.style.borderRadius = '3px';
//    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
//    controlUI.style.cursor = 'pointer';
//    controlUI.style.marginBottom = '22px';
//    controlUI.style.textAlign = 'center';
//    controlUI.title = 'Click to recenter the map';
//    controlDiv.appendChild(controlUI);
//
//    // Set CSS for the control interior
//    var controlText = document.createElement('div');
//    controlText.style.color = 'rgb(25,25,25)';
//    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
//    controlText.style.fontSize = '16px';
//    controlText.style.lineHeight = '38px';
//    controlText.style.paddingLeft = '5px';
//    controlText.style.paddingRight = '5px';
//    controlText.innerHTML = 'Center Map';
//    controlUI.appendChild(controlText);
//
//    // Setup the click event listeners: simply set the map to
//    // Chicago
//    google.maps.event.addDomListener(controlUI, 'click', function() {
//        map.setCenter(chicago)
//    });
//
//};

//center: new google.maps.LatLng(39.98691,-83.044943),
