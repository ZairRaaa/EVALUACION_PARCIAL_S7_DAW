Dr. Jaime Suasnábar Terrel
UNIVERSIDAD NACIONAL DEL CENTRO DEL PERU
Facultad de Ingeniería de Sistemas
EVALUACIÓN PARCIAL
Curso: Desarrollo de Aplicaciones Web. Semestre: IX Fecha:
Apellidos y Nombres: ____________________________________________
Instrucciones: Desarrolle el presente examen utilizando React, Vite y TypeScript. La duración es de 85
minutos. La evaluación se desarrolla en equipos de hasta 4 estudiantes.
Caso de Estudio
Sistema de Gestión de Biblioteca Universitaria
La Biblioteca Central de la universidad desea implementar un sistema web para administrar el préstamo de
libros a estudiantes y docentes.
El sistema contará con dos tipos de usuarios:
• Administradores, quienes gestionarán libros, categorías y préstamos.
• Usuarios registrados (estudiantes o docentes), quienes podrán buscar libros, solicitar préstamos y
consultar su historial.
Toda la información deberá almacenarse utilizando Local Storage, simulando un sistema empresarial real sin
utilizar bases de datos externas.
Además, el sistema deberá generar un comprobante digital de préstamo y permitir a los usuarios consultar su
historial de libros prestados.
PRINCIPALES FUNCIONALIDADES
1. Gestión de categorías y libros (6 puntos)
Implementa un módulo para administradores que permita:
• Registrar categorías de libros.
• Registrar libros indicando:
o Título.
o Autor.
o ISBN.
o Categoría.
o Stock disponible.
• Editar y eliminar registros.
• Almacenar información en Local Storage.
Requisitos
• Formularios validados.
Dr. Jaime Suasnábar Terrel
• Componentes reutilizables.
• Persistencia de datos.
2. Gestión de usuarios (4 puntos)
Permite registrar usuarios con los siguientes datos:
• Nombres y apellidos.
• Código universitario.
• Correo electrónico.
• Tipo de usuario (Estudiante o Docente).
Requisitos
• Evitar códigos duplicados.
• Validación de formularios.
• Almacenamiento en Local Storage.
3. Solicitud y préstamo de libros (4 puntos)
Los usuarios deberán poder:
• Buscar libros por título o categoría.
• Solicitar préstamos.
• Visualizar disponibilidad.
• Consultar préstamos activos.
Requisitos
• No permitir préstamos si el stock es cero.
• Actualizar automáticamente el inventario.
• Persistir información en Local Storage.
4. Generación de comprobante digital (3 puntos)
Cuando se registre un préstamo, el sistema deberá generar un comprobante digital con:
• Nombre del usuario.
• Libro prestado.
• Fecha de préstamo.
• Fecha límite de devolución.
• Código único del préstamo.
Requisitos
Dr. Jaime Suasnábar Terrel
• Visualización en pantalla.
• Almacenamiento en Local Storage.
• Posibilidad de descargar en PDF.
5. Historial de préstamos (3 puntos)
Cada usuario deberá contar con una vista donde pueda consultar:
• Libros prestados actualmente.
• Historial de préstamos.
• Fechas de devolución.
• Estado del préstamo (Activo o Devuelto).
Requisitos
• Uso de React Router.
• Componentes reutilizables.
• Diseño responsivo.