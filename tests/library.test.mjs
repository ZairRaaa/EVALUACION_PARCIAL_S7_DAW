import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const result = await build({
  stdin: { contents: `
    export * from './src/features/inventory/inventoryService';
    export { registerUser } from './src/features/users/usersService';
    export { createLoan, returnLoan, listLoans } from './src/features/loans/loansService';
    export { setSession, getSession } from './src/features/users/session';
    export { readDatabase, updateDatabase } from './src/shared/storage/database';
    export { buildReceiptPdf } from './src/features/receipts/exportReceiptPdf';
  `, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false,
});
const compiled = { exports: {} };
new Function('require', 'module', 'exports', result.outputFiles[0].text)(createRequire(import.meta.url), compiled, compiled.exports);
const api = compiled.exports;
const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
};
globalThis.window = new EventTarget();

test('Registro, préstamo, comprobante, devolución y persistencia', () => {
  storage.clear();
  const category = api.saveCategory({ name: 'Sistemas' });
  assert.throws(() => api.saveCategory({ name: ' sistemas ' }), /existe/);
  const input = { title: 'Diseño de sistemas', author: 'Autor de prueba', isbn: '978-0132350884', categoryId: category.id, stock: 1 };
  assert.throws(() => api.saveBook({ ...input, stock: -1 }), /stock/);
  assert.throws(() => api.saveBook({ ...input, stock: 1.5 }), /stock/);
  const book = api.saveBook(input);
  assert.throws(() => api.saveBook(input), /ISBN/);
  assert.throws(() => api.deleteCategory(category.id), /tiene libros/);
  const user = api.registerUser({ fullName: 'Ana Prueba', universityCode: ' u001 ', email: 'ana@example.test', type: 'ESTUDIANTE' });
  assert.throws(() => api.registerUser({ ...user, universityCode: 'U001' }), /existe/);
  assert.throws(() => api.registerUser({ ...user, universityCode: 'U002', email: 'invalido' }), /correo/);
  const other = api.registerUser({ fullName: 'Luis Prueba', universityCode: 'U002', email: 'luis@example.test', type: 'DOCENTE' });
  api.setSession({ role: 'USUARIO', userId: user.id });
  assert.throws(() => api.createLoan({ userId: other.id, bookId: book.id }), /usuario/);
  const loan = api.createLoan({ userId: user.id, bookId: book.id });
  assert.equal(api.readDatabase().books[0].stock, 0);
  assert.equal(api.listLoans(user.id).length, 1);
  assert.equal(api.listLoans(other.id).length, 0);
  assert.equal(loan.status, 'ACTIVO');
  assert.ok(loan.code.startsWith('PRE-'));
  assert.ok(new Date(loan.dueAt) > new Date(loan.borrowedAt));
  assert.throws(() => api.createLoan({ userId: user.id, bookId: book.id }), /stock/);
  assert.equal(api.readDatabase().loans.length, 1);
  assert.throws(() => api.deleteBook(book.id), /activos/);
  api.saveBook({ ...book, title: 'Título actualizado', stock: 0 });
  assert.equal(api.readDatabase().loans[0].receipt.bookTitle, input.title);
  const pdf = api.buildReceiptPdf(loan).output();
  assert.ok(pdf.startsWith('%PDF'));
  assert.ok(pdf.includes(loan.code));
  assert.ok(pdf.includes(user.fullName));
  api.setSession({ role: 'USUARIO', userId: other.id });
  assert.throws(() => api.returnLoan(loan.id), /otro usuario/);
  api.setSession({ role: 'ADMIN', userId: null });
  api.returnLoan(loan.id);
  const saved = JSON.parse(storage.get('biblioteca:v1'));
  assert.equal(saved.books[0].stock, 1);
  assert.equal(saved.loans[0].status, 'DEVUELTO');
  assert.ok(saved.loans[0].returnedAt);
  assert.throws(() => api.returnLoan(loan.id), /devuelto/);
  assert.equal(api.readDatabase().books[0].stock, 1);
  api.deleteBook(book.id);
  api.deleteCategory(category.id);
  assert.equal(api.readDatabase().loans[0].receipt.bookTitle, input.title);
});

test('Un error de almacenamiento no informa un préstamo exitoso', () => {
  storage.clear();
  const original = localStorage.setItem;
  localStorage.setItem = () => { throw new Error('Almacenamiento lleno'); };
  try { assert.throws(() => api.saveCategory({ name: 'Prueba' }), /lleno/); }
  finally { localStorage.setItem = original; }
  assert.equal(api.readDatabase().categories.length, 0);
});
