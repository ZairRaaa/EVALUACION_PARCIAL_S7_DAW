import { readDatabase, updateDatabase } from '../../shared/storage/database';
import type { Book, Category, LibraryUser, Loan } from '../../shared/types';

export function listLoans(userId?: string): Loan[] {
  const db = readDatabase();
  if (userId) {
    return db.loans.filter((loan) => loan.userId === userId);
  }
  return db.loans;
}

export function listBooks(): Book[] {
  return readDatabase().books;
}

export function listCategories(): Category[] {
  return readDatabase().categories;
}

export function listUsers(): LibraryUser[] {
  return readDatabase().users;
}

export function createLoan(input: { userId: string; bookId: string }): Loan {
  let createdLoan: Loan | null = null;

  updateDatabase((draft) => {
    const user = draft.users.find((u) => u.id === input.userId);
    if (!user) {
      throw new Error('El usuario especificado no existe.');
    }

    const book = draft.books.find((b) => b.id === input.bookId);
    if (!book) {
      throw new Error('El libro seleccionado no existe.');
    }

    if (book.stock < 1) {
      throw new Error('No hay stock disponible para realizar el préstamo.');
    }

    const id = crypto.randomUUID();
    const code = `PRE-${id}`;

    const borrowedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    createdLoan = {
      id,
      code,
      userId: user.id,
      bookId: book.id,
      borrowedAt: borrowedDate.toISOString(),
      dueAt: dueDate.toISOString(),
      returnedAt: null,
      status: 'ACTIVO',
      receipt: {
        userName: user.fullName,
        bookTitle: book.title,
      },
    };

    book.stock -= 1;
    draft.loans.unshift(createdLoan);
  });

  if (!createdLoan) {
    throw new Error('No se pudo registrar el préstamo.');
  }

  return createdLoan;
}

export function returnLoan(loanId: string): Loan {
  let updatedLoan: Loan | null = null;

  updateDatabase((draft) => {
    const loan = draft.loans.find((l) => l.id === loanId);
    if (!loan) {
      throw new Error('El préstamo no fue encontrado.');
    }

    if (loan.status !== 'ACTIVO') {
      throw new Error('El préstamo ya fue devuelto y no puede procesarse nuevamente.');
    }

    loan.status = 'DEVUELTO';
    loan.returnedAt = new Date().toISOString();

    const book = draft.books.find((b) => b.id === loan.bookId);
    if (book) {
      book.stock += 1;
    }

    updatedLoan = { ...loan };
  });

  if (!updatedLoan) {
    throw new Error('No se pudo procesar la devolución.');
  }

  return updatedLoan;
}

export function seedSampleData(): void {
  updateDatabase((draft) => {
    if (draft.categories.length === 0) {
      draft.categories = [
        { id: 'cat-1', name: 'Ingeniería y Sistemas' },
        { id: 'cat-2', name: 'Ciencias Básicas' },
        { id: 'cat-3', name: 'Literatura' },
      ];
    }

    if (draft.books.length === 0) {
      draft.books = [
        {
          id: 'book-1',
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          isbn: '978-0132350884',
          categoryId: 'cat-1',
          stock: 3,
        },
        {
          id: 'book-2',
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen',
          isbn: '978-0262033848',
          categoryId: 'cat-1',
          stock: 2,
        },
        {
          id: 'book-3',
          title: 'Cálculo de una Variable',
          author: 'James Stewart',
          isbn: '978-6075265490',
          categoryId: 'cat-2',
          stock: 4,
        },
        {
          id: 'book-4',
          title: 'Física Universitaria Vol. 1',
          author: 'Sears y Zemansky',
          isbn: '978-6073221900',
          categoryId: 'cat-2',
          stock: 1,
        },
        {
          id: 'book-5',
          title: 'Cien Años de Soledad',
          author: 'Gabriel García Márquez',
          isbn: '978-0307474728',
          categoryId: 'cat-3',
          stock: 0,
        },
      ];
    }

    if (draft.users.length === 0) {
      draft.users = [
        {
          id: 'usr-1',
          fullName: 'Juan Carlos Chahuayo',
          universityCode: '2022100456',
          email: 'jchahuayo@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
        {
          id: 'usr-2',
          fullName: 'Dr. Jaime Suasnábar Terrel',
          universityCode: 'DOC-10293',
          email: 'jsuasnabar@uncp.edu.pe',
          type: 'DOCENTE',
        },
        {
          id: 'usr-3',
          fullName: 'Ana Torres Mendoza',
          universityCode: '2021200112',
          email: 'atorres@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
      ];
    }
  });
}
