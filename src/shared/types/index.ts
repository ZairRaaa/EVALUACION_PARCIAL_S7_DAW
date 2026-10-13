export type UserType = 'ESTUDIANTE' | 'DOCENTE';
export type LoanStatus = 'ACTIVO' | 'DEVUELTO';

export interface Category { id: string; name: string }
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  categoryId: string;
  stock: number;
}
export interface LibraryUser {
  id: string;
  fullName: string;
  universityCode: string;
  email: string;
  type: UserType;
}
export interface Loan {
  id: string;
  code: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: LoanStatus;
  receipt: {
    userName: string;
    bookTitle: string;
  };
}
export interface LibraryDatabase {
  schemaVersion: 1;
  categories: Category[];
  books: Book[];
  users: LibraryUser[];
  loans: Loan[];
}
