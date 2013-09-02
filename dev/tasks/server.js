var path = require('path'),
	createServer = require('../../server/Server.js');

module.exports = function(grunt){
	grunt.registerMultiTask('server', 'Development server', function(){
		var data = this.data;

		var root = data.root || path.resolve(__dirname, '../../devServer');
		var port = data.port || 80;
		var host = data.host;

		createServer(port, host, root);
	});
};