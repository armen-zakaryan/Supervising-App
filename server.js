var express = require('express');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var routes = require('./server/routes.js'); //requesting  my module routes



var app = express();
app.use(bodyParser());
app.use(express.static(__dirname + '/'));
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/');


routes.routes(app);


app.listen(3300, function(req, res) {
    console.log("Server is running on port 3300");
});