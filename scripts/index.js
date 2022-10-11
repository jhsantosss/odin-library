class Book {
  constructor (title, author, pages, isRead) {

    this.title = title;
    this.author = author || 'Not provided';
    this.pages = pages || 'Not provided';
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
    this.selectedIndex;
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
    if (this.#checkEmptTitle() && !this.#hasBook(data.title)) {
      this.books[this.selectedIndex] = new Book(data.title, data.author, data.pages, data.isRead);
      return true;
    }
  }

  resetInput() {
    const input = this.#getInput();
    return input.forms.reset();
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

  #addBook(title, author, pages, isRead) {
    if (!this.#hasBook(title)) {
      this.books.push(new Book(title, author, pages, isRead));
    }
  }

  #checkEmptTitle() {
    const input = this.#getInput();

    if(input.title.value.trim().length === 0) {
      alert('Sorry, title must be provided.');
      return false;
    }

    return true;
  }

  #editBookInfo(selectedBook) {
    const bookToBeEdited = selectedBook;

    toggleModal();

    addBook.value = 'Update';

    const input = this.#getInput();

    input.title.value = bookToBeEdited.title;
    input.author.value = (bookToBeEdited.author != 'Not provided') ? bookToBeEdited.author : '';
    input.pages.value = (bookToBeEdited.pages != 'Not provided') ? bookToBeEdited.pages : '';
    input.isRead.checked = (bookToBeEdited.isRead === 'Yes') ? true : false;
    
  }

  #getInput() {
    const inputForms = document.querySelector('#bookInfo');
    const inputTitle = document.querySelector('#title');
    const inputAuthor = document.querySelector('#author');
    const inputPages = document.querySelector('#pages');
    const inputIsRead = document.querySelector('#check');
    const input = {
      forms: inputForms,
      title : inputTitle,
      author : inputAuthor,
      pages : inputPages,
      isRead : inputIsRead,
    };
    return input;
  }

  #getData() {
    const input = this.#getInput();
    const data = {
      title : input.title.value,
      author : input.author.value,
      pages : input.pages.value,
      isRead : input.isRead.checked ? 'Yes' : 'No',
    };
    return data;
  }

  #hasBook(wantedBook) {
    if (!!this.books.some(item => item.title === wantedBook)) {
      alert ('Sorry, this title has already been registered.')
      return true;
    }
    return false;
  }

  #removeBook(wantedBook) {
    this.books = this.books.filter(item => item.title != wantedBook);
    this.buildTable();
  }

  #selectBook(wantedTitle) {
    const selectedBook = this.books.filter(item => item.title === wantedTitle).at(0);
    this.selectedIndex = this.books.indexOf(selectedBook);
    
    return selectedBook;
  }

  #updateActions() {
    const deleteButton = document.querySelectorAll('.removeBook');
    deleteButton.forEach(item => {
      item.addEventListener('click', () => {
        this.#removeBook(item.id.replace('-delete', ''));
      });
    });

    const editButton = document.querySelectorAll('.editBook');
    editButton.forEach(item => {
      item.addEventListener('click', () => {
        this.#editBookInfo(this.#selectBook(item.id.replace('-edit', '')));
      });
    });
  }
}

const myBooks = new Library();

const addBook = document.querySelector('#addBook');
const modal = document.querySelector("#modal");
const newBook = document.querySelector("#newBook");
const closeModal = document.querySelector("#close");

function toggleModal() {
  if (modal.style.display === "block") {
    modal.style.display = "none";
    resetModal();
    myBooks.resetInput();
    return;
  }
  modal.style.display = "block";
}

newBook.onclick = toggleModal;

closeModal.onclick = toggleModal;

window.onclick = event => { if (event.target == modal) toggleModal() };

addBook.onclick = event => {
  event.preventDefault();

  if (addBook.value === 'Update') {
    if (myBooks.updateBook()) {
      myBooks.buildTable();
      myBooks.resetInput();
      toggleModal();
    }
  } else {
      if (myBooks.getBook()) {
        myBooks.buildTable();
        myBooks.resetInput();
        toggleModal();
    }
  }
}

function resetModal() {
  addBook.value = 'Add';
}