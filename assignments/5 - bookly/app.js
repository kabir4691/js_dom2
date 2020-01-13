const booksStorageKey = "bookly-books";
const hideAllStorageKey = "bookly-hide-all";

let books = JSON.parse(window.localStorage.getItem(booksStorageKey)) || [];
let hideAll = JSON.parse(window.localStorage.getItem(hideAllStorageKey)) || false; // boolean value

let bookAutoIndex = Date.now();
let searchText = "";

const searchBooksInput = document.querySelector("#search-books > input[type=text]");
const addBookButton = document.querySelector("#add-book > button");
const addBookInput = document.querySelector("#add-book-input");
const booksListView = document.querySelector("#book-list > ul");
const hideAllCheckBox = document.getElementById("hide");

searchBooksInput.addEventListener("input", function() {
    event.preventDefault();
    searchText = this.value;
	createListView();
});

addBookButton.addEventListener("click", event => {
	event.preventDefault();
	const text = addBookInput.value.trim();
	if (text != "") {
		searchBooksInput.value = "";
		addBook(text);
		addBookInput.value = "";
		addBookInput.focus();
	}
});

booksListView.addEventListener("click", event => {
	let target = event.target;

	if (target.classList.contains("delete")) {
		let bookKey = target.parentElement.dataset.key;
		deleteBook(bookKey);
	}
});

hideAllCheckBox.addEventListener("click", function() {
	hideAllBooks(this.checked);
});

function addBook(name) {
	const book = {
		id: `book-${++bookAutoIndex}`,
		name: name
	};
	books.push(book);
	updateLocalStorage();
	createListView();
}

function deleteBook(key) {
	books.splice(books.indexOf(getBook(key)), 1);
	updateLocalStorage();
	createListView();
}

function updateBook(key, text) {
	getBook(key).text = text;
	updateLocalStorage();
	createListView();
}

function hideAllBooks(isHidden) {
	hideAll = isHidden;
	updateLocalStorage();
	createListView();
}

function updateLocalStorage() {
	window.localStorage.setItem(booksStorageKey, JSON.stringify(books));
	window.localStorage.setItem(hideAllStorageKey, JSON.stringify(hideAll));
}

function createListView() {
    hideAllCheckBox.checked = hideAll;	
	booksListView.innerHTML = "";

	if (!hideAll) {
		books.forEach(book => {
			if (!book.name.toLowerCase().includes(searchText.toLowerCase())) {
				return;
			}
			let li = document.createElement("li");
			li.setAttribute("data-key", book.id);
			let span = document.createElement("span");
			span.classList.add("book");
			span.innerHTML = book.name;
			let button = document.createElement("button");
			button.classList.add("delete");
			button.innerHTML = "Del";
			li.append(span, button);
			booksListView.appendChild(li);
		});
	}
}

let getBook = key => books[books.findIndex(book => book.id === key)];

createListView();
