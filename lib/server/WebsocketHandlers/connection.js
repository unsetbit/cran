module.exports = function(jobs, socket){
	console.log('new connection!');
	socket.on('close', function(){
		console.log('connection closed!');
	});
};