define(['jquery', 'ko', 'rest_api', 'classUserEvent', 'bootstrap'], function($, ko, rest_api, classUserEvent) {


    var event = {
        location: ko.observable(),
        eventName: ko.observable(),
        type: ko.observable(),
        userGroups: ko.observableArray(),
        groupMembers: ko.observableArray(),
        selectedUser: ko.observable(), //Not being used yet
        selectedArea: ko.observableArray()
    }

    event.allowSupervise = function() {
        return Boolean(event.selectedArea().length); //not defined yet
    }


    event.getUserGroups = function() {
        resalt = rest_api.getUserGroups().then(function(result) {
            event.userGroups(result.value);
        }, function() {
            event.userGroups('');
        });
    }

    //Creating new Event
    event.createEvent = function() {
        var regExp = new RegExp("^#users/([0-9]+,*?)"); //Geting Uer ID from URL
        var userID = regExp.exec(window.location.hash) && regExp.exec(window.location.hash)[1];
        var result = rest_api.createUserEvent({
            event: new classUserEvent(userID, event)
        });
        result.fail(function(jqXHR) {
            if (jqXHR.status == '401')
                window.location.hash = '401';
            else alert("Sorry, operation is not Done .There was a problem with the server, Please try latter");
        });
        result.done(function(id) {
            alert(event.type() + " Event Successfuly created ");
        });
    }

    var active = true;
    //Get coordinates of onlinr users
    event.getOnlineGroupMembersCoordinates = function() {
        //active = true;
        getCoordinates();
    }

    function getCoordinates() {
        event.groupMembers().forEach(function(user) {
            rest_api.getOnlineGroupMembersCoordinates(user.userId).then(function(Points) {
                event.drowOnMap(Points);
            });
        });
        if (active) {
            setTimeout(function() {
                getCoordinates();
            }, 10000);
        }
    }

    //Load Google Map for Creting New Event
    event.loadMap = function(element) {
        require(['async!http://maps.google.com/maps/api/js?v=3.exp&libraries=drawing'], function() {
            var element = element || document.getElementById('map-canvas');
            var geocoder = new google.maps.Geocoder();
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var map = new google.maps.Map(element, {
                center: new google.maps.LatLng(40.18656184784909, 44.57176923751831),
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                }
            });

            event.drowOnMap = function(point) {
                console.log("### ", point);
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(point.x, point.y),
                    title: "H1!"
                });
                marker.setMap(map);
            }

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.POLYLINE,
                        google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                markerOptions: {
                    icon: 'img/logo.png'
                },
                circleOptions: {
                    fillColor: '#ffff00',
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1
                }
            });
            drawingManager.setMap(map);

            directionsDisplay.setMap(map);


            // Map Event handler 
            google.maps.event.addListener(map, 'click', function(e) {
                console.log("clicked ", e.latLng);
                //placeMarker(e.latLng);
            });

            google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
                event.selectedArea.push(polygon);
            });

            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
                event.selectedArea.push(rectangle);
            });

            google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                event.selectedArea.push(circle);
            });

        });
    }

    // Custom Bindings 	//Loads The Mmp
    ko.bindingHandlers.customShowMap = {
        init: function(element, valueAccessor) {
            event.loadMap(element);
            event.getUserGroups();
        },
    }

    return event;
});