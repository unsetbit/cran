var Interval = require('./Interval.js');

// All time values are in milliseconds
module.exports = function createFuzzyInterval(options){
	var interval = Interval(options),
		fuzz = options.fuzz ? parseInt(options.fuzz, 10) : 0,
		doubleFuzz = fuzz * 2;

	function getFuzz(){
		return Math.round(Math.random() * doubleFuzz - fuzz);
	}

	function getApi(){
		return {
			options: options,
			nextTime: nextTime
		};
	}

	function nextTime(){
		return interval.nextTime() + getFuzz();	
	}

	return getApi();
};