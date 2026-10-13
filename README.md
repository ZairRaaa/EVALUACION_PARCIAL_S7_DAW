# Biblioteca universitaria

Base del parcial con React, Vite, TypeScript, React Router y Local Storage. Enunciado original: [info.md](info.md).

## Ejecutar

```sh
npm install
npm run dev
```

## Equipo

| Integrante | Módulo | Rama |
| --- | --- | --- |
| Rojas | Categorías, libros e integración | `rojas-cerron` |
| Angel | Usuarios y selección de sesión | `tocas-anglas` (asumida) |
| Chahuayo | Catálogo, préstamos y devoluciones | `chahuayo-martinez` |
| Alvitrez | Comprobantes PDF e historial | `alvitrez-quispe` |

Leer [reparto detallado y flujo Git](docs/EQUIPO.md) y [contratos compartidos](docs/CONTRATOS.md) antes de desarrollar.

## Estructura

```text
src/
  app/                  Navegación y rutas
  features/
    inventory/          Rojas
    users/              Angel
    loans/              Chahuayo
    receipts/           Alvitrez
    history/            Alvitrez
  shared/
    components/         Componentes reutilizables
    storage/            Acceso a Local Storage
    types/              Modelos comunes
  styles/               Estilos generales
docs/                   Distribución y contratos
```

Estado: todos los módulos implementados e integrados en `rojas-cerron`. CRUD de categorías y libros, gestión de usuarios con selector de sesión y roles ADMIN/USUARIO, catálogo con búsqueda, préstamos con descuento de stock, devoluciones con reposición, comprobante digital con descarga PDF (jsPDF) e historial filtrable. Tests de integración y build de producción pasan sin errores.
