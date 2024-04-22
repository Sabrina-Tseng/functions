//set up swap method
Array.prototype.swap = function(a, b) {
	var temp = this[a];
	this[a] = this[b];
	this[b] = temp;
};

function millisecToDates(millisec, callback){
	// Time calculations for days, hours, minutes and seconds
	let days = Math.floor(millisec / (1000 * 60 * 60 * 24));
	let hours = Math.floor((millisec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((millisec % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((millisec % (1000 * 60)) / 1000);

	return callback(days,hours,minutes,seconds);
}

function displayTimeAsNumber(days,hours,minutes,seconds){
    // Display the result
    let output = '';
    if (days != 0) {
        output += days + "d "
    }
    if (hours != 0) {
        output += hours + ":"
    }
    output += minutes + ":"
    output += addZeroIfLessThan10(seconds);
    return output;
}

function displayTimeAsWords(days,hours,minutes,seconds){
		// Display the result
		let output = '';
		if (days != 0) {
			output += days + "d "
		}
		if (hours != 0) {
			output += hours + "h "
		}
		if (minutes != 0) {
			output += minutes + "m "
		}
		output += seconds + "s ";
		return output;
}

function addZeroIfLessThan10(num){
	if (num >= 0 && num < 10){
		return '0' + num
	} else {
		return num
	}
}