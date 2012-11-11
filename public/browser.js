var shoe = require('shoe');
var spies = require('spies');

var connect = function() {
	var stream = shoe('http://'+(location.hostname || 'localhost')+'/spy');
	var spy = spies();

	spy.on('whoami', function() {
		spy.log(window.navigator.userAgent);
	});
	spy.on('fill', function(color) {
		document.body.style.backgroundColor = color;
		spy.log('i am now '+color);
	});
	spy.on('title', function() {
		document.title = Array.prototype.slice.call(arguments).join(' ');
		spy.log('title is now '+document.title);
	});
	spy.on('text', function() {
		var msg = Array.prototype.slice.call(arguments).join(' ');
		document.getElementById('text').innerHTML = msg;
		spy.log('i said '+msg);
	});
	spy.on('barrel-roll', function() {
		document.getElementById('placeholder').className = 'barrel-roll';
		setTimeout(function() {
			document.getElementById('placeholder').className = '';
		}, 1500);
		spy.log('do a barrel roll');
	});
	spy.on('window', function() {
		spy.log({
			x: window.screenX,
			y: window.screenY,
			width: window.outerWidth,
			height: window.outerHeight
		});
	});
	spy.on('reload', function() {
		location.reload(true);
	});
	spy.on('has', function(feature) {
		spy.log(feature+' is '+(window[feature] ? '' : 'not ')+'available');
	});

	stream.pipe(spy).pipe(stream);

	stream.on('end', function() {
		setTimeout(connect, 1000);
	});
};

window.onload = function() {
	connect();
};