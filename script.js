const myLibrary = [];
const bookDisplay = document.querySelector(".grid-container")
const dialog = document.querySelector("dialog")

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call contstructor");
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
    this.info = function() {
        return(`${this.title} by ${this.author}, ${this.pages} pages. ${this.read}`)
    };
    this.idInfo = function() {
        return(this.id)
    };
    this.infoReadStatus = function () {
        return(this.read)
    };
}

Book.prototype.toggleRead = function() {
    if (this.read == "read") {
        this.read = "not read yet";
        return;
    }
    else return this.read = "read";
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

function btnToggleRead() {
    const clickedElement = event.target.closest("div")
    if (!clickedElement) return;
    
    //find ID of book, match to array obj, call toggleRead proto function, 
    //      update textcontent and obj data for read
    const targetID = clickedElement.dataset.id;
    const matchArrayObject = myLibrary.find(book => book.idInfo() === targetID);
    const objIndex = myLibrary.findIndex(book => book.idInfo() === targetID);
        if (objIndex > -1) {
        myLibrary[objIndex].toggleRead();
        displayBook();
    }
}

function btnRemoveClick() {
    const clickedElement = event.target.closest("div");
    if (!clickedElement) return; //function will not proceed if not attached to div

    //find ID of book and match to myLibrary object, remove matching bookDisplay div
    const targetID = clickedElement.dataset.id;
    const matchArrayObject = myLibrary.find(book => book.idInfo() === targetID);
    bookDisplay.removeChild(clickedElement);

    //find index of target book in myLibrary and splice at the position to remove
    const objIndex = myLibrary.findIndex(book => book.idInfo() === targetID);
    if (objIndex > -1) {
        myLibrary.splice(objIndex, 1); 
    }
}

function addBookButtons(thisBookDiv) {
    //Get ID of attached book
    const bookID = thisBookDiv.idInfo();
    //Remove
    const buttonRemove = document.createElement("button");
    buttonRemove.classList.add("grid-item", "btnRemove", bookID);
    buttonRemove.indexNumber = bookID;
    buttonRemove.textContent = "Remove Book";
    thisBook.appendChild(buttonRemove);
    buttonRemove.addEventListener("click", btnRemoveClick, false);
    //Toggle Read
    const buttonToggleRead = document.createElement("button");
    buttonToggleRead.classList.add("grid-item", "btnToggleRead", bookID);
    buttonToggleRead.indexNumber = bookID;
    buttonToggleRead.textContent = "Toggle Read Status";
    thisBook.appendChild(buttonToggleRead);
    buttonToggleRead.addEventListener("click", btnToggleRead, false);
}

function displayBook() {
    //When adding new books clear existing books so page does not double up
    while (bookDisplay.firstChild) {
        bookDisplay.removeChild(bookDisplay.firstChild);
    }
    myLibrary.forEach(book => {
        thisBook = document.createElement("div");
        thisBook.classList.add("grid-item", book.idInfo());
        thisBook.dataset.id = book.idInfo();
        thisBook.textContent = book.info();
        console.log(book.infoReadStatus())
        if (book.infoReadStatus() == "read") {
            thisBook.classList.add("readStatusGreen");
        }        
        else thisBook.classList.add("readStatusRed");
        bookDisplay.appendChild(thisBook);
        addBookButtons(book);
    });
}

//<---- sample books to generate on page for testing...
addBookToLibrary("The Hobbit", "JRR Tolkein", "1234", "not read");
addBookToLibrary("The Lord of the Rings", "JRR Tolkein", "3345", "read")
addBookToLibrary("The Lord of the Rings 2", "JRR Tolkein", "4345", "read")
addBookToLibrary("The Lord of the Rings 3", "JRR Tolkein", "5345", "read")
addBookToLibrary("The Golden Fool", "Robin Hobb", "1345", "read")
addBookToLibrary("The Big Book", "John Bookington", "9999", "not read")
displayBook();
// end testing samples ---->

//Get dialog form input and put into array and then display on page
document.getElementById("bookFormID").addEventListener("submit", function(event) {
    event.preventDefault(); // Blocks the default form page reload\
    const formTitle = document.forms["bookForm"]["title"].value;
    const formAuthor = document.forms["bookForm"]["author"].value;
    const formPages = document.forms["bookForm"]["pages"].value + " pages";
    const formRead = document.forms["bookForm"]["read"].value;
    addBookToLibrary((formTitle), (formAuthor), (formPages), (formRead));
    displayBook();
    dialog.close();
});