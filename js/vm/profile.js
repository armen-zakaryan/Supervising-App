define(['ko', 'rest_api', 'classProfile'], function(ko, rest_api, classProfile) {

    var profile = {
        userenamexist: ko.observable(false),
        username: ko.observable(),
        password: ko.observable(),
        email: ko.observable(),
        gender: ko.observable(),
        age: ko.observable(),
        photo: ko.observable(),
        option: ko.observable(''),
    }

    //Show create button
    profile.allowCreate = ko.computed(function() {
        if (profile.username() && !profile.userenamexist() && profile.password() && profile.email())
            return true;
        else return false;
    });

    profile.username.subscribe(function() {
        var result = rest_api.checkUsernameExistance(profile);
        result.done(function() {
            profile.userenamexist(true);
        });
        result.fail(function() {
            profile.userenamexist(false);
        });
    });

    profile.createAccount = function() {
        var result = rest_api.createAccount(profile.option().toLowerCase(), new classProfile(profile));
        result.done(function() {
            alert("User Successfuly created");
            profile.onCreateProfile(profile.option());
        });
        result.fail(function() {
            alert("Sorry, operation is not Done .There was a problem with the server, Please try latter");
            window.location.hash = '/';
        });
    }

    return profile;
});