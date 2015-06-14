var keypair = require('keypair');
var fs = require('fs');

var pair = keypair();
fs.writeFile('./server/public.key', pair.public, function() {
	console.log('Wrote public key to ./server/public.key');
});
fs.writeFile('./server/private.key', pair.private, function() {
	console.log('Wrote private key to ./server/private.key');
});
