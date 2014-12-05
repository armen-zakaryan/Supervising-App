define(['jquery', 'ko', 'rest_api', 'bootstrap'], function($, ko, rest_api) {

    var user = {
        id: ko.observable(),
        firstName: ko.observable(),
        lastName: ko.observable(),
        photo: ko.observable(),
        eventOptions: ko.observable(' Actions ')
    }

    user.url = ko.computed(function() {
        return '#users/' + user.id() + '/events'
    });

    user.sendData = function() {
        sendCoordinates();
    }

    //Start Test
    var shift = 0.001;



    //End Test

    sendCoordinates = function() {
        //console.log("Coordinates are not being send ");
        setTimeout(function() {
            console.log("sending...");
            getMyCoordinates();
            sendCoordinates();
        }, 3000);

    }

    getMyCoordinates = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                rest_api.sendCoordinates({
                    x: position.coords.latitude,
                    y: position.coords.longitude
                }).then(function(groupMembersCoordinates) {
                    user.onCoordinatesGet(groupMembersCoordinates);
                });
            });
        }
    }




    return user;

});