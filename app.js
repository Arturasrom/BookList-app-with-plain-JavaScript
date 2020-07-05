// Klase Book: pazymi knyga.
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI klase: vartotojo interfeisas.
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Dingsta per 3 sek.
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Klase Store: issaugojimui.
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Eventas: rodyti knygas.
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Eventas: prideti knyga.
document.querySelector('#book-form').addEventListener('submit', (e) => { 
  // Preventina tikraji submita.
e.preventDefault();

  // Gauti formos reiksmes.
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // Patikrinimas ar visi laukai uzpildyti.
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Sukuriame knygos objekta.
    const book = new Book(title, author, isbn);

    // Prideti knyga i UI.
    UI.addBookToList(book);

    // Prideti knyga saugojimui.
    Store.addBook(book);

    // Parodyti ivykdymo pranesima.
    UI.showAlert('Knyga išsaugota !', 'success');

    // Trinti laukus.
    UI.clearFields();
  }
});

// Eventas: istrinti knyga.
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Istrinti knyga is UI
  UI.deleteBook(e.target);

  // Istrinti knyga is Store.
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Ivykdymo pranesimas.
  UI.showAlert('Knyga pašalinta !', 'success');
});