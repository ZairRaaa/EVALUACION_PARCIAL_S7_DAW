import { readDatabase, updateDatabase } from '../../shared/storage/database';
import type { Book, Category, LibraryUser, Loan } from '../../shared/types';
import { getSession } from '../users/session';

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
  const session = getSession();
  if (session.role === 'USUARIO' && session.userId !== input.userId) throw new Error('Selecciona tu usuario para solicitar el préstamo.');
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

    if (!Number.isSafeInteger(book.stock) || book.stock < 1) {
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
  const session = getSession();
  let updatedLoan: Loan | null = null;

  updateDatabase((draft) => {
    const loan = draft.loans.find((l) => l.id === loanId);
    if (!loan) {
      throw new Error('El préstamo no fue encontrado.');
    }
    if (session.role === 'USUARIO' && loan.userId !== session.userId) throw new Error('No puedes devolver el préstamo de otro usuario.');

    if (loan.status !== 'ACTIVO') {
      throw new Error('El préstamo ya fue devuelto y no puede procesarse nuevamente.');
    }

    const book = draft.books.find((b) => b.id === loan.bookId);
    if (!book) throw new Error('El libro del préstamo ya no existe en el inventario.');
    loan.status = 'DEVUELTO';
    loan.returnedAt = new Date().toISOString();
    book.stock += 1;

    updatedLoan = { ...loan };
  });

  if (!updatedLoan) {
    throw new Error('No se pudo procesar la devolución.');
  }

  return updatedLoan;
}


