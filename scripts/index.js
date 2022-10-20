class Book {
  constructor (title, author, pages, isRead) {

    this.title = title;
    this.author = author || 'Not provided';
    this.pages = pages || 'Not provided';
    this.isRead = isRead;

  }
}

const myBooks = {
    books : [],
    selectedIndex : undefined,

  getBook() {
    const data = modalControl.getData();

    if (!this.hasEmptyTitle()) {
      this.addBook(data.title, data.author, data.pages, data.isRead);

      return true;
    }
  },

  updateBook() {
    const data = modalControl.getData();

    if (!this.hasEmptyTitle() && !this.hasBook(data.title)) {
      this.books[this.selectedIndex] = new Book(data.title, data.author, data.pages, data.isRead);

      return true;
    }
  },

  removeBook(wantedBook) {
    this.books = this.books.filter(item => item.title != wantedBook);
  },

  addBook(title, author, pages, isRead) {
    if (!this.hasBook(title)) {
      this.books.push(new Book(title, author, pages, isRead));
    }
  },

  hasEmptyTitle() {
    const input = modalControl.getInput();

    if(input.title.value.trim().length === 0) {
      alert('Sorry, title must be provided.');
      return true;
    }

    return false;
  },

  editBookInfo(wantedBook) {
    const bookToBeEdited = this.selectBook(wantedBook);
    const modalElements = modalControl.getElements();
    
    modalControl.toggle();

    modalElements.submitButton.value = 'Update';

    const input = modalControl.getInput();

    input.title.value = bookToBeEdited.title;
    input.author.value = (bookToBeEdited.author != 'Not provided') ? bookToBeEdited.author : '';
    input.pages.value = (bookToBeEdited.pages != 'Not provided') ? bookToBeEdited.pages : '';
    input.isRead.checked = (bookToBeEdited.isRead === 'Yes') ? true : false;
    
  },

  hasBook(wantedBook) {
    if ((this.books[this.selectedIndex]?.title.toLowerCase() != wantedBook.toLowerCase())
      && (this.books.some(item => item.title.toLowerCase() === wantedBook.toLowerCase()))) {

      alert ('Sorry, this title has already been registered.')

      return true;
    }

    return false;
  },

  selectBook(wantedTitle) {
    const selectedBook = this.books.filter(item => item.title === wantedTitle).at(0);

    this.selectedIndex = this.books.indexOf(selectedBook);
    
    return selectedBook;
  },
}

class DisplayControl {
  constructor(library) {
    this.section = document.querySelector('#display');
    this.library = library;
  }

  displayContent(library = this.library) {
    this.cleanContent(library);
    this.createContent(library);
    this.updateButtonsEvents(library);
  }

  cleanContent() {
    this.section.innerHTML = '';
  }

  updateButtonsEvents(library) {
    this.updateEditButtons(library);
    this.updateDeleteButtons(library);    
  }

  updateEditButtons(library) {
    const editButton = document.querySelectorAll('.editBook');

    editButton.forEach(item => {
      item.addEventListener('click', () => {
        const itemId = item.id.replace('-edit', '');
        
        library.editBookInfo(itemId);
      });
    });
  }

  updateDeleteButtons(library) {
    const deleteButton = document.querySelectorAll('.removeBook');

    deleteButton.forEach(item => {
      item.addEventListener('click', () => {
        const itemId = item.id.replace('-delete', '');
        
        library.removeBook(itemId);

        if (!!library.books.length) {
          this.displayContent(library);
        } else {
          this.cleanContent();
        }
      });
    });
  }
}

class CardsDisplay extends DisplayControl {
  createContent(library) {
    if (!!library.books.length) {
      library?.books.forEach(item => this.section.appendChild(this.createCard(item)));
    }
  }

  createCard(item) {
    const newCard = document.createElement('article');

    const leftDiv = document.createElement('div');
    const title = document.createElement('h3');
    const content = document.createElement('p');

    const rightDiv = document.createElement('div');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    const elements = {
      title, 
      content,
      pages, 
      // isRead,
      editButton,
      deleteButton,
    }

    const elementsWithAtributes = this.setCardButtonsAtributes(item, elements);
    const newElements = this.setCardInnerTexts(item, elementsWithAtributes);

    leftDiv.appendChild(newElements.title);
    leftDiv.appendChild(newElements.content);

    rightDiv.appendChild(newElements.editButton);
    rightDiv.appendChild(newElements.deleteButton);

    newCard.appendChild(leftDiv);
    newCard.appendChild(rightDiv);

    return newCard;
  }
  
  setCardButtonsAtributes(item, elements) {
    const idDelete = `${item.title}-delete`;
    const idEdit = `${item.title}-edit`;
  
    elements.editButton.className = 'editBook';
    elements.editButton.id = idEdit;
  
    elements.deleteButton.className = 'removeBook';
    elements.deleteButton.id = idDelete;

    return elements;
  }

  setCardInnerTexts(item, elements) {
    elements.title.innerText = item.title;
    elements.content.innerText = `By ${item.author}\n ${item.pages} pages.`
    
    elements.editButton.innerText = 'Edit';
    elements.deleteButton.innerText = 'Delete';

    return elements;
  }
}

class TableDisplay extends DisplayControl {
  createContent(library) {
    if (!!library.books.length) { 
      const table = document.createElement('table');
      const tableHead = document.createElement('thead');
      const tableBody = document.createElement('tbody');

      tableHead.appendChild(this.createHead());

      library?.books.forEach(item => tableBody.appendChild(this.createBodyRow(item)));

      table.appendChild(tableHead);
      table.appendChild(tableBody);

      this.section.appendChild(table);
    }
  }

  createHead() {
    const head = document.createElement('tr');
    const headElements = Object.values(this.createHeadElements());
    
    headElements.forEach(item => head.appendChild(item));

    return head;
  }

  createHeadElements() {
    const title = document.createElement('th');
    const author = document.createElement('th');
    const pages = document.createElement('th');
    const isRead = document.createElement('th');
    const actions = document.createElement('th');

    const elements = {
      title, 
      author,
      pages, 
      isRead,
      actions,
    }

    const newElements = this.setHeadInnerTexts(elements);
    
    return newElements;
  }

  setHeadInnerTexts(elements) {
    elements.title.innerText = 'Title';
    elements.author.innerText = 'Author';
    elements.pages.innerText = 'Pages';
    elements.isRead.innerText = 'Read';
    elements.actions.innerText = 'Actions';

    return elements;
  }

  createBodyRow(item) {
    const row = document.createElement('tr');
    const rowElements = this.createBodyElements(item);
    const rowData = Object.values(rowElements).slice(0,5);
    const rowButtons = Object.values(rowElements).slice(5);

    rowData.forEach(element => row.appendChild(element));
    rowButtons.forEach(element => rowElements.actions.appendChild(element));

    return row;
  }

  createBodyElements(item) {
    const title = document.createElement('td');
    const author = document.createElement('td');
    const pages = document.createElement('td');
    const isRead = document.createElement('td');
    const actions = document.createElement('td');
    
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    const elements = {
      title, 
      author,
      pages, 
      isRead,
      actions,
      editButton,
      deleteButton,
    }

    const elementsWithAtributes = this.setBodyAtributes(item, elements);
    const newElements = this.setBodyInnerTexts(item, elementsWithAtributes);

    return newElements;
  }

  setBodyAtributes(item, elements) {
    const idDelete = `${item.title}-delete`;
    const idEdit = `${item.title}-edit`;
  
    elements.editButton.className = 'editBook';
    elements.editButton.id = idEdit;
  
    elements.deleteButton.className = 'removeBook';
    elements.deleteButton.id = idDelete;

    return elements;
  }

  setBodyInnerTexts(item, elements) {
    elements.title.innerText = item.title;
    elements.author.innerText = item.author;
    elements.pages.innerText = item.pages;
    elements.isRead.innerText = item.isRead;
    elements.editButton.innerText = 'Edit';
    elements.deleteButton.innerText = 'Delete';

    return elements;
  }
}

const cardsControl = new CardsDisplay(myBooks);

const tableControl = new TableDisplay(myBooks);

const modalControl = {
  toggle() {
    const modalElements = modalControl.getElements();
    if (modalElements.base.isActive) {
      modalElements.base.modal.style.display = "none";
      modalControl.resetInput();
      myBooks.selectedIndex = myBooks.books.length;

      return;
    }
    modalElements.base.modal.style.display = "block";
    const inputTitle = document.querySelector('#title');
    inputTitle.focus();
  },

  getInput() {
    const inputForms = document.querySelector('#bookInfo');
    const inputTitle = document.querySelector('#title');
    const inputAuthor = document.querySelector('#author');
    const inputPages = document.querySelector('#pages');
    const inputIsRead = document.querySelector('#check');
    const input = {
      forms : inputForms,
      title : inputTitle,
      author : inputAuthor,
      pages : inputPages,
      isRead : inputIsRead,
    }

    return input;
  },

  getData() {
    const input = this.getInput();
    const data = {
      title : input.title.value,
      author : input.author.value,
      pages : input.pages.value,
      isRead : input.isRead.checked ? 'Yes' : 'No',
    }

    return data;
  },

  resetInput() {
    const input = this.getInput();
    const modalElements = this.getElements();

    input.forms.reset();
    modalElements.submitButton.value = 'Add';
  },

  getElements() {
    const modal = document.querySelector("#modal");
    const isActive = (modal.style.display === 'block') ? true : false;
    const cancelButton = document.querySelector("#cancel");
    const submitButton = document.querySelector('#submit');
    const modalElements = {
      base : {
        modal,
        isActive,
      },
      cancelButton,
      submitButton,
    }

    return modalElements;
  },

  addCancelButtonEventListener() {
    const modalElements = this.getElements();

    modalElements.cancelButton.onclick = event => {
      event.preventDefault();
      modalControl.toggle()
    }
  },

  addSubmitButtonEventListener() {
    const modalElements = this.getElements();

    modalElements.submitButton.onclick = event => {
      
      event.preventDefault();
      
      if (modalElements.submitButton.value === 'Update') {
        if (myBooks.updateBook()) {
          pageControl.showSelectedView();
          modalControl.toggle();
        }
      } else {
        if (myBooks.getBook()) {
          pageControl.showSelectedView();
          modalControl.toggle();
        }
      }
    }
  },

  addOutterModalClickListener() {
    window.onclick = event => {
      if (event.target === modal) modalControl.toggle();
    }
  },

  addEscapeKeyEventListener() {
    document.addEventListener('keydown', function(event) {
      const modal = modalControl.getElements().base;
      if ((modal.isActive) && (event.code == 'Escape')) {
        modalControl.toggle();
      }
    });
  },

  addEnterKeyEventListener() {
    document.addEventListener('keydown', function(event) {
      const modal = modalControl.getElements().base;
      const submitButton = modalControl.getElements().submitButton;
      
      if ((modal.isActive) && (event.code == 'Enter')) {

        if (submitButton.value === 'Update') {
          if (myBooks.updateBook()) {
          pageControl.showSelectedView();
          }
        } else {
          if (myBooks.getBook()) {
          pageControl.showSelectedView();
          }
        }
      }
    });
  },  
}

const pageControl = {
  selectedView : 'table',

  getPageElements() {
    const newBookButton = document.querySelector("#newBook");
    const tableView = document.querySelector("#tableView");
    const cardsView = document.querySelector("#cardsView");

    const pageElements = {
      newBookButton,
      tableView,
      cardsView,
    }

    return pageElements
  },

  showSelectedView() {
    if (this.selectedView === 'table')
      tableControl.displayContent();
    if (this.selectedView === 'cards')
      cardsControl.displayContent();
  },

  addNewBookButtonEventListener() {
    const newBook = this.getPageElements().newBookButton;
    newBook.onclick = modalControl.toggle;
  },

  addTableViewEventListener() {
    const tableView = this.getPageElements().tableView;

    tableView.onclick = () => {
      this.selectedView = 'table';
      cardsControl.cleanContent();
      this.showSelectedView();
    }
  },

  addCardsViewEventListener() {
    const cardsView = this.getPageElements().cardsView;

    cardsView.onclick = () => {
      this.selectedView = 'cards';
      tableControl.cleanContent();
      this.showSelectedView();
    }
  },

  addAllEventListeners() {
    this.addNewBookButtonEventListener();

    this.addTableViewEventListener();
    this.addCardsViewEventListener();

    modalControl.addCancelButtonEventListener();
    modalControl.addOutterModalClickListener();
    modalControl.addEscapeKeyEventListener();

    modalControl.addSubmitButtonEventListener();
    modalControl.addEnterKeyEventListener();
  },
}

pageControl.addAllEventListeners();
