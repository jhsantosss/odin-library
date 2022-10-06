class Book {
  constructor (title, author, pages, isRead) {

    this.title = title || 'Unknown';
    this.author = author || 'Unknown';
    this.pages = pages || 'Unknown';
    this.isRead = isRead || false;

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

  add(title, author, pages, isRead) {
    if (!this.#hasBook(title)) {
      this.books.push(new Book(title, author, pages, isRead));
    }
  }

  remove(wantedBook) {
    this.books = this.books.filter(item => item !== wantedBook);
  }

  buildTable() {
    let table = document.querySelector('#booksTable');

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

let myLibrary = new Library();

myLibrary.add('teste');

myLibrary.add('teste2');

myLibrary.buildTable();


const modal = document.querySelector("#modal");
const btn = document.querySelector("#newBook");
const span = document.querySelector("#close");

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 


// myLibrary.add('teste');

// console.log(myLibrary);

// myLibrary.remove('teste');

// console.log(myLibrary);

// console.log(myLibrary.#hasBook('teste3'));






// const book1 = new Book('nome', '', '300', true);

// const book2 = new Book('nome2', 'autor2', '300', false);

// book1.info();

// let json = JSON.stringify(book1, null, 2);

// console.log(book1);

// console.log(book1.info());
// console.log(book2.info());