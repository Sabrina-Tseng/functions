//database array
const todoItems = [];

//find in html
const dotolist = document.getElementById('todo-list');
const form =  document.getElementById('form');
const addButton = document.getElementById('add-button');

//set up swap method
// Array.prototype.swap = function(a, b){
// 	this[a] = this.splice(b, 1, this[a])[0];
// 	return this;
// }
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

//default list
addNewTask('brush teeth',3);
addNewTask('use toilet',5);
addNewTask('get dressed',10);


//refresh todolist
function displayTask(){
	let list = '';

	todoItems.forEach(item =>{
		list += `
			<li>
				<div>
					<h3>${item.name}</h3>
					<p>${item.duration} minutes</p>
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
displayTask();

//jquery sortable list
// !function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);
// $( function() {
// 	$( "#todo-list" ).sortable();
//   } );

//add new task
addButton.addEventListener("click",function(e){
	addButton.classList.add("hidden");
	form.innerHTML = `
		<form name="add-new-task" id="add-form">
			<div>
				<label for="task">Task</label><br>
				<input type="text" id="task" name="task" required><br>
				<label for="time">Duration</label><br>
				<input type="number" id="time" name="time" min="1" required> minutes
			</div>
			<button type="submit">Add</button>
		</form>
	`
	const addform =  document.getElementById('add-form');

	addform.addEventListener('submit', function(e){
		e.preventDefault();
	
		const taskInput = addform.elements.task;
		const timeInput = addform.elements.time;
		
		if (taskInput.value != '' && timeInput.value > 0) {
			console.log("add");
			addNewTask(taskInput.value, timeInput.value);
			displayTask();
			form.innerHTML = "";
			addButton.classList.remove("hidden");
		};
	})
});