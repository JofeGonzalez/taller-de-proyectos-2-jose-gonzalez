# Finanzas Personales

Pequeña aplicación para registrar y visualizar movimientos personales (ingresos y gastos).

Autor: Jose González

---

## Resumen del proyecto

Esta app permite:

- Registrar movimientos (ingreso / gasto) con categoría, medio de pago, fecha, monto y descripción.
- Editar y eliminar movimientos.
- Filtrar por categoría y medio de pago.
- Exportar e importar movimientos en formato CSV.
- Visualizar un gráfico simple (gastos por categoría).

La aplicación almacena los datos en `localStorage` del navegador.

---

## Estructura del repositorio

- `index.html` — interfaz principal.
- `style.css` — estilos.
- `main.js` — lógica de UI, persistencia y utilidades.
- `lib/balances.js` — funciones puras para cálculo de totales (orientadas a tests).
- `tests/` — tests unitarios (Jest).
- `README.md` — documentación.

---

## Ejecutar la aplicación (desarrollo)

La aplicación es estática; para ejecutarla abre `index.html` en un navegador moderno.

Para un servidor estático rápido (opcional, recomendado):

```powershell
npx http-server . -p 8080
# o si tienes Python instalado:
python -m http.server 8080
```

Abrir en el navegador: `http://localhost:8080`

---

## Tests

Se añadió un test básicos para la lógica de totales en `lib/balances.js`.

Instalar dependencias y ejecutar tests (PowerShell):

```powershell
npm install
npm test
```

---

## Funcionalidades y uso

- Registrar: completar el formulario y hacer clic en `Agregar`.
- Editar: hacer clic en el icono ✏️ en la fila. El formulario se llenará; luego `Guardar cambios`.
- Eliminar: hacer clic en 🗑 y confirmar en el diálogo.
- Filtros: usar los selectores de categoría y medio de pago; `Limpiar filtros` para volver.
- Exportar CSV: botón `Exportar CSV` genera un archivo con encabezado `id,tipo,categoria,monto,medioPago,fecha,descripcion`.
- Importar CSV: botón `Importar CSV` permite seleccionar un archivo CSV con ese formato para añadir los registros.

---

## Diseño y decisiones técnicas

- Persistencia: `localStorage` para simplicidad y facilidad de evaluación.
- Seguridad: al renderizar la tabla se usa `textContent` en lugar de `innerHTML` para evitar inyección.
- Accesibilidad: la tabla tiene `caption` y `scope` en las cabeceras; mensajes de feedback usan `aria-live`.
- Gráficos: se utiliza Chart.js (CDN) para mostrar un gráfico de gastos por categoría.

---

## Cómo presentar el trabajo (sugerencia para la entrega)

- Incluye un breve `README.md` (este archivo) y una nota que explique las decisiones técnicas (por ejemplo, por qué `localStorage`).
- Muestra el historial de commits para evidenciar el trabajo incremental.
- Incluye instrucciones para ejecutar los tests.

---

## Próximos pasos posibles

- Añadir más tests (CSV, parsing, helpers de fecha).
- Configurar ESLint y un flujo de pre-commit con Husky.
- Persistencia avanzada con IndexedDB o una API backend.
- Añadir paginación o virtualización para listas grandes.

Si quieres, puedo generar un archivo `CONTRIBUTING.md` y un documento de arquitectura con más detalle.
