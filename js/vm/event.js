define(['jquery', 'ko', 'rest_api', 'classUserEvent', 'bootstrap'], function($, ko, rest_api, classUserEvent) {
    var mapSizieas = {
        w: '',
        h: ''
    }
    var userData;
    var event = {
        location: ko.observable(),
        eventName: ko.observable(),
        type: ko.observable(),
        userGroups: ko.observableArray(),
        groupMembers: ko.observableArray(),
        groupMembersCoordinates: ko.observable(),
        selectedUser: ko.observable(), //Not being used yet
        selectedArea: ko.observableArray()
    }

    event.setUserData = function(userData) {
        userData = userData;
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

    event.setFullScrean = function() {
        var $element = $('#map-canvas');
        mapSizieas.w = $element.width();
        mapSizieas.h = $element.height();

        var element = document.getElementById('map-canvas');

        element.style.width = window.innerWidth + "px";
        element.style.height = window.innerHeight + "px";
        if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }


    var active = false;
    //set supervising group ID
    event.startSupervise = function() {
        active = true;
        rest_api.startSupervise(event.groupMembers());

        //setIntoModal()
        //$('#map-canvas').height(h).appendTo('#mapModalPlace');
        //$('#map-canvas').appendTo('#mapModalPlace');
    };

    //Detecting full screan exit
    $('body').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
        if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {} else {
            var $element = $('#map-canvas');
            $element.width(mapSizieas.w);
            $element.height(mapSizieas.h);
        }
    });

    event.minimizeWindow = function() {
        $('#map-canvas').appendTo('#mapDefaultPlace');
    }

    event.groupMembersCoordinates.subscribe(function() {
        active && event.drawOnMap(event.groupMembersCoordinates());
    });








    //Load Google Map for Creting New Event
    event.loadMap = function(element) {
        require(['async!http://maps.google.com/maps/api/js?v=3.exp&libraries=drawing'], function() {
            var element = element || document.getElementById('map-canvas');
            var markers = [];
            var geocoder = new google.maps.Geocoder();
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var map = new google.maps.Map(element, {
                center: new google.maps.LatLng(40.18656184784909, 44.57176923751831),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                }
            });


            //checks whether point is inside the poligon or not
            function isPointInsidePoligon(point) {
                var myPosition = new google.maps.LatLng(point.x, point.y);
                var figure = event.selectedArea()[0].value;
                var key = event.selectedArea()[0].key;
                if (key === 'poly') {
                    return google.maps.geometry[key].containsLocation(myPosition, event.selectedArea()[0].value);
                }
                return figure.getBounds().contains(myPosition);
            }

            //make a Voice
            function makeVoice(user) {
                var u = new SpeechSynthesisUtterance();
                u.text = 'Warning, warning ' + user + ' is outside of bounds';
                u.lang = 'en-US';
                u.rate = 0.75;
                u.pitch = 2.0;
                u.volume = 1;
                speechSynthesis.speak(u);
            }

            function makeMarker(point, imageUrl, animate) {
                var animate = animate && google.maps.Animation.BOUNCE;
                var image = imageUrl && {
                    url: imageUrl,
                    size: new google.maps.Size(55, 48),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32)
                };
                var shape = {
                    coords: [1, 1, 1, 20, 18, 20, 18, 1],
                    type: 'poly'
                };

                return new google.maps.Marker({
                    position: new google.maps.LatLng(point.x, point.y),
                    map: map,
                    icon: image,
                    shape: shape,
                    animation: animate
                });
            }

            // Add a marker to the map and push to the array.
            function addMarker(point) {
                var marker;
                if (!isPointInsidePoligon(point)) {
                    makeVoice(point.username);
                    marker = makeMarker(point, 'img/warn.png', true);
                } else {
                    marker = makeMarker(point);
                }
                marker.id = point.userId;
                markers.push(marker);
            }
            // Sets the map on all markers in the array.
            function setAllMap(map) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            }
            // Shows any markers currently in the array.
            function showMarkers() {
                setAllMap(map);
            }
            // Deletes all markers in the array by removing references to them.
            function deleteMarkers() {
                setAllMap(null);
                markers = [];
            }

            event.drawOnMap = function(points) {
                console.log("get coordinates ", points);
                deleteMarkers();
                points.forEach(function(point) {
                    addMarker(point);
                });
                showMarkers();
            }

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                circleOptions: {
                    fillColor: '#000',
                    fillOpacity: 0.3,
                    strokeWeight: 1,
                    clickable: true,
                    editable: true,
                    zIndex: 1
                }
            });
            directionsDisplay.setMap(map);

            event.startDrawing = function() {
                drawingManager.setMap(map);
            };

            event.stopDrawing = function() {
                drawingManager.setMap(null);
            };

            // Map Event handler 
            google.maps.event.addListener(map, 'click', function(e) {
                console.log("clicked ", e.latLng);
                //placeMarker(e.latLng);
            });
            google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
                event.selectedArea.push({
                    key: 'poly',
                    value: polygon
                });
                event.stopDrawing();
            });
            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
                event.selectedArea.push({
                    key: 'rectangle',
                    value: rectangle
                });
                event.stopDrawing();
            });
            google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                event.selectedArea.push({
                    key: 'circle',
                    value: circle
                });
                event.stopDrawing();
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