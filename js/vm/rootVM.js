define(['ko', 'profile', 'session', 'user', 'admin', 'event', 'group'], function(ko, profile, session, user, admin, events, group) {

    session.onLogin = function(result) {
        var mySwitch = {
            'Admin': function(result) {
                window.location.hash = 'admin/' + result.admin.id;
            },
            'User': function(result) {
                user.firstName(result.user.username);
                user.id(result.user.id);
                window.location.hash = 'users/' + result.user.id;
                user.sendData();
                events.setUserData(result.user);
                user.setUserData(result.user);
            },
        };
        mySwitch[session.option()](result);
    };

    user.onCoordinatesGet = function(coordinates) {
        events.groupMembersCoordinates(coordinates);
    };

    profile.onCreateProfile = function(value) {
        session.option(value);
        window.location.hash = 'session';
    };

    window.onbeforeunload = function() {
        session.loguot();
    };


    return {
        path: ko.observable(''),
        profile: profile,
        login: session,
        user: user,
        admin: admin,
        event: events,
        group: group
    }
});