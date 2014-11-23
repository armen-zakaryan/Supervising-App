var jsonStorage = {
    User: require('./db/jsonStorage/User.js'),
    Groups: require('./db/jsonStorage/Groups.js')
}

/*
var mongodb = {}
var mysql = {}
*/

module.exports = jsonStorage; // Setting the database to work with