var express = require('express');
var path = require('path');
var restService = require('./server/rest.service');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

var config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  req.appconfig = config;
  next();
});



app.get('/obj', (req, res) => {
  res.json({});
});


app.use('/api', restService);

app.listen(3000, () => {
  console.log("server running on port:3000");
});