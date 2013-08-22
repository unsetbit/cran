module.exports = function(port, hostname){
	hostname = hostname || window.location.hostname;
	var ws = new WebSocket('ws://' + hostname + ':' + port);
	ws.onmessage = function(event){
		var data = JSON.parse(event.data);
	};

};
