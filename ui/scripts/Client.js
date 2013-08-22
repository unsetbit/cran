module.exports = function(port, hostname){
	'use strict';
	
	hostname = hostname || window.location.hostname;
	var ws = new WebSocket('ws://' + hostname + ':' + port);
	ws.onmessage = function(event){
		JSON.parse(event.data);
	};

};
