class Book {
  constructor (title, author, pages, isRead) {

    this.title = title || 'Unknown';
    this.author = author || 'Unknown';
    this.pages = pages || 'Unknown';
    this.isRead = isRead || 'No';

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

  #add(title, author, pages, isRead) {
    if (!this.#hasBook(title)) {
      this.books.push(new Book(title, author, pages, isRead));
    }
  }

  remove(wantedBook) {
    this.books = this.books.filter(item => item !== wantedBook);
  }

  getBook() {
    let inputTitle = document.querySelector('#title');
    let inputAuthor = document.querySelector('#author');
    let inputPages = document.querySelector('#pages');
    let inputIsRead = document.querySelector('#check:checked') ? 'Yes' : 'No';
    return this.#add(inputTitle.value, inputAuthor.value, inputPages.value, inputIsRead);
  }

  resetInput() {
    let forms = document.querySelector('#bookInfo');
    return forms.reset();
  }

  buildTable() {
    let table = document.querySelector('#booksTable');
    table.innerHTML = '';
    this.books.forEach(item => {
      let row = `<tr>
                  <td>${item.title}</td>
                  <td>${item.author}</td>
                  <td>${item.pages}</td>
                  <td>${item.isRead}</td>
                 <tr>`;
      table.innerHTML += row;
    })
  }
}

let myBooks = new Library();

const modal = document.querySelector("#modal");
const newBook = document.querySelector("#newBook");
const closeModal = document.querySelector("#close");

const showModal = () => modal.style.display = "block";
const hideModal = () => modal.style.display = "none";

newBook.onclick = showModal;

closeModal.onclick = hideModal;

window.onclick = (event) => { if (event.target == modal) hideModal() };

const addBook = document.querySelector('#addBook');

addBook.onclick = () => {
  myBooks.getBook();
  myBooks.buildTable();
  myBooks.resetInput();
  return hideModal();
}
