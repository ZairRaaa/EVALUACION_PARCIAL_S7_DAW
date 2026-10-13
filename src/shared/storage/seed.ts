import { readDatabase, updateDatabase, DATABASE_KEY } from './database';
import type { LibraryDatabase } from '../types';

/**
 * Versión del seed. Cambiar este valor fuerza una re-aplicación del seed
 * en todos los navegadores que ya lo tenían aplicado.
 */
const SEED_VERSION = 'v1';
const SEED_KEY = 'biblioteca:seed';

// ── IDs fijos (hardcodeados) para que sean estables entre sesiones ─────────
// Así los datos de demo nunca se duplican aunque el seed corra más de una vez.
const CAT_SISTEMAS = 'cat-seed-001-sistemas';
const CAT_MATES    = 'cat-seed-002-mates';
const CAT_PROG     = 'cat-seed-003-prog';
const CAT_REDES    = 'cat-seed-004-redes';
const CAT_DB       = 'cat-seed-005-db';

const SEED_CATEGORIES = [
  { id: CAT_SISTEMAS, name: 'Ingeniería de Sistemas' },
  { id: CAT_MATES,    name: 'Matemáticas' },
  { id: CAT_PROG,     name: 'Programación' },
  { id: CAT_REDES,    name: 'Redes y Comunicaciones' },
  { id: CAT_DB,       name: 'Base de Datos' },
];

const SEED_BOOKS = [
  { id: 'book-seed-01', title: 'Ingeniería del Software: Un enfoque práctico', author: 'Roger S. Pressman',        isbn: '9780073375977', categoryId: CAT_SISTEMAS, stock: 4 },
  { id: 'book-seed-02', title: 'Sistemas Operativos Modernos',                  author: 'Andrew S. Tanenbaum',     isbn: '9780136006633', categoryId: CAT_SISTEMAS, stock: 3 },
  { id: 'book-seed-03', title: 'Cálculo: Trascendentes Tempranas',              author: 'James Stewart',           isbn: '9781285741550', categoryId: CAT_MATES,    stock: 5 },
  { id: 'book-seed-04', title: 'Álgebra Lineal y sus Aplicaciones',             author: 'David C. Lay',            isbn: '9780321982384', categoryId: CAT_MATES,    stock: 2 },
  { id: 'book-seed-05', title: 'Clean Code',                                    author: 'Robert C. Martin',        isbn: '9780132350884', categoryId: CAT_PROG,     stock: 3 },
  { id: 'book-seed-06', title: 'The Pragmatic Programmer',                      author: 'David Thomas & A. Hunt',  isbn: '9780135957059', categoryId: CAT_PROG,     stock: 2 },
  { id: 'book-seed-07', title: 'Redes de Computadoras',                         author: 'Andrew S. Tanenbaum',     isbn: '9780132126953', categoryId: CAT_REDES,    stock: 4 },
  { id: 'book-seed-08', title: 'Fundamentos de Bases de Datos',                 author: 'Abraham Silberschatz',    isbn: '9780073523323', categoryId: CAT_DB,       stock: 3 },
  { id: 'book-seed-09', title: 'Diseño de Bases de Datos Relacionales',         author: 'Carlos Coronel',          isbn: '9781337627900', categoryId: CAT_DB,       stock: 1 },
  { id: 'book-seed-10', title: 'Estructura de Datos y Algoritmos en Java',      author: 'Michael T. Goodrich',     isbn: '9781118771334', categoryId: CAT_PROG,     stock: 2 },
];

const SEED_USERS = [
  { id: 'user-seed-01', fullName: 'Ana Lucía Torres Ramos',      universityCode: 'U20230001', email: 'ana.torres@uncp.edu.pe',      type: 'ESTUDIANTE' as const },
  { id: 'user-seed-02', fullName: 'Carlos Eduardo Flores Pérez', universityCode: 'U20230042', email: 'carlos.flores@uncp.edu.pe',   type: 'ESTUDIANTE' as const },
  { id: 'user-seed-03', fullName: 'María Fernanda Quispe López', universityCode: 'U20220118', email: 'maria.quispe@uncp.edu.pe',    type: 'ESTUDIANTE' as const },
  { id: 'user-seed-04', fullName: 'Luis Alberto Huamán Ccente',  universityCode: 'U20210075', email: 'luis.huaman@uncp.edu.pe',     type: 'ESTUDIANTE' as const },
  { id: 'user-seed-05', fullName: 'Dr. Jaime Suasnábar Terrel',  universityCode: 'D10000003', email: 'j.suasnabar@uncp.edu.pe',     type: 'DOCENTE'    as const },
  { id: 'user-seed-06', fullName: 'Mg. Rosa Elvira Panduro Silva', universityCode: 'D10000017', email: 'r.panduro@uncp.edu.pe',    type: 'DOCENTE'    as const },
];

/**
 * Merge de datos demo: añade los registros que falten (por id) sin tocar
 * los que el usuario ya creó ni los préstamos existentes.
 */
function mergeSeed(draft: LibraryDatabase): void {
  const existingCatIds = new Set(draft.categories.map((c) => c.id));
  for (const cat of SEED_CATEGORIES) {
    if (!existingCatIds.has(cat.id)) draft.categories.unshift(cat);
  }

  const existingBookIds = new Set(draft.books.map((b) => b.id));
  for (const book of SEED_BOOKS) {
    if (!existingBookIds.has(book.id)) draft.books.unshift(book);
  }

  const existingUserIds = new Set(draft.users.map((u) => u.id));
  for (const user of SEED_USERS) {
    if (!existingUserIds.has(user.id)) draft.users.unshift(user);
  }
}

/**
 * Aplica el seed de demostración.
 * - Usa IDs fijos → nunca duplica los datos de demo.
 * - Guarda la versión del seed; si cambia, lo vuelve a aplicar.
 * - No elimina datos que el usuario haya creado.
 * - Corre en todos los navegadores al abrir la app.
 */
export function seedIfEmpty(): void {
  try {
    const applied = localStorage.getItem(SEED_KEY);
    if (applied === SEED_VERSION) return;   // ya está aplicado en este navegador

    // Forzar la base de datos al estado correcto antes de leer
    const raw = localStorage.getItem(DATABASE_KEY);
    if (!raw) {
      // Primera vez: escribir desde cero para evitar condición de carrera
      const fresh: LibraryDatabase = {
        schemaVersion: 1,
        categories: [],
        books: [],
        users: [],
        loans: [],
      };
      mergeSeed(fresh);
      localStorage.setItem(DATABASE_KEY, JSON.stringify(fresh));
    } else {
      updateDatabase(mergeSeed);
    }

    localStorage.setItem(SEED_KEY, SEED_VERSION);
  } catch {
    // El almacenamiento puede estar bloqueado en modo privado; no es fatal.
  }
}
