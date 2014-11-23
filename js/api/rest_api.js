define([], function() {
    var baseUrl = "http://localhost:3300/rest/v1";
    var authenticationData;

    return {
        authenticate: function(data) {
            var promise = $.ajax({
                url: baseUrl + '/' + data.option().toLowerCase() + 's/authentication',
                type: "GET",
                headers: {
                    username: data.username(),
                    password: data.password()
                },
                contentType: 'application/json',
            });
            promise.done(function(jqXHR) {
                authenticationData = jqXHR;
            });
            return promise;
        },

        loguot: function() {
            $.ajax({
                url: baseUrl + '/users/' + authenticationData.user.id,
                type: "PUT",
                contentType: 'application/json',
            });
            authenticationData = {};
        },

        checkUsernameExistance: function(data) {
            return $.ajax({
                url: baseUrl + '/users/' + data.username(),
                type: "GET",
                contentType: 'json',
            });
        },

        createAccount: function(option, obj) {
            return $.ajax({
                url: baseUrl + '/users',
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    profile: obj
                })
            });
        },

        getUsersByName: function(name) {
            return $.ajax({
                url: baseUrl + '/users/' + authenticationData.user.id + '/' + name,
                type: "GET",
                contentType: 'json'
            });
        },

        createGroup: function(group) {
            group.creatorId = authenticationData.user.id;
            return $.ajax({
                url: baseUrl + '/users/' + authenticationData.user.id + '/groups/',
                headers: {
                    'x-access-token': authenticationData.token
                },
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(group)
            });
        },

        sendCoordinates: function(data) {
            data.userId = authenticationData.user.id;
            return $.ajax({
                url: baseUrl + '/users/' + authenticationData.user.id + '/coordinates/',
                headers: {
                    'x-access-token': authenticationData.token
                },
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data)
            });
        },

        startSupervise: function(m) {
            var arr = [];
            m.forEach(function(el) {
                arr.push(el.userId);
            });
            $.ajax({
                url: baseUrl + '/users/' + authenticationData.user.id + '/group/',
                type: "PUT",
                contentType: 'application/json',
                data: JSON.stringify(arr)
            });
        },

        getUserGroups: function() {
            return $.ajax({
                url: baseUrl + '/user/' + authenticationData.user.id + '/groups',
                type: "GET",
                contentType: 'json '
            });
        }


    }
});