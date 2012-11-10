var shoe = require('shoe');
var spies = require('spies');

window.onload = function() {
	var stream = shoe('http://'+(location.hostname || 'localhost')+':10101/spy');
	var spy = spies();

	spy.on('where', function() {
		spy.log('i am the browser!');
	});
	spy.on('color', function(color) {
		document.body.style.backgroundColor = color;
		spy.log('i am now '+color);
	});
	spy.on('print', function() {
		var msg = Array.prototype.slice.call(arguments).join(' ');
		document.body.innerHTML += msg+'<br>';
		spy.log('i said '+msg);
	});

	stream.pipe(spy).pipe(stream);
};