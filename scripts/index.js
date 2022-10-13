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
    this.selectedIndex = 0;
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
    
    this.books.forEach(item => table.appendChild(createRow(item)));
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
    if ((this.books[this.selectedIndex]?.title != wantedBook)
      && (!!this.books.some(item => item.title === wantedBook))) {
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

function createRow(item) {
  const idDelete = `${item.title}-delete`;
  const idEdit = `${item.title}-edit`;

  const row = document.createElement('tr');

  const title = document.createElement('td');
  const author = document.createElement('td');
  const pages = document.createElement('td');
  const isRead = document.createElement('td');
  const actions = document.createElement('td');

  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  editButton.className = 'editBook';
  editButton.id = `${idEdit}`;

  deleteButton.className = 'removeBook';
  deleteButton.id = `${idDelete}`;

  title.innerText = `${item.title}`;
  author.innerText = `${item.author}`;
  pages.innerText = `${item.pages}`;
  isRead.innerText = `${item.isRead}`;
  editButton.innerText = 'Edit';
  deleteButton.innerText = 'Delete';
  
  row.appendChild(title);
  row.appendChild(author);
  row.appendChild(pages);
  row.appendChild(isRead);
  row.appendChild(actions);

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  return row;
}