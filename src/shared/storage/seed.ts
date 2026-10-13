import { readDatabase, updateDatabase } from './database';

/**
 * Puebla la base de datos con datos de demostración.
 * Solo actúa si no existe ninguna categoría ni usuario (primera carga).
 */
export function seedIfEmpty(): void {
  try {
    const db = readDatabase();
    if (db.categories.length > 0 || db.users.length > 0) return;

    updateDatabase((draft) => {
      // ── Categorías ────────────────────────────────────────────────
      const cats = [
        { id: crypto.randomUUID(), name: 'Ingeniería de Sistemas' },
        { id: crypto.randomUUID(), name: 'Matemáticas' },
        { id: crypto.randomUUID(), name: 'Programación' },
        { id: crypto.randomUUID(), name: 'Redes y Comunicaciones' },
        { id: crypto.randomUUID(), name: 'Base de Datos' },
      ];
      draft.categories.push(...cats);

      // ── Libros ────────────────────────────────────────────────────
      draft.books.push(
        {
          id: crypto.randomUUID(),
          title: 'Ingeniería del Software: Un enfoque práctico',
          author: 'Roger S. Pressman',
          isbn: '9780073375977',
          categoryId: cats[0].id,
          stock: 4,
        },
        {
          id: crypto.randomUUID(),
          title: 'Sistemas Operativos Modernos',
          author: 'Andrew S. Tanenbaum',
          isbn: '9780136006633',
          categoryId: cats[0].id,
          stock: 3,
        },
        {
          id: crypto.randomUUID(),
          title: 'Cálculo: Trascendentes Tempranas',
          author: 'James Stewart',
          isbn: '9781285741550',
          categoryId: cats[1].id,
          stock: 5,
        },
        {
          id: crypto.randomUUID(),
          title: 'Álgebra Lineal y sus Aplicaciones',
          author: 'David C. Lay',
          isbn: '9780321982384',
          categoryId: cats[1].id,
          stock: 2,
        },
        {
          id: crypto.randomUUID(),
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          isbn: '9780132350884',
          categoryId: cats[2].id,
          stock: 3,
        },
        {
          id: crypto.randomUUID(),
          title: 'The Pragmatic Programmer',
          author: 'David Thomas & Andrew Hunt',
          isbn: '9780135957059',
          categoryId: cats[2].id,
          stock: 2,
        },
        {
          id: crypto.randomUUID(),
          title: 'Redes de Computadoras',
          author: 'Andrew S. Tanenbaum',
          isbn: '9780132126953',
          categoryId: cats[3].id,
          stock: 4,
        },
        {
          id: crypto.randomUUID(),
          title: 'Fundamentos de Bases de Datos',
          author: 'Abraham Silberschatz',
          isbn: '9780073523323',
          categoryId: cats[4].id,
          stock: 3,
        },
        {
          id: crypto.randomUUID(),
          title: 'Diseño de Bases de Datos Relacionales',
          author: 'Carlos Coronel',
          isbn: '9781337627900',
          categoryId: cats[4].id,
          stock: 1,
        },
        {
          id: crypto.randomUUID(),
          title: 'Estructura de Datos y Algoritmos en Java',
          author: 'Michael T. Goodrich',
          isbn: '9781118771334',
          categoryId: cats[2].id,
          stock: 2,
        },
      );

      // ── Usuarios ──────────────────────────────────────────────────
      draft.users.push(
        {
          id: crypto.randomUUID(),
          fullName: 'Ana Lucía Torres Ramos',
          universityCode: 'U20230001',
          email: 'ana.torres@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
        {
          id: crypto.randomUUID(),
          fullName: 'Carlos Eduardo Flores Pérez',
          universityCode: 'U20230042',
          email: 'carlos.flores@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
        {
          id: crypto.randomUUID(),
          fullName: 'María Fernanda Quispe López',
          universityCode: 'U20220118',
          email: 'maria.quispe@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
        {
          id: crypto.randomUUID(),
          fullName: 'Luis Alberto Huamán Ccente',
          universityCode: 'U20210075',
          email: 'luis.huaman@uncp.edu.pe',
          type: 'ESTUDIANTE',
        },
        {
          id: crypto.randomUUID(),
          fullName: 'Dr. Jaime Suasnábar Terrel',
          universityCode: 'D10000003',
          email: 'j.suasnabar@uncp.edu.pe',
          type: 'DOCENTE',
        },
        {
          id: crypto.randomUUID(),
          fullName: 'Mg. Rosa Elvira Panduro Silva',
          universityCode: 'D10000017',
          email: 'r.panduro@uncp.edu.pe',
          type: 'DOCENTE',
        },
      );
    });
  } catch {
    // Si el almacenamiento falla, la app sigue funcionando sin datos de demo.
  }
}
