require('nodetime').profile();
var express = require('express');
var app = express.createServer();

app.use(express.static(process.cwd() + '/public'));

app.listen(process.env.PORT || 8080);
