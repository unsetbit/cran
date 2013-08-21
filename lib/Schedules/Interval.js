// All time values are in milliseconds
module.exports = function createInterval(interval, startTime){
	var lastTime = (startTime || Date.now()) - interval;

	return function getNextTime(){
		lastTime += interval;
		return lastTime;
	};
};