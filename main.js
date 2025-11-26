// DATA MANAGEMENT
// Retrieves all movements from localStorage, returns empty array if none exist
function getMovimientos() {
    return JSON.parse(localStorage.getItem('movimientos')) || [];
}

// Saves movements to localStorage as JSON string
function setMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

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

// Exports all movements to a CSV file with current date as filename
function exportCSV() {
    const movimientos = getMovimientos();
    const header = ['id','tipo','categoria','monto','medioPago','fecha','descripcion'];
    const rows = movimientos.map(m => [m.id, m.tipo, m.categoria, m.monto, m.medioPago, m.fecha, m.descripcion || '']);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimientos_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Reads and imports a CSV file, merges it with existing movements
function importCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const text = evt.target.result;
            const lines = text.split(/\r?\n/).filter(Boolean);
            const header = lines.shift().split(',').map(h => h.replace(/^"|"$/g, '').trim());
            const expected = ['id','tipo','categoria','monto','medioPago','fecha','descripcion'];
            if (header.length !== expected.length) {
                mostrarMensaje('Archivo CSV inválido. Encabezados no coinciden.', true);
                return;
            }
            // Parse CSV rows into movement objects
            const parsed = lines.map(line => {
                        const values = line.match(/(?:\"([^\"]*)\"|[^,]+)/g)?.map(v => v.replace(/^"|"$/g, '')) || [];
                return {
                    id: parseInt(values[0], 10) || Date.now(),
                    tipo: values[1],
                    categoria: values[2],
                    monto: parseFloat(values[3]) || 0,
                    medioPago: values[4],
                    fecha: values[5],
                    descripcion: values[6] || ''
                };
            });
            const current = getMovimientos();
            const merged = [...current, ...parsed];
            setMovimientos(merged);
            actualizarResumen(merged);
            mostrarMovimientos(merged);
            drawCategoriesChart(merged);
            mostrarMensaje('CSV importado con éxito');
        } catch (err) {
            mostrarMensaje('Error al leer el CSV', true);
        }
    };
    reader.readAsText(file);
}

// CSV export/import event listeners
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('importCSVButton').addEventListener('click', () => {
    document.getElementById('importCSVInput').click();
});
document.getElementById('importCSVInput').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    importCSVFile(f);
});

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

// TABLE ACTIONS
// Handles edit and delete button clicks in the movements table
document.getElementById('tablaMovimientos').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id, 10);
    if (action === 'delete') {
        showModal('¿Seguro que deseas eliminar este movimiento?', () => {
            eliminarMovimiento(id);
        });
    } else if (action === 'edit') {
        editarMovimiento(id);
    }
});

// FORMATTING UTILITIES
// Converts category codes to readable Spanish text
function formatearCategoria(valor) {
    switch (valor) {
        case 'alimentacion': return 'Alimentación';
        case 'transporte': return 'Transporte';
        case 'ocio': return 'Ocio';
        case 'salud': return 'Salud';
        case 'otros': return 'Otros';
        default: return valor;
    }
}

// Converts payment method codes to readable Spanish text
function formatearMedio(valor) {
    switch (valor) {
        case 'efectivo': return 'Efectivo';
        case 'tarjetaDebito': return 'Tarjeta Débito';
        case 'tarjetaCredito': return 'Tarjeta Crédito';
        case 'otros': return 'Otros';
        default: return valor;
    }
}

// Formats numbers as currency with locale formatting
function formatCurrency(value) {
    if (typeof value !== 'number') value = parseFloat(value) || 0;
    const formatted = value.toLocaleString(navigator.language || 'es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `$${formatted}`;
}

// Formats date string to locale-specific format
function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleDateString(navigator.language || 'es-ES');
}

// CRUD OPERATIONS
// Deletes a movement by id and refreshes the UI
window.eliminarMovimiento = function(id) {
    let movimientos = getMovimientos().filter(m => m.id !== id);
    setMovimientos(movimientos);
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
    drawCategoriesChart(movimientos);
};

let editingId = null;

// Loads a movement into the form for editing
function editarMovimiento(id) {
    const movimientos = getMovimientos();
    const mov = movimientos.find(m => m.id === id);
    if (!mov) return;

    // Populate form fields with movement data
    document.getElementById('tipo').value = mov.tipo;
    document.getElementById('categoria').value = mov.categoria;
    document.getElementById('monto').value = mov.monto;
    document.getElementById('medioPago').value = mov.medioPago;
    document.getElementById('fecha').value = mov.fecha;
    document.getElementById('descripcion').value = mov.descripcion || '';

    editingId = mov.id;
    const submit = document.querySelector('#movimientoForm button[type=submit]');
    submit.textContent = 'Guardar cambios';

    // Add cancel button for editing
    let cancel = document.getElementById('cancelEdit');
    if (!cancel) {
        cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.id = 'cancelEdit';
        cancel.textContent = 'Cancelar';
        cancel.addEventListener('click', () => {
            editingId = null;
            document.getElementById('movimientoForm').reset();
            submit.textContent = 'Agregar';
            cancel.remove();
        });
        document.getElementById('movimientoForm').appendChild(cancel);
    }
}

// FORM HANDLING
// Handles form submission for adding or updating movements
document.getElementById('movimientoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const medioPago = document.getElementById('medioPago').value;
    const fecha = document.getElementById('fecha').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validate required fields
    if (!tipo || !categoria || !medioPago || !fecha || isNaN(monto) || monto <= 0) {
        mostrarMensaje('Completa todos los campos obligatorios con valores válidos.', true);
        return;
    }

    let movimientos = getMovimientos();
    if (editingId) {
        // Update existing movement
        movimientos = movimientos.map(m => m.id === editingId ? { ...m, tipo, categoria, monto, medioPago, fecha, descripcion } : m);
        editingId = null;
        const submit = document.querySelector('#movimientoForm button[type=submit]');
        submit.textContent = 'Agregar';
        const cancel = document.getElementById('cancelEdit');
        if (cancel) cancel.remove();
    } else {
        // Add new movement
        movimientos.push({
            id: Date.now(),
            tipo,
            categoria,
            monto,
            medioPago,
            fecha,
            descripcion
        });
    }
    setMovimientos(movimientos);

    this.reset();
    mostrarMensaje('Movimiento registrado con éxito.', false);
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
    drawCategoriesChart(movimientos);
});

// FILTER EVENT LISTENERS
// Refilters table when category filter changes
document.getElementById('filtroCategoria').addEventListener('change', () => {
    mostrarMovimientos(getMovimientos());
});

// Refilters table when payment method filter changes
document.getElementById('filtroMedioPago').addEventListener('change', () => {
    mostrarMovimientos(getMovimientos());
});

// Clears all filters and shows all movements
document.getElementById('limpiarFiltros').addEventListener('click', () => {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroMedioPago').value = '';
    mostrarMovimientos(getMovimientos());
});

// UI FEEDBACK
// Shows a temporary message to the user (success or error)
function mostrarMensaje(msj, error = false) {
    const div = document.getElementById('mensajeFeedback');
    div.textContent = msj;
    div.style.color = error ? "#b23b3b" : "#24662d";
    setTimeout(() => { div.textContent = ""; }, 2300);
}

// INITIALIZATION
// Loads and displays data when page loads
window.onload = function () {
    const movimientos = getMovimientos();
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
    drawCategoriesChart(movimientos);
};