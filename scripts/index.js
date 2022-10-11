class Book {
  constructor (title, author, pages, isRead) {

    this.title = title;
    this.author = author || 'Unknown';
    this.pages = pages || 'Unknown';
    this.isRead = isRead;

  }

    info() {
      if (this.read) { 
        return `${this.title} by ${this.author}, ${this.pages} pages, already read.`;
      }
      return `${this.title} by ${this.author}, ${this.pages} pages, not read yet.`;
    }
}

class Library {
  constructor () {
    this.books = [];
  }

  #hasBook(wantedBook) {
    return !!this.books.some(item => item.title === wantedBook);
  }

  #addBook(title, author, pages, isRead) {
    if (!this.#hasBook(title)) {
      this.books.push(new Book(title, author, pages, isRead));
    }
  }

  #removeBook(wantedBook) {
    this.books = this.books.filter(item => item.title != wantedBook);
    this.buildTable();
  }

  #editBook(wantedBook) {
    const bookToBeEdited = this.books.filter(item => item.title === wantedBook)[0];
    const index = this.books.indexOf(bookToBeEdited);
    aux = index;
    showModal();
    addBook.value = 'Update';

    const inputTitle = document.querySelector('#title');
    const inputAuthor = document.querySelector('#author');
    const inputPages = document.querySelector('#pages');
    const inputIsRead = document.querySelector('#check');

    inputTitle.value = bookToBeEdited.title;
    inputAuthor.value = bookToBeEdited.author;
    inputPages.value = bookToBeEdited.pages;
    inputIsRead.checked = (bookToBeEdited.isRead === 'Yes') ? true : false;

  }

  #checkEmptTitle() {
    const inputTitle = document.querySelector('#title');

    if(inputTitle.value.trim().length === 0) {
      alert('Sorry, title must be provided.');
      return false;
    }

    return true;
  }

  #updateActions() {
    const deleteButton = document.querySelectorAll('.removeBook');
    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].addEventListener('click', () => {
        this.#removeBook(deleteButton[i].id.replace('-delete', ''));
      });
    }

    const editButton = document.querySelectorAll('.editBook');
    for (let i = 0; i < deleteButton.length; i++) {
      editButton[i].addEventListener('click', () => {
        this.#editBook(editButton[i].id.replace('-edit', ''));
      });
    }
  }

  #getData() {
    const inputTitle = document.querySelector('#title');
    const inputAuthor = document.querySelector('#author');
    const inputPages = document.querySelector('#pages');
    const inputIsRead = document.querySelector('#check:checked') ? 'Yes' : 'No';
    const data = {
      title : inputTitle.value,
      author : inputAuthor.value,
      pages : inputPages.value,
      isRead : inputIsRead,
    };
    return data;
  }

  getBook() {
    const data = this.#getData();
    if (this.#checkEmptTitle()) {
      this.#addBook(data.title, data.author, data.pages, data.isRead);
      return true;
    }
  }

  updateBook() {
    const data = this.#getData();
    if (this.#checkEmptTitle()) {
      this.books[aux].title = data.title;
      this.books[aux].author = data.author;
      this.books[aux].pages = data.pages;
      this.books[aux].isRead = data.isRead;
      return true;
    }
  }

  resetInput() {
    const forms = document.querySelector('#bookInfo');
    return forms.reset();
  }

  buildTable() {
    const table = document.querySelector('#booksTable');
    table.innerHTML = '';
    this.books.forEach(item => {
      let idDelete = `${item.title}-delete`;
      let idEdit = `${item.title}-edit`;
      let row = `<tr>
                   <td>${item.title}</td>
                   <td>${item.author}</td>
                   <td>${item.pages}</td>
                   <td>${item.isRead}</td>
                   <td>
                    <button id="${idEdit}" class="editBook">Edit</button>
                    <button id="${idDelete}" class="removeBook">Delete</button>
                   </td>
                 <tr>`;
      table.innerHTML += row;
    })
    this.#updateActions();
  }
}

const myBooks = new Library();

const addBook = document.querySelector('#addBook');
const modal = document.querySelector("#modal");
const newBook = document.querySelector("#newBook");
const closeModal = document.querySelector("#close");

const showModal = () => modal.style.display = "block";
const hideModal = () => {
  modal.style.display = "none";
  resetModal();
}

let aux = '';

newBook.onclick = showModal;

closeModal.onclick = hideModal;

window.onclick = event => { if (event.target == modal) hideModal() };

addBook.onclick = event => {
  event.preventDefault();

  if (addBook.value === 'Update') {
    if (myBooks.updateBook()) {
      myBooks.buildTable();
      myBooks.resetInput();
      hideModal();
    }
  } else {
      if (myBooks.getBook()) {
        myBooks.buildTable();
        myBooks.resetInput();
        hideModal();
    }
  }
}

function resetModal() {
  addBook.value = 'Add';
}