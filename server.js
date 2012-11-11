var shoe = require('shoe');
var http = require('http');
var net = require('net');
var spies = require('spies');
var ecstatic = require('ecstatic');

var LOGO = require('fs').readFileSync('logo');

var ncs = [];
var browsers = [];

var addStream = function(col, stream) {
	col.push(stream);
	stream.on('close', function() {
		col.splice(col.indexOf(stream), 1);
	});
};

var server = http.createServer(ecstatic('public'));

var sock = shoe(function(stream) {
	addStream(browsers, stream);
	ncs.forEach(function(nc) {
		nc.pipe(stream, {end:false}).pipe(nc, {end:false});
	});
});

net.createServer(function(stream) {
	stream.write(LOGO);
	stream.write(' type help for a list of commands\n\n');
	addStream(ncs, stream);
	browsers.forEach(function(browser) {
		stream.pipe(browser, {end:false}).pipe(stream, {end:false});
	});

	var spy = spies();

	spy.on('peers', function() {
		spy.log({
			browsers:browsers.length,
			ncs:ncs.length
		});
	});

	stream.pipe(spy).pipe(stream);
}).listen(10101);

server.listen(process.env.PORT);
sock.install(server, '/spy');
