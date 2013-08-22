// All time values are in milliseconds
module.exports = function createInterval(options){
	var interval = parseInt(options.interval, 10),
		startTime = options.startTime ? parseInt(options.startTime, 10) : Date.now(),
		lastTime = startTime - interval;

	function getApi(){
		return {
			options: options,
			nextTime: nextTime
		};
	}

	function nextTime(){
		lastTime += interval;
		return lastTime;
	}

	return getApi();
};