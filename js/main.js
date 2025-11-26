// MAIN APPLICATION - Event Listeners & Initialization

let editingId = null;

// CSV EXPORT/IMPORT
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

// Export/Import buttons
document.getElementById('exportCSV').addEventListener('click', exportCSV);
document.getElementById('importCSVButton').addEventListener('click', () => {
    document.getElementById('importCSVInput').click();
});
document.getElementById('importCSVInput').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    importCSVFile(f);
});

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

// INITIALIZATION
// Loads and displays data when page loads
window.onload = function () {
    const movimientos = getMovimientos();
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
    drawCategoriesChart(movimientos);
};
