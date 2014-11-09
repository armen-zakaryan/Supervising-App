var Promise = require("node-promise").Promise;
var jf = require('jsonfile');
var dbPath = "./server/db/jsonStorage/Storage/coordinates.json";

//OnLoad take the last Id and keep
var last_id;
(function() {
    jf.readFile(dbPath, function(err, obj) {
        if (obj.length) {
            last_id = obj.slice(-1).pop().id; //geting the last node
        } else last_id = 0;
    });
})();



//Adding coordinates
function setCoordinates(point) {
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            point.id = ++last_id;
            obj.push(point);
            jf.writeFileSync(dbPath, obj);
        } else {
            console.log(err);
        }
    });
}

//delete Old one's
function deleteOldData() {
    setTimeout(function() {
        clean();
        deleteOldData();
    }, 50000);
}

//Part of delete old one's
function clean() {
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            console.log("clean Up ");
            if (obj.length > 20) {
                obj = obj.splice(20, obj.length);
            }
            jf.writeFileSync(dbPath, obj);
        } else {
            console.log(err);
        }
    });
}

//get Online User cordinates
function getCoordinate(userId) {
    var promise = new Promise();
    jf.readFile(dbPath, function(err, obj) {
        if (!err && obj) {
            for (var i = obj.length - 1; i > 0; i--) {
                if (obj[i].userId == userId) {
                    promise.resolve({
                        x: obj[i].x,
                        y: obj[i].y
                    });
                    break;
                }
            }
        } else {
            console.log(err);
            promise.reject()
        }
    });
    return promise;
}


module.exports.setCoordinates = setCoordinates;
module.exports.getCoordinate = getCoordinate;
module.exports.deleteOldData = deleteOldData;