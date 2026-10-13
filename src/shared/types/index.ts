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
  loanCode: string; // ej: "PRE-uuid"
  code?: string;
  userId: string;
  bookId: string;
  loanDate: string; // ISO string
  borrowedAt?: string;
  dueAt: string; // ISO string
  returnedAt: string | null; // ISO string
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
