Arquitectura - Finanzas Personales
==================================

Resumen
------

Esta aplicación es un proyecto pequeño para gestionar movimientos financieros personales en el cliente (navegador). Está diseñada con una separación simple entre:

- UI (index.html + style.css)
- Lógica de interacción y persistencia (main.js)
- Código puro y testeable (lib/balances.js)

Modelo de datos
---------------

Cada movimiento tiene la siguiente forma (JSON):

{
  id: number,
  tipo: 'ingreso' | 'gasto',
  categoria: string,
  monto: number,
  medioPago: string,
  fecha: string (ISO date),
  descripcion: string (opcional)
}

Persistencia
------------

Se usa `localStorage` con la clave `movimientos`. Para facilitar migraciones futuras se recomienda mantener los registros como un arreglo de objetos JSON tal como se almacena actualmente.

Renderizado y seguridad
-----------------------

- Se evita `innerHTML` para insertar texto del usuario. En su lugar se usa `textContent` para prevenir inyección.
- Los botones usan `data-action` para delegación de eventos en la tabla.

Gráficos
--------

Se utiliza Chart.js cargado desde CDN para mostrar un gráfico pie con la suma de gastos por categoría. El gráfico se vuelve a dibujar cada vez que cambian los datos.

Extensiones sugeridas
---------------------

- Mover la lógica a un módulo ES (`type="module"`) y usar imports para mejorar testabilidad.
- Reemplazar `localStorage` por IndexedDB si se requiere manejo de grandes volúmenes de datos.
- Añadir una capa de persistencia para sincronizar con una API REST (si se desea almacenar en servidor).

*** End Patch