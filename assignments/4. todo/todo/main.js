const todoItemsStorageKey = "todo-app-items";
const viewModeStorageKey = "todo-app-view-mode";
let todoItems = JSON.parse(window.localStorage.getItem(todoItemsStorageKey)) || [];
let viewMode = window.localStorage.getItem(viewModeStorageKey) || "all"; // possible values are all, active and completed

let todoAutoIndex = Date.now();

const form = document.getElementById("input-form");
form.addEventListener("submit", event => {
	event.preventDefault();
	const inputBox = document.getElementById("input-box");
	const text = inputBox.value.trim();
	if (text != "") {
		addTodo(text);
		inputBox.value = "";
		inputBox.focus();
	}
});

const list = document.getElementById("todo-list");
list.addEventListener("click", event => {
	let target = event.target;

	if (target.classList.contains("check-todo")) {
		let itemKey = target.parentElement.dataset.key;
		toggleDone(itemKey);
	}

	if (target.classList.contains("delete-todo")) {
		let itemKey = target.parentElement.dataset.key;
		deleteTodo(itemKey);
	}
});

// For double click
document.addEventListener("click", event => {
	let target = event.target;
	let doubleClickFunc = function(event) {
		onDoubleClick(event.target);
	};
	target.addEventListener("click", doubleClickFunc);
	setTimeout(() => target.removeEventListener("click", doubleClickFunc), 300);
});

function onDoubleClick(element) {
	console.log(element);
	if (element.classList.contains("text-todo")) {
		let itemKey = element.parentElement.dataset.key;
		let item = getTodo(itemKey);

		let input = document.createElement("input");
		input.classList.add("text-todo");
		if (item.isDone) {
			input.classList.add("text-todo-done");
		}
		input.value = item.text;
		element.parentNode.replaceChild(input, element);
	}
}

list.addEventListener("focusout", event => {
	let target = event.target;
	if (target.classList.contains("text-todo")) {
		let itemKey = target.parentElement.dataset.key;
		updateTodo(itemKey, target.value);
	}
});

list.addEventListener("keyup", event => {
	console.log(event);
	let target = event.target;
	if (event.keyCode == 13 && target.classList.contains("text-todo")) {
		let itemKey = target.parentElement.dataset.key;
		updateTodo(itemKey, target.value);
	}
});

const todoTypes = document.getElementById("todo-types");
todoTypes.addEventListener("click", event => {
	switch (event.target["id"]) {
		case "todo-type-all":
			viewMode = "all";
			break;
		case "todo-type-active":
			viewMode = "active";
			break;
		case "todo-type-completed":
			viewMode = "completed";
			break;
	}
	updateLocalStorage();
	createListView();
});

const clearCompleted = document.getElementById("clear-completed");
clearCompleted.addEventListener("click", event => {
	todoItems = todoItems.filter(item => !item.isDone);
	updateLocalStorage();
	createListView();
});

createListView();

function addTodo(text) {
	const todo = {
		id: `todo-${++todoAutoIndex}`,
		text: text,
		isDone: false
	};
	todoItems.push(todo);
	updateLocalStorage();
	createListView();
}

function toggleDone(key) {
	getTodo(key).isDone = !getTodo(key).isDone;
	updateLocalStorage();
	createListView();
}

function deleteTodo(key) {
	todoItems.splice(todoItems.indexOf(getTodo(key)), 1);
	updateLocalStorage();
	createListView();
}

function updateTodo(key, text) {
	getTodo(key).text = text;
	updateLocalStorage();
	createListView();
}

function updateLocalStorage() {
	window.localStorage.setItem(todoItemsStorageKey, JSON.stringify(todoItems));
	window.localStorage.setItem(viewModeStorageKey, viewMode);
}

function createListView() {
	const list = document.getElementById("todo-list");
	list.innerHTML = "";
	let todoTypes = document.getElementById("todo-types");
	Array.from(todoTypes.getElementsByTagName("span")).forEach(element => {
		element.classList.remove("todo-type-selected");
	});

	todoItems.forEach(item => {
		let li = document.createElement("li");
		li.setAttribute("data-key", item.id);
		let input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.classList.add("check-todo");
		let span = document.createElement("span");
		span.classList.add("text-todo");
		if (item.isDone) {
			span.classList.add("text-todo-done");
		}
		span.innerHTML = item.text;
		let button = document.createElement("button");
		button.classList.add("delete-todo");
		button.innerHTML = "X";
		li.append(input, span, button);

		switch (viewMode) {
			case "all":
				list.insertBefore(li, list.childNodes[0]);
				break;
			case "active":
				if (!item.isDone) {
					list.insertBefore(li, list.childNodes[0]);
				}
				break;
			case "completed":
				if (item.isDone) {
					list.insertBefore(li, list.childNodes[0]);
				}
				break;
		}
	});

	let counterContainer = document.getElementById("todo-counter-container");
	let totalCount = todoItems.length;
	if (totalCount == 0) {
		counterContainer.style.display = "none";
	} else {
		counterContainer.style.display = "flex";
		let counter = document.getElementById("todo-counter");
		let undoneCount = todoItems.filter(item => item.isDone == false).length;
		if (undoneCount == 1) {
			counter.innerHTML = "1 item left";
		} else {
			counter.innerHTML = `${undoneCount} items left`;
		}
	}

	switch (viewMode) {
		case "all":
			document.getElementById("todo-type-all").classList.add("todo-type-selected");
			break;
		case "active":
			document.getElementById("todo-type-active").classList.add("todo-type-selected");
			break;
		case "completed":
			document.getElementById("todo-type-completed").classList.add("todo-type-selected");
			break;
	}

	let clearCompleted = document.getElementById("clear-completed").getElementsByTagName("span")[0];
	clearCompleted.style.display = todoItems.filter(item => item.isDone).length > 0 ? "block" : "none";
}

let getTodo = key => todoItems[todoItems.findIndex(item => item.id === key)];
