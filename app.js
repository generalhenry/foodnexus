var express = require('express');
var app = express.createServer();

app.use(express.static(process.cwd() + '/public'));

app.listen(process.env.port || 8080);
