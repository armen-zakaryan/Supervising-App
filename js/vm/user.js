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
    var userData;
    var testSwitch = {
        General: getMyCoordinates,
        Test: getMyCoordinatesTest,
        up: getMyCoordinatesTest,
        down: getMyCoordinatesTest,
        right: getMyCoordinatesTest,
        left: getMyCoordinatesTest
    }

    user.setUserData = function(userD) {
        userData = userD;
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
            user.testSwitchOptions() && testSwitch[user.testSwitchOptions()](user.testSwitchOptions());
            sendCoordinates();
        }, 3000);
    }

    function getMyCoordinates() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                rest_api.sendCoordinates({
                    x: position.coords.latitude,
                    y: position.coords.longitude,
                    username: userData.username
                }).then(function(groupMembersCoordinates) {
                    user.onCoordinatesGet(groupMembersCoordinates);
                });
            });
        }
    }

    //Start Test
    var shift_x = 0.001;
    var shift_y = 0.001;

    function getMyCoordinatesTest(direction) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var data = makeDirection(position, direction);

                rest_api.sendCoordinates(data).then(function(groupMembersCoordinates) {
                    user.onCoordinatesGet(groupMembersCoordinates);
                });
            });
        }
    }

    function makeDirection(position, direction) {
        if (direction === 'Test') {
            shift_x += 0.001;
            shift_y += 0.001;
            var x = position.coords.latitude + shift_x;
            var y = position.coords.longitude + shift_y;
        } else if (direction === 'up') {
            shift_y += 0.001;
            var x = position.coords.latitude + shift_x;
            var y = position.coords.longitude + shift_y;
        } else if (direction === 'down') {
            shift_y -= 0.001;
            var x = position.coords.latitude + shift_x;
            var y = position.coords.longitude + shift_y;
        } else if (direction === 'right') {
            shift_x += 0.001;
            var x = position.coords.latitude + shift_x;
            var y = position.coords.longitude + shift_y;
        } else if (direction === 'left') {
            shift_x -= 0.001;
            var x = position.coords.latitude + shift_x;
            var y = position.coords.longitude + shift_y;
        }
        return {
            x: x,
            y: y,
            username: userData.username
        }
    }
    //End Test


    return user;

});