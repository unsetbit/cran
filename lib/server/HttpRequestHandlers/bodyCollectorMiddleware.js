// Helper middleware to collect the body before other handlers
module.exports = function rawBodyMiddleware(req, res, next){
	req.rawBody = '';
	req.setEncoding('utf8');
	req.on('data', function(chunk){ req.rawBody += chunk; });
	req.on('end', function(){next();})
}