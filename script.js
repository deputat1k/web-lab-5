
// 1. Клас Book
class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.isAvailable = true;
  }

  borrow() {
    if (!this.isAvailable) {
      console.log(`Книга "${this.title}" вже взята!`);
      return false;
    }
    this.isAvailable = false;
    console.log(`Книгу "${this.title}" позичено.`);
    return true;
  }

  return() {
    this.isAvailable = true;
    console.log(`Книгу "${this.title}" повернуто.`);
  }
}

// 2.Клас User
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  getInfo() {
    return `${this.name} (${this.email})`;
  }
}

// 3. Підклас Librarian
class Librarian extends User {
  constructor(id, name, email, salary) {
    super(id, name, email);
    this.salary = salary;
  }

  addBook(library, book) {
    library.books.push(book);
    console.log(`${this.name} додав книгу "${book.title}".`);
  }

  removeBook(library, title) {
    const index = library.books.findIndex(b => b.title === title);
    if (index !== -1) {
      library.books.splice(index, 1);
      console.log(`${this.name} видалив книгу "${title}".`);
    } else {
      console.log(` Книгу "${title}" не знайдено.`);
    }
  }
}

// 4. Підклас Reader 
class Reader extends User {
  constructor(id, name, email, membershipId) {
    super(id, name, email);
    this.membershipId = membershipId;
  }

  borrowBook(library, bookTitle, dueDate) {
    const book = library.books.find(b => b.title === bookTitle);
    if (!book) {
      console.log(`Книгу "${bookTitle}" не знайдено у бібліотеці.`);
      return;
    }
    if (book.borrow()) {
      const loan = new Loan(book, this, dueDate);
      library.loans.push(loan);
      console.log(`Створено запис про позику для ${this.name}, до ${loan.dueDate.toLocaleDateString()}.`);
    }
  }

  returnBook(library, bookTitle) {
    const loan = library.loans.find(
      l => l.book.title === bookTitle && l.reader.id === this.id
    );

    if (loan) {
      loan.book.return();
      library.loans = library.loans.filter(l => l !== loan);
      console.log(` ${this.name} повернув(ла) книгу "${bookTitle}".`);
    } else {
      console.log(`Немає запису про позику книги "${bookTitle}" для користувача ${this.name}.`);
    }
  }
}

// 5. Клас Loan 
class Loan {
  constructor(book, reader, dueDate) {
    this.book = book;
    this.reader = reader;
    this.dueDate = new Date(dueDate);
  }
}

// 6. Клас Library
class Library {
  constructor() {
    this.books = [];
    this.users = [];
    this.loans = [];
  }

  addUser(user) {
    this.users.push(user);
    console.log(`Додано користувача: ${user.getInfo()}`);
  }

  listBooks() {
    console.log("📚 Список книг у бібліотеці:");
    if (this.books.length === 0) {
      console.log("  (порожньо)");
      return;
    }
    this.books.forEach(book => {
      console.log(`  - "${book.title}" (${book.author}) | Доступна: ${book.isAvailable ? "так" : "ні"}`);
    });
  }

  checkOverdueLoans() {
    const now = new Date();
    console.log("Перевірка прострочених позик...");
    this.loans.forEach(loan => {
      if (loan.dueDate < now) {
        console.log(` Прострочена книга: "${loan.book.title}" у читача ${loan.reader.name}, строк до ${loan.dueDate.toLocaleDateString()}.`);
      }
    });
  }

  static showRules() {
    console.log("📖 Правила бібліотеки: Книгу потрібно повернути протягом 14 днів.");
  }
}



const library = new Library();

const librarian = new Librarian(1, "Марія", "maria@library.com", 15000);
const reader = new Reader(2, "Андрій", "andriy@mail.com", "R123");

library.addUser(librarian);
library.addUser(reader);

const book1 = new Book("Тіні забутих предків", "М. Коцюбинський");
const book2 = new Book("Місто", "В. Підмогильний");
const book3 = new Book("Кайдашева сім'я", "І. Нечуй-Левицький");

librarian.addBook(library, book1);
librarian.addBook(library, book2);
librarian.addBook(library, book3);

library.listBooks();
reader.borrowBook(library, "Тіні забутих предків", "2025-10-10");
reader.borrowBook(library, "Тіні забутих предків", "2025-10-20");
reader.returnBook(library, "Тіні забутих предків");
library.checkOverdueLoans();
Library.showRules();
