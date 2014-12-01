var http = require('http'),
	fs = require('fs'),
	path = require('path');
	
var Config = require('./config.json');
var PackageDB = new Object();

var Start = function () {
	server = http.createServer(Request);
	server.listen(Config.port);
};

var Request = function ( req, res ) {
	fs.readFile(path.join('./', req.url), function (err, data) {
		if (err) {
			res.writeHead(400);
			res.write(err);
			res.end();
		} else {
			res.writeHead(200);
			res.write(data);
			res.end();
		}
	});
};

Start();
