var shoe = require('shoe');
var http = require('http');
var net = require('net');
var ecstatic = require('ecstatic');

var spies = [];
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
	spies.forEach(function(spy) {
		spy.pipe(stream, {end:false}).pipe(spy);
	});
});

net.createServer(function(stream) {
	addStream(spies, stream);
	browsers.forEach(function(browser) {
		stream.pipe(browser, {end:false}).pipe(stream);
	});
}).listen(10101);

server.listen(process.env.PORT);
sock.install(server, '/spy');
