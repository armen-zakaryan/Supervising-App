var Promise = require("node-promise").Promise;
var jf = require('jsonfile');
var dbPath = "./server/db/jsonStorage/Storage/User.json";



//OnLoad take the last Id and keep
var last_id;
(function() {
    jf.readFile(dbPath, function(err, obj) {
        last_id = obj.slice(-1).pop().id; //geting the last node
    });
})();

//Creating a new Account
function createAccount(data, res) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            data.id = ++last_id;
            obj.push(data);
            jf.writeFileSync(dbPath, obj);
            promise.resolve(data.id);
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Checking the Username for createing a new Account
function checkUsernameExistance(username) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            if (obj.every(function(element) {
                if (element.username === username) {
                    promise.resolve(true);
                    return false;
                } else return true;
            })) {
                promise.resolve(false);
            }
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

// Authentication
function find(user) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            //If the username equal exactly then resolve true othervise resovle false;
            if (obj.every(function(element) {
                if (element.username === user.username && element.password == user.password) {
                    promise.resolve(element);
                    return false;
                } else return true;
            })) {
                promise.resolve(false);
            }
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Get All Matched Users
function getMatchedUsers(name, userId) {
    var promise = new Promise();
    var arr = [];
    var re = new RegExp('^' + name); // starting from name typed by user;
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            obj.forEach(function(element, index, array) {
                if (re.exec(element.username) && element.id != userId) {
                    arr.push({
                        username: element.username,
                        id: element.id
                    });
                }
            });
            if (arr.length) {
                promise.resolve(arr);
            } else {
                promise.resolve(false);
            }
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Add group to users
function addGroup(users, groupId) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            obj.forEach(function(element, index, array) {
                users.forEach(function(userId) {
                    if (userId === element.id) {
                        if (!element.groups) {
                            element.groups = [groupId];
                        } else {
                            element.groups.push(groupId);
                        }
                    }
                })
            });
            jf.writeFileSync(dbPath, obj);
            promise.resolve();
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Get User Groups
function getUserGroups(userId) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            obj.every(function(element) {
                if (element.id == userId) {
                    promise.resolve(element.groups);
                    return false;
                } else return true;
            });
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Join Users
function Join(groups) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            groups.forEach(function(group) {
                var newGroupMember = [];
                group.groupMembers.forEach(function(groupMember) {
                    obj.forEach(function(user) {
                        if (groupMember == user.id) {
                            newGroupMember.push({
                                userId: user.id,
                                username: user.username
                            });
                        }
                    });
                });
                group.groupMembers = newGroupMember;
            });
            promise.resolve(groups);
        } else {
            console.log(err);
            promise.reject();
        }
    });
    return promise;
}

module.exports.Join = Join;
module.exports.find = find;
module.exports.getMatchedUsers = getMatchedUsers;
module.exports.checkUsernameExistance = checkUsernameExistance;
module.exports.createAccount = createAccount;
module.exports.addGroup = addGroup;
module.exports.getUserGroups = getUserGroups;