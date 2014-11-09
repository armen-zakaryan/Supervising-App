define(['jquery', 'ko', 'rest_api', 'bootstrap'], function($, ko, rest_api) {


    var group = {
        name: ko.observable(),
        search: ko.observable(),
        userList: ko.observableArray(),
        selectedUserList: ko.observableArray(),
        selectedUser: ko.observable()
    };

    //initilizing observables;
    function init() {
        with(group) {
            name(''),
            search(''),
            userList([]),
            selectedUserList([]),
            selectedUser('')
        }
    }

    //Show create button
    group.allowCreate = ko.computed(function() {
        if (group.name())
            return true;
        else return false;
    });

    group.search.subscribe(function(val) {
        var result = rest_api.getUsersByName(val);
        result.done(function(result) {
            group.userList(result.value);
        });
        result.fail(function() {
            group.userList('');
        });

    });

    group.createGroup = function() {
        var result = rest_api.createGroup({
            groupName: group.name(),
            groupMembers: group.selectedUserList()
        });
        result.done(function() {
            alert("Group was successfuly created");
            init();
        });
        result.fail(function() {
            alert("Sorry, operation is not Done .There was a problem with the server, Please try latter");
            window.location.hash = '/';
            init();
        });
    }

    group.addUsertoList = function() {
        group.userList().forEach(function(element) {
            if (element.id === group.selectedUser()) {
                group.selectedUserList.remove(element); // In order not allow repeatitions
                group.selectedUserList.push(element);
            }
        });
    }

    group.removefromUserList = function(item) {
        group.selectedUserList.remove(item);
    }



    return group;
});