'use strict'
define(['jquery', 'ko', 'rest_api', 'bootstrap'], function($, ko, rest_api) {

    var user = {
        id: ko.observable(),
        firstName: ko.observable(),
        lastName: ko.observable(),
        photo: ko.observable(),
        eventOptions: ko.observable(' Actions '),
        testSwitchOptions: ko.observable('General')
    }

    var testSwitch = {
        General: getMyCoordinates,
        Test: getMyCoordinatesTest
    }

    user.url = ko.computed(function() {
        return '#users/' + user.id() + '/events'
    });

    user.sendData = function() {
        sendCoordinates();
    };

    function sendCoordinates() {
        //console.log("Coordinates are not being send ");
        setTimeout(function() {
            console.log("sending...");
            user.testSwitchOptions() && testSwitch[user.testSwitchOptions()]();
            sendCoordinates();
        }, 3000);
    }

    function getMyCoordinates() {
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

    //Start Test
    var shift = 0.001;

    function getMyCoordinatesTest() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                shift += 0.001;
                var x = position.coords.latitude + shift;
                var y = position.coords.longitude + shift;
                rest_api.sendCoordinates({
                    x: x,
                    y: y
                }).then(function(groupMembersCoordinates) {
                    user.onCoordinatesGet(groupMembersCoordinates);
                });
            });
        }
    }
    //End Test


    return user;

});