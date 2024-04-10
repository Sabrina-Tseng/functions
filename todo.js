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
		let now = new Date();

		//display in h1
		document.getElementById('currentTime').innerHTML = now.getHours() + ':'+ now.getMinutes();

		// Find the distance between now and the count down date
		let distance = timeEnd.getTime() - now.getTime();

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
const stopBtn = document.getElementById('stop-routine');

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
			<li draggable='true'>
				<div class='flex'>
					<div>
						<h3>${item.name}</h3>
						<p>${item.duration} minutes</p>
					</div>
					<div class='right'>
						<div class='time-left hidden'>
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

	//sort with arrows
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

	//drag to sort
	// const handles = document.querySelectorAll("#todo li");

	// handles.forEach(handle => {
	// 	handle.addEventListener('dragstart', dragstart);
	// 	handle.addEventListener('dragend', dragend)
	// 	handle.addEventListener('dragover', dragover)
	// });
	// function dragstart(){
	// 	console.log('drag start')
	// };
	// function dragend(){
	// 	console.log('drag end')
	// };
	// function dragover(){
	// 	console.log('drag over')
	// };

	const sortableList = document.querySelector("#todo-list");
	const items = document.querySelectorAll("#todo li");
	items.forEach(item => {
		let tempIndex;
		item.addEventListener("dragstart", () => {
			// Adding dragging class to item after a delay
			setTimeout(() => item.classList.add("dragging"), 0);
			//remember the starting position
			tempIndex = findIndex(item);
		});
		// Removing dragging class from item on dragend event
		item.addEventListener("dragend", () => {
			item.classList.remove("dragging")

			//also update the database array
			//save the original
			let tempObj = todoItems[tempIndex];
			//delete from array
			todoItems.splice(tempIndex, 1);
			//insert to new position
			todoItems.splice(findIndex(item), 0, tempObj);
			console.log(todoItems);
			storeTodoList();
		});
	});
	const initSortableList = (e) => {
		e.preventDefault();
		const draggingItem = document.querySelector(".dragging");

		// Getting all items except currently dragging and making array of them
		let siblings = [...sortableList.querySelectorAll("#todo li:not(.dragging)")];

		// Finding the sibling after which the dragging item should be placed
		let nextSibling = siblings.find(sibling => {
			// console.log(sibling.offsetTop)
			// console.log(sibling.offsetHeight)
			// console.log(window.scrollY);
			return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2 - window.scrollY;
			// return e.clientY <= sibling.offsetTop - sibling.offsetHeight;
		});

		// Inserting the dragging item before the found sibling
		sortableList.insertBefore(draggingItem, nextSibling);
	}
	sortableList.addEventListener("dragover", initSortableList);
	sortableList.addEventListener("dragenter", e => e.preventDefault());
	

	//delete
	const deleteBtn = document.querySelectorAll(".delete");
	for ( let i in deleteBtn ){
		deleteBtn[i].onclick = function(){
				todoItems.splice(i,1);
				displayTask();
		}
	}

}
//determine the li index in the ol
function findIndex(li)
{
	var nodes = Array.from( dotolist.children );
	var index = nodes.indexOf( li );
	return index;
	// console.log(li);
	// console.log(index);
}

// const ulList = document.getElementById("todo-list");
// document.getElementById("todo-list").addEventListener("click",function(e) {

// 	var li = e.target.closest('li');
// 	var nodes = Array.from( ulList.children );
// 	var index = nodes.indexOf( li );

// 	console.log(li);
// 	console.log(index);
// });


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

//count down
let itemTimer;
function startItemTimer(i){

	//reset timer
	clearInterval(itemTimer);

	if (i == 'stop'){
		Array.from(bars).forEach((bar) => {
			bar.value = 0;
		})
	}
	else {
		//set li active
		const list = document.querySelectorAll('#todo-list li')[i];
		list.classList.add('active');

		//set end time
		let timeNow = new Date();
		let timeEnd = new Date(timeNow.getTime() + todoItems[i].duration*60000)
		console.log(timeEnd);
		let maxBarLength = timeEnd.getTime() - new Date().getTime();
		bars[i].max = maxBarLength;
	
		startTimer(i,timeEnd,maxBarLength);
	}
}
function startTimer(i, timeEnd, maxBarLength){
	const lists = document.querySelectorAll('#todo-list li');
	const list = document.querySelectorAll('#todo-list li')[i];
	//timer
	itemTimer = setInterval(function() {

		// Get today's date and time
		let now = new Date().getTime();

		// Find the distance between now and the count down date
		let distance = timeEnd.getTime() - now;

		nums[i].innerHTML = millisecToDates(distance, displayTimeAsNumber);
		bars[i].value = maxBarLength - distance;

		// when finished, move to next item
		if (distance < 0) {
			nums[i].innerHTML = '0:00';
			list.classList.remove('active');
			list.classList.add('past');
			clearInterval(timer);
			if(i<todoItems.length) {
				startItemTimer(i+1);
			}
		}

		//skip
		for ( let clickedlist in lists ) {

			//if it's not the current active list, add the click to skip action
			if (clickedlist != i) {

				lists[clickedlist].onclick = () => {
					
					//go through the list again and set past the one before
					for ( let listnum in lists ){
						if ( listnum < clickedlist ){
							lists[listnum].classList.add('past');
						}
					}
					//start the timer of the clicked list
					startItemTimer(clickedlist);
				}
			}
		};

		//pause
		list.onclick = () => {
			clearInterval(itemTimer);
			// list.classList.remove('active');
			list.classList.add('pause');

			console.log(maxBarLength)
			console.log(distance)
			let alreadyPass = maxBarLength - distance;

			list.onclick = () => {
				// list.classList.add('active');
				list.classList.remove('pause');
				let timeNow = new Date();
				let timeEnd = new Date(timeNow.getTime() + todoItems[i].duration*60000 - alreadyPass)
				console.log(timeEnd);
				startTimer(i,timeEnd,maxBarLength)
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

//========== modes ==========

//start
startBtn.onclick = () => {
	window.scrollTo(0,0);
	startItemTimer(0);
	playMode();
}
//stop
stopBtn.onclick = () => {
	// window.scrollTo(0,0);
	startItemTimer('stop');
	displayTask();
	editMode();
}

//play mode
function playMode(){

	document.documentElement.style.setProperty('--bg-color', 'white');
	document.documentElement.style.setProperty('--text-color', 'black');

	document.querySelectorAll('.list-control').forEach(item => {
		item.classList.add("hidden");
	});

	document.querySelectorAll('.time-left').forEach(item => {
		item.classList.remove("hidden");
	});

	addButton.classList.add("hidden");
	startBtn.classList.add("hidden");
	stopBtn.classList.remove("hidden");
}

//edit mode
function editMode(){

	document.documentElement.style.setProperty('--bg-color', 'black');
	document.documentElement.style.setProperty('--text-color', 'white');

	document.querySelectorAll('.list-control').forEach(item => {
		item.classList.remove("hidden");
	});

	document.querySelectorAll('.time-left').forEach(item => {
		item.classList.add("hidden");
	});

	addButton.classList.remove("hidden");
	startBtn.classList.remove("hidden");
	stopBtn.classList.add("hidden");
}

//========== on load ==========

let mode = 'edit';
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