// Application main entry point, treat it like main() function.
require(['config'], function() {

    require(['jquery', 'ko', 'ko-external', 'infuser', 'rootVM', 'routie', 'bootstrap'],
        function($, ko, koExternal, infuser, rootVM) {
            infuser.defaults.templatePrefix = 'templates/';
            routie('', function() {
                window.location.hash = 'home';
            });

            routie('home', function() {
                changeHash();
            });

            routie('profile/?:username', function(username) {
                rootVM.profile.username(username);
                changeHash();
            });
            routie('session', function() {
                changeHash();
            });
            routie('404', function() {
                changeHash();
            });
            routie('401', function() {
                changeHash();
            });
            routie('users/?:userID', function() {
                changeHash();
            });
            routie('users/?:userID/events', function() {
                changeHash();
            });
            routie('profile', function() {
                changeHash();
            });

            function changeHash(newLocation) {
                newLocation = newLocation || window.location.hash.substring(1);
                rootVM.path(newLocation);
            }




            ko.applyBindings(rootVM);
        });

});