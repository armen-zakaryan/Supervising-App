var Promise = require("node-promise").Promise;
var jf = require('jsonfile');
var dbPath = "./server/db/jsonStorage/Storage/Groups.json";



//OnLoad take the last Id and keep
var last_id;
(function() {
    jf.readFile(dbPath, function(err, obj) {
        if (obj.length) {
            last_id = obj.slice(-1).pop().id; //geting the last node
        } else last_id = 0;
    });
})();

//Creating a new Account
function createGroup(data, res) {
    var arr = [];
    data.groupMembers.forEach(function(element, index, array) {
        arr.push(element.id);
    });
    data.groupMembers = arr;
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            data.id = ++last_id;
            obj.push(data);
            jf.writeFileSync(dbPath, obj);
            promise.resolve({
                users: data.groupMembers,
                groupId: data.id
            });
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}

//Form an array of group indexes and group names
function formGroupsByIds(arrayOfIndexes) {
    var promise = new Promise();
    var arr = [];
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            obj.forEach(function(element) {
                arrayOfIndexes.forEach(function(e) {
                    if (e == element.id) {
                        arr.push(element);
                    }
                });
            });
            promise.resolve(arr);
        } else {
            console.log(err);
            promise.reject();
        }
    });
    return promise;
}

//Get All Matched Users
function getGroupMembers(groupId) {
    console.log("get get group by ID ", name);
    /*
    var promise = new Promise();
    var arr = [];
    var re = new RegExp('^' + name); // starting from name typed by user;
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            obj.forEach(function(element, index, array) {
                if (re.exec(element.username)) {
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
    });*/
    return promise;
}

module.exports.formGroupsByIds = formGroupsByIds;
module.exports.getGroupMembers = getGroupMembers;
module.exports.createGroup = createGroup;