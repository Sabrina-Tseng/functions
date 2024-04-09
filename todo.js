//========== countdown timer ==========

//find in html
const globalCountdown = document.getElementById('global-countdown');
const planTime = document.querySelector('input[type="time"]');

//count down
let timer;
function startGlobalTimer(){

	//reset timer
	clearInterval(timer);

	//set time on the same day
	let timeNow = new Date();
	let monthNow = timeNow.getMonth()+1
	let dateNow = timeNow.getDate()
	let yearNow = timeNow.getFullYear()

	let timeEnd = new Date( monthNow + '/' + dateNow + '/' + yearNow + ' ' + planTime.value);

	//if set time is earlier than current time, set to next day
	if (timeNow > timeEnd) {
		timeEnd.setDate(timeEnd.getDate() + 1)
	}

	//timer
	//https://www.w3schools.com/howto/howto_js_countdown.asp
	timer = setInterval(function() {

		// Get today's date and time
		let now = new Date().getTime();

		// Find the distance between now and the count down date
		let distance = timeEnd.getTime() - now;

		globalCountdown.innerHTML = millisecToDates(distance, displayTimeAsWords);

		// If the count down is finished, write some text
		if (distance < 0) {
			clearInterval(timer);
			document.getElementById('countdown-msg').innerHTML = 'You are late!'
		}

	}, 1000);
}
function millisecToDates(millisec, callback){
	// Time calculations for days, hours, minutes and seconds
	let days = Math.floor(millisec / (1000 * 60 * 60 * 24));
	let hours = Math.floor((millisec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((millisec % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((millisec % (1000 * 60)) / 1000);

	return callback(days,hours,minutes,seconds);
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

//when changed, save in localstorage and start the timer wit the new time
planTime.oninput = () => {
	storePlanTime(planTime.value);
	startGlobalTimer();
}
// Save to localStorage
function storePlanTime(input) {
	localStorage.setItem("planTimeStorage", input);
}

//========== todo list ==========

//find in html
const dotolist = document.getElementById('todo-list');
const form =  document.getElementById('form');
const addButton = document.getElementById('add-button');
const startBtn = document.getElementById('start-routine');

//set up swap method
Array.prototype.swap = function(a, b) {
	var temp = this[a];
	this[a] = this[b];
	this[b] = temp;
};

//object constructor
class task {
	constructor(name, duration) {
		this.name = name;
		this.duration = duration;
	}
}

//add to array
function addNewTask(name,duration){
	let newTask = new task(name, duration);
	todoItems.push(newTask);
}

//refresh todolist
function displayTask(){

	//save to local storage
	storeTodoList();

	let list = '';

	todoItems.forEach((item) =>{
		list += `
			<li>
				<div class='flex'>
					<div>
						<h3>${item.name}</h3>
						<p>${item.duration} minutes</p>
					</div>
					<div class='right'>
						<div class='time-left'>
							<p>${item.duration}:00</p>
						</div>
						<div class='list-control'>
							<div class='arrow'>
								<span class='up-arrow'>▲</span>
								<span class='down-arrow'>▼</span>
							</div>
							<div class='no-space'>
								<div class='delete'>
									<span>✖</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class='progress-bar'>
					<progress class="bar" value="0" max="100"></progress>
				</div>
			</li>
			`
	})
	dotolist.innerHTML = list;

	//sort
	const upArrows = document.querySelectorAll(".up-arrow");
	const downArrows = document.querySelectorAll(".down-arrow");

	for ( let i in upArrows ){
		upArrows[i].onclick = function(){
			if (i > 0){
				todoItems.swap(i-1,i);
				displayTask();
			}
		}
	}
	for ( let i in downArrows ){
		downArrows[i].onclick = function(){
			if (i < downArrows.length-1){
				todoItems.swap(+i+1,i);
				displayTask();
			}
		}
	}

	//delete
	const deleteBtn = document.querySelectorAll(".delete");
	for ( let i in deleteBtn ){
		deleteBtn[i].onclick = function(){
				todoItems.splice(i,1);
				displayTask();
		}
	}

}

//jquery sortable list
// !function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);
// $( function() {
// 	$( "#todo-list" ).sortable();
//   } );

//add new task
addButton.onclick = () => {

	//hide add button
	addButton.classList.add("hidden");
	startBtn.classList.add("hidden");

	//show add form
	//for, id, and name should match
	form.innerHTML = `
		<form name="add-form" id="add-form">
			<section>
				<label for="task">Task</label><br>
				<input type="text" id="task" name="task" required><br>
				<label for="time">Duration</label><br>
				<input type="number" id="time" name="time" min="1" required> minutes
			</section>
			<button type="submit">Add</button>
		</form>
	`
	const addform =  document.getElementById('add-form');

	//submit new task
	addform.onsubmit = (event) => {
		event.preventDefault();
	
		const taskInput = addform.elements.task;
		const timeInput = addform.elements.time;
		
		if (taskInput.value != '' && timeInput.value > 0) {
			// console.log("add");
			addNewTask(taskInput.value, timeInput.value);
			displayTask();

			//hide add form and show add button
			form.innerHTML = "";
			addButton.classList.remove("hidden");
			startBtn.classList.remove("hidden");
		};
	};
};

// Save to localStorage
function storeTodoList() {
	localStorage.setItem("todoItemStorage", JSON.stringify(todoItems));
}

//========== todo list countdown ==========
// https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown

//find in html
const bars = document.getElementsByClassName('bar');
const nums = document.getElementsByClassName('time-left');

//start timer
startBtn.onclick = () => {
	startItemTimer(0);
}

//count down
let itemTimer;
function startItemTimer(i){

	//reset timer
	clearInterval(itemTimer);

	//set end time
	let timeNow = new Date();
	let timeEnd = new Date(timeNow.getTime() + todoItems[i].duration*60000)
	console.log(timeEnd);
	let maxBarLength = timeEnd.getTime() - new Date().getTime();
	bars[i].max = maxBarLength;

	//timer
	itemTimer = setInterval(function() {

		// Get today's date and time
		let now = new Date().getTime();

		// Find the distance between now and the count down date
		let distance = timeEnd.getTime() - now;

		nums[i].innerHTML = millisecToDates(distance, displayTimeAsNumber);
		bars[i].value = maxBarLength - distance;

		// If the count down is finished, write some text
		if (distance < 0) {
			nums[i].innerHTML = '0:00';
			clearInterval(timer);
			if(i<todoItems.length) {
				startItemTimer(i+1);
			}
		}

	}, 10);

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
		if (seconds < 10) {
			seconds = '0'+ seconds;
		}
		output += seconds;
		return output;
}


//========== on load ==========

//empty database array
let todoItems = [];

//check if there's local storage
if (localStorage.length > 0) {
	//list
	todoItems = JSON.parse(localStorage.getItem('todoItemStorage')); // Update the form from localStorage
	if (todoItems.length == 0){
		//default list
		addNewTask('Brush teeth',3);
		addNewTask('Use toilet',5);
		addNewTask('Get dressed',10);
	}
	displayTask();
	//time
	planTime.value = localStorage.getItem('planTimeStorage');
} 
else {
	//default list
	addNewTask('Brush teeth',3);
	addNewTask('Use toilet',5);
	addNewTask('Get dressed',10);
	displayTask();
	//default time
	planTime.value = "09:00";
	storePlanTime(planTime.value);
}

startGlobalTimer();