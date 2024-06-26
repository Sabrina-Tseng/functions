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
		document.getElementById('currentTime').innerHTML = now.getHours() + ':'+ addZeroIfLessThan10(now.getMinutes());

		// Find the distance between now and the count down date
		let distance = timeEnd.getTime() - now.getTime();

		//display coutdown
		globalCountdown.innerHTML = millisecToDates(distance, displayTimeAsWords);

		// if time left is less than routine, show a warning
		const warning = document.getElementById('warning');
		if ( distance < totalRoutineTime() ){
			if (currentMode == 'play'){
				warning.innerHTML = 'Hurry up!'
				warning.style.animation = 'blinker 1s step-start infinite'
			} else {
				warning.innerHTML = `Not enough time for routine`
				warning.style.animation = 'none'
			}
		} else {
			warning.innerHTML = '';
		}

		// If the count down is finished, write some text
		if (distance < 0 ) {
			clearInterval(timer);
			if (currentMode == 'play'){
				document.getElementById('global-countdown').innerHTML = 'You are late!'
			} else {
				//restart timer if not in play mode
				startGlobalTimer()
			}
		}
	}, 1000);
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
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const skipBtn = document.getElementById('skip-btn');
const stopBtn = document.getElementById('stop-btn');

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

	//set mode
	document.getElementById('todo-list').classList.add('edit');

	let list = '';

	todoItems.forEach((item) =>{
		list += `
			<li draggable='true'>
				<div class='flex'>
					<div>
						<h3 class='item-name'>${item.name}</h3>
						<p class='item-duration'><span>${item.duration}</span> minutes</p>
					</div>
					<div>
						<div class='time-left hidden'>
							<p>${item.duration}:00</p>
						</div>
						<div class='list-control'>
							<div class='arrow'>
								<span class='up-arrow'>▲</span>
								<span class='down-arrow'>▼</span>
							</div>
							<div class='no-x-space'>
								<div>
									<div class='delete'>
										<span>✖</span>
									</div>
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
	// https://www.codingnepalweb.com/drag-and-drop-sortable-list-html-javascript/
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
			displayTask();
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

	//click to edit
	document.querySelectorAll('.item-name').forEach((itemname,index) => {
		itemname.onclick = () => {

			console.log('h3 clicked')
			
			// no drag
			document.querySelectorAll('#todo li').forEach(item => {
				item.setAttribute('draggable', false);
				item.style.cursor = 'default';
			});

			itemname.innerHTML = `<input type="text" id="item-name-input" name="item-name-input" value="${itemname.innerHTML}">`
			const inputbox = document.querySelector('.item-name > input');

			// flexible width
			//https://stackoverflow.com/questions/3392493/adjust-width-of-input-field-to-its-input
			inputbox.style.width = inputbox.value.length + "ch";
			inputbox.oninput = () => {
				inputbox.style.width = inputbox.value.length + "ch";
			}

			// active input box
			inputbox.focus();

			// not clickable again
			itemname.onclick = () => {}

			//when clicked outside
			inputbox.onblur = () => {
				// console.log(index)
				if(inputbox.value.trim() != ''){
					todoItems[index].name = inputbox.value.trim()
				}
				displayTask();
			}
		}
	});
	document.querySelectorAll('.item-duration').forEach((itemname,index) => {
		itemname.onclick = () => {

			// no drag
			document.querySelectorAll('#todo li').forEach(item => {
				item.setAttribute('draggable', false);
				item.style.cursor = 'default';
			});

			itemname.innerHTML = `<input type="number" id="item-duration-input" name="item-duration-input" min="1" max="60" value="${todoItems[index].duration}"> minute`
			const inputbox = document.querySelector('.item-duration > input');

			inputbox.style.width = 'calc(var(--gutter)*1.25)';

			// active input box
			inputbox.focus();

			// not clickable again
			itemname.onclick = () => {}

			//when clicked outside
			inputbox.onblur = () => {
				// console.log(index)
				if(inputbox.value.trim() != ''){
					todoItems[index].duration = inputbox.value.trim()
				}
				displayTask();
			}
		}
	});

}

//========== add new task ==========
addButton.onclick = () => {

	//hide add button
	// addButton.classList.add("hidden");

	//show add form
	//for, id, and name should match
	form.innerHTML = `
		<form name="add-form" id="add-form">
			<div id='form-title'>
				<p>Add a new task</p><span id='close' class="material-symbols-outlined">close</span>
			</div>
			<section id='input-box'>
				<div>
					<input type="text" id="task" name="task" required>
					<label for="task">Task Name</label>
				</div>
				<div>
					<input type="number" id="time" name="time" min="1" required> 
					<label for="time">Duration (min)</label>
				</div>
			</section>
				<button type="submit">Add</button>
		</form>
	`
	window.scrollTo(0, document.body.scrollHeight);
	document.getElementById('close').onclick = () =>{
		form.innerHTML = "";
		addButton.classList.remove("hidden");
	}

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

	//when pressed the stop button, set all bars to 0
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

	currentItem = i;
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
			clearInterval(itemTimer);

			if( i < todoItems.length-1 ) {
				startItemTimer(i+1);
			} else {
				done();
			}
		}

		//done
		function done(){

			clearInterval(itemTimer)
			
			// pauseBtn.classList.add('hidden');
			// resumeBtn.classList.add('hidden');
			// skipBtn.classList.add('hidden');
			// currentItem = i+1;

			const endingOverlay = document.getElementById('ending-overlay')
			endingOverlay.innerHTML = `
				<p>Well done!</p>
				<p>You've completed all of your tasks.</p>
				<button id='done-back'><span class="material-symbols-outlined"> arrow_back </span>Back to To-Do list</button>`

			endingOverlay.classList.add('active')
			endingOverlay.style.opacity='100%'


			console.log('confetti!')
			// confetti!
			// https://www.kirilv.com/canvas-confetti/
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ['000000', 'FFA500']
			});

			// reset btn
			document.getElementById('done-back').onclick = () => {
				endingOverlay.innerHTML = '';
				endingOverlay.classList.remove('active');
				endingOverlay.style.opacity='0%'

				startItemTimer('stop');
				displayTask();
				editMode();
				startGlobalTimer();
			}
		}

		//skip
		for ( let clickedlist in lists ) {

			//if it's not the current active list, add the click to skip action
			if (clickedlist != i) {

				lists[clickedlist].onclick = () => {

					pauseBtn.classList.remove('hidden');
					resumeBtn.classList.add('hidden');
					
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
		skipBtn.onclick = () => {

			pauseBtn.classList.remove('hidden');
			resumeBtn.classList.add('hidden');

			const nextlist = parseInt(i)+1
			lists[i].classList.add('past');

			if( i < todoItems.length-1 ) {
				startItemTimer(nextlist);
			} else {
				done();
			}
		}

		//save time that already pass
		let alreadyPass = maxBarLength - distance;
		currentItem_timepassed = alreadyPass;

		//pause
		list.onclick = () => pause()
		pauseBtn.onclick = () => pause()

		function pause(){
			clearInterval(itemTimer);
			list.classList.add('pause');
			pauseBtn.classList.add('hidden');
			resumeBtn.classList.remove('hidden');

			// console.log(maxBarLength)
			// console.log(distance)

			//resume
			list.onclick = () => resume()
			resumeBtn.onclick = () => resume()

			function resume(){
				list.classList.remove('pause');
				pauseBtn.classList.remove('hidden');
				resumeBtn.classList.add('hidden');

				//calculate new endtime
				let timeNow = new Date();
				let timeEnd = new Date(timeNow.getTime() + todoItems[i].duration*60000 - alreadyPass)
				// console.log(timeEnd);
				startTimer(i,timeEnd,maxBarLength)
			}
		}
	}, 10);
}


//========== total routine timer ==========
let currentItem = -1;
let currentItem_timepassed = 0;

function totalRoutineTime(){

	//caculate total routine time need
	let routineTimeInMS = 0;
	todoItems.forEach((item) =>{
		routineTimeInMS += (item.duration)*60000;
	})

	//if in play mode, minus the time already pass
	if (currentMode == 'play'){
		// console.log('timepassed ' + currentItem_timepassed)
		routineTimeInMS -= currentItem_timepassed;

		//items that already passed
		for (let i = 0; i < currentItem; i++) {
			routineTimeInMS -= todoItems[i].duration*60000;
		}
	}

	//also update on page
	if (routineTimeInMS > 0) {
		document.getElementById('routine-time').innerHTML = millisecToDates(routineTimeInMS, displayTimeAsWords);
	} else {
		document.getElementById('routine-time').innerHTML = '0s'
	}

	return routineTimeInMS;
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
	startGlobalTimer();
}

let currentMode = 'edit';

//play mode
function playMode(){

	currentMode = 'play';

	//colors
	document.documentElement.style.setProperty('--bg-color', 'white');
	document.documentElement.style.setProperty('--text-color', 'black');
	document.documentElement.style.setProperty('--translucent-bg-color', 'rgba(0, 0, 0, 0.03)');

	//hide arrows & delete btn
	document.querySelectorAll('.list-control').forEach(item => {
		item.classList.add("hidden");
	});

	//set drag and cursor
	document.querySelectorAll('#todo li').forEach(item => {
		item.setAttribute('draggable', false);
		item.style.cursor = 'pointer';
	});

	//show timer number
	document.querySelectorAll('.time-left').forEach(item => {
		item.classList.remove("hidden");
	});

	//toggle buttons
	addButton.classList.add("hidden");
	startBtn.classList.add("hidden");
	stopBtn.classList.remove("hidden");
	pauseBtn.classList.remove("hidden");
	skipBtn.classList.remove("hidden");
	document.getElementById('add').classList.add("hidden");

	//disable click to edit
	document.getElementById('todo-list').classList.remove('edit')
	document.querySelectorAll('.item-name').forEach(itemname => {
		itemname.onclick = () => {}
		itemname.onmouseover = () =>{}
	});
	document.querySelectorAll('.item-duration').forEach(itemname => {
		itemname.onclick = () => {}
		itemname.onmouseover = () =>{}
		
	});
}

//edit mode
function editMode(){

	currentItem = -1;
	currentMode = 'edit';

	document.documentElement.style.setProperty('--bg-color', 'black');
	document.documentElement.style.setProperty('--text-color', 'white');
	document.documentElement.style.setProperty('--translucent-bg-color', 'rgba(255, 255, 255, 0.1)');

	document.querySelectorAll('.list-control').forEach(item => {
		item.classList.remove("hidden");
	});

	document.querySelectorAll('.time-left').forEach(item => {
		item.classList.add("hidden");
	});

	addButton.classList.remove("hidden");
	startBtn.classList.remove("hidden");
	stopBtn.classList.add("hidden");
	pauseBtn.classList.add("hidden");
	resumeBtn.classList.add("hidden");
	skipBtn.classList.add("hidden");
	document.getElementById('add').classList.remove("hidden");
}


//========== greeting ==========
function setGreeting(){
		let now = new Date();
		const greeting = document.getElementById('greeting');

		if ( now.getHours() < 12 ) {
			greeting.innerHTML = 'Good Morning'
		} else if ( now.getHours() < 17 ){
			greeting.innerHTML = 'Good Afternoon'
		} else {
			greeting.innerHTML = 'Good Evening'
		}
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
setGreeting();