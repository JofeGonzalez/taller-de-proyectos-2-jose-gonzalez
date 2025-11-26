// UI UPDATES
// Updates the summary section with totals: income, expenses, and balance
function actualizarResumen(movimientos) {
    let totalIngresos = movimientos
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0);
    let totalGastos = movimientos
        .filter(m => m.tipo === 'gasto')
        .reduce((sum, m) => sum + m.monto, 0);
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('totalGastos').textContent = totalGastos.toFixed(2);
    document.getElementById('saldoDisponible').textContent = (totalIngresos - totalGastos).toFixed(2);
}

// Displays movements in the table with applied filters for category and payment method
function mostrarMovimientos(movimientos) {
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const filtroMedioPago = document.getElementById('filtroMedioPago').value;
    const tbody = document.getElementById('tablaMovimientos');
    tbody.innerHTML = "";

    // Filter movements based on selected filters
    let filtrados = movimientos.filter(mov => {
        let pasaCategoria = filtroCategoria ? mov.categoria === filtroCategoria : true;
        let pasaMedio = filtroMedioPago ? mov.medioPago === filtroMedioPago : true;
        return pasaCategoria && pasaMedio;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No hay movimientos para mostrar</td></tr>';
    } else {
        filtrados.forEach((mov, index) => {
            const tr = document.createElement('tr');

            // Create and populate each table cell with data-label for mobile responsiveness
            const tdTipo = document.createElement('td');
            tdTipo.textContent = mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1);
            tdTipo.setAttribute('data-label', 'Tipo');

            const tdCategoria = document.createElement('td');
            tdCategoria.textContent = formatearCategoria(mov.categoria);
            tdCategoria.setAttribute('data-label', 'Categoría');

            const tdMonto = document.createElement('td');
            tdMonto.textContent = formatCurrency(mov.monto);
            tdMonto.setAttribute('data-label', 'Monto');

            const tdMedio = document.createElement('td');
            tdMedio.textContent = formatearMedio(mov.medioPago);
            tdMedio.setAttribute('data-label', 'Medio de pago');

            const tdFecha = document.createElement('td');
            tdFecha.textContent = formatDate(mov.fecha);
            tdFecha.setAttribute('data-label', 'Fecha');

            const tdDescripcion = document.createElement('td');
            tdDescripcion.textContent = mov.descripcion || '';
            tdDescripcion.setAttribute('data-label', 'Descripción');

            const tdAcciones = document.createElement('td');
            tdAcciones.setAttribute('data-label', 'Acciones');
            const btnEditar = document.createElement('button');
            btnEditar.textContent = '✏️';
            btnEditar.title = 'Editar';
            btnEditar.setAttribute('aria-label', 'Editar movimiento');
            btnEditar.dataset.action = 'edit';
            btnEditar.dataset.id = mov.id;
            btnEditar.classList.add('focus-outline');

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '🗑';
            btnEliminar.title = 'Eliminar';
            btnEliminar.setAttribute('aria-label', 'Eliminar movimiento');
            btnEliminar.dataset.action = 'delete';
            btnEliminar.dataset.id = mov.id;
            btnEliminar.classList.add('focus-outline');

            tdAcciones.appendChild(btnEditar);
            tdAcciones.appendChild(btnEliminar);

            tr.appendChild(tdTipo);
            tr.appendChild(tdCategoria);
            tr.appendChild(tdMonto);
            tr.appendChild(tdMedio);
            tr.appendChild(tdFecha);
            tr.appendChild(tdDescripcion);
            tr.appendChild(tdAcciones);

            tbody.appendChild(tr);
        });
    }
}

// Shows a confirmation modal with a callback function on confirmation
function showModal(text, onConfirm) {
    const modal = document.getElementById('modalConfirm');
    document.getElementById('modalText').textContent = text;
    modal.setAttribute('aria-hidden', 'false');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancel = document.getElementById('modalCancel');

    // Cleanup function to remove event listeners and close modal
    function cleanup() {
        modal.setAttribute('aria-hidden', 'true');
        confirmBtn.removeEventListener('click', onYes);
        cancel.removeEventListener('click', onCancel);
    }

    function onYes() {
        cleanup();
        onConfirm();
    }
    function onCancel() { cleanup(); }

    confirmBtn.addEventListener('click', onYes);
    cancel.addEventListener('click', onCancel);
}

// CHART MANAGEMENT
let chartInstance = null;
// Creates a pie chart showing expenses by category
function drawCategoriesChart(movimientos) {
    const data = movimientos.filter(m => m.tipo === 'gasto').reduce((acc,m) => {
        acc[m.categoria] = (acc[m.categoria] || 0) + (m.monto || 0);
        return acc;
    }, {});
    const labels = Object.keys(data);
    const values = Object.values(data);
    const ctx = document.getElementById('chartCategorias');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: [ '#6fcf97', '#f2994a', '#f2c94c', '#56ccf2', '#9b51e0' ] }]
        }
    });
}

// UI FEEDBACK
// Shows a temporary message to the user (success or error)
function mostrarMensaje(msj, error = false) {
    const div = document.getElementById('mensajeFeedback');
    div.textContent = msj;
    div.style.color = error ? "#b23b3b" : "#24662d";
    setTimeout(() => { div.textContent = ""; }, 2300);
}
