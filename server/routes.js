var jwt = require('jwt-simple');
var moment = require('moment');
var userService = require('./userService.js');

//Secret Key for Token
var secret = 'MySinglePageApp';

//Incapsulating in function
function routes(app) {
    var baseUrl = "/rest/v1/";
    //Keep the list of active Users
    var activeUsers = {};
    var coordinates = {};

    app.get('/', function(req, res) {
        res.render("index");
    });

    //Authentication function check the token
    var authenticate = function(req, res, next) {
        var token = req.headers && req.headers['x-access-token'];
        if (token) {
            try {
                var decoded = jwt.decode(token, secret);
                if (decoded.exp <= Date.now())
                    res.status(401).send('Access token has expired');
                else next();
            } catch (err) {
                res.send(401);
            }
        } else res.send(401);
    }

    // User Authenticate   Token genertion
    app.get(baseUrl + 'users/authentication', function(req, res) {
        userService.User.find(req.headers)
            .then(function(user) {
                    if (user) {
                        //add User to ctive user List
                        activeUsers[user.id] = user;
                        console.log('Login user ', user.id);
                        var expires = moment().add('seconds', 360).valueOf();
                        var token = jwt.encode({
                            iss: user.userID,
                            exp: expires
                        }, secret);
                        res.json({
                            token: token,
                            expires: expires,
                            user: user
                        });
                    } else {
                        res.status(404).send('Not found');
                        res.end();
                    }
                },
                function(error) {
                    console.log(error)
                });
    });

    //geting Username validation requests Login
    app.get(baseUrl + 'users/:username', function(req, res) {
        userService.User.checkUsernameExistance(req.params.username)
            .then(function(answer) {
                    if (answer) {
                        res.status(200).send();
                        res.end();
                    } else res.status(404).send('Not found');
                },
                function(error) {
                    console.log(error)
                });
    });
    //Logout  deleting usr from  active user list
    app.put(baseUrl + 'users/:userid', function(req, res) {
        activeUsers[req.params.userid] && delete activeUsers[req.params.userid];
        console.log('LogOut user ', req.params.userid);
        res.send();
    });
    // New User Acount
    app.post(baseUrl + 'users', function(req, res) {
        userService.User.createAccount(req.body.profile)
            .then(function(id) {
                    console.log(" Created " + id);
                    res.status(200).json(id);
                },
                function(error) {
                    res.status(501).send('Not Implemented');
                    console.log(error)
                });
    });

    //geting all matched Users 
    app.get(baseUrl + 'users/:userId/:name', function(req, res) {
        userService.User.getMatchedUsers(req.params.name, req.params.userId)
            .then(function(result) {
                    if (result) {
                        res.json({
                            value: result
                        });
                        res.end();
                    } else res.status(404).send('Not found');
                },
                function(error) {
                    console.log(error)
                });
    });


    // New Group
    app.post(baseUrl + 'users/:id/groups', function(req, res) {
        userService.Groups.createGroup(req.body).then(function(data) {
            data.users.push(req.body.creatorId);
            userService.User.addGroup(data.users, data.groupId)
                .then(function(id) {
                        console.log(" group " + data.groupId + " Created And added to userList");
                        res.status(200).json(data.groupId);
                    },
                    function(error) {
                        res.status(501).send('Not Implemented');
                        console.log(error)
                    });
        });
    });

    //Get User group list
    app.get(baseUrl + 'user/:userId/groups', function(req, res) {
        userService.User.getUserGroups(req.params.userId)
            .then(function(result) {
                userService.Groups.formGroupsByIds(result).then(function(groups) {
                    userService.User.Join(groups).then(function(data) {
                        if (data) {
                            res.json({
                                value: data
                            });
                            res.end();
                        } else res.status(404).send('Not found');
                    });
                });
            }, function(error) {
                console.log(error)
            });
    });

    //set Selected Group Members
    app.put(baseUrl + 'users/:id/group', function(req, res) {
        console.log('User ' + req.params.id + ' has selected users ' + req.body + ' for supervising');
        activeUsers[req.params.id].currentSupervisedGroupMembers = req.body;
        res.send();
    });

    //set Coordinates and get if group has been specified by that user
    //in other words if the user enter the mode of superviser then it will get the coordinates of  the given group members
    app.post(baseUrl + 'users/:id/coordinates', function(req, res) {
        coordinates[req.params.id] = req.body;
        var user = activeUsers[req.params.id];
        if (user && user.currentSupervisedGroupMembers) {
            var arr = [];
            user.currentSupervisedGroupMembers.forEach(function(element) {
                activeUsers[element] && coordinates[element] && arr.push(coordinates[element]);
            });
        }
        res.send(arr);
    });

}


module.exports.routes = routes;