// Utilidades
function getMovimientos() {
    return JSON.parse(localStorage.getItem('movimientos')) || [];
}

function setMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Actualiza el resumen
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

// Renderiza la tabla con filtros aplicados
function mostrarMovimientos(movimientos) {
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const filtroMedioPago = document.getElementById('filtroMedioPago').value;
    const tbody = document.getElementById('tablaMovimientos');
    tbody.innerHTML = "";

    let filtrados = movimientos.filter(mov => {
        let pasaCategoria = filtroCategoria ? mov.categoria === filtroCategoria : true;
        let pasaMedio = filtroMedioPago ? mov.medioPago === filtroMedioPago : true;
        return pasaCategoria && pasaMedio;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = <tr><td colspan="7">No hay movimientos para mostrar</td></tr>;
    } else {
        filtrados.forEach((mov, index) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}</td>
                <td>${formatearCategoria(mov.categoria)}</td>
                <td>$${mov.monto.toFixed(2)}</td>
                <td>${formatearMedio(mov.medioPago)}</td>
                <td>${mov.fecha}</td>
                <td>${mov.descripcion || ''}</td>
                <td>
                    <button onclick="eliminarMovimiento(${mov.id})" title="Eliminar">🗑</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Traduce clave de categoría/medio a texto
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
function formatearMedio(valor) {
    switch (valor) {
        case 'efectivo': return 'Efectivo';
        case 'tarjetaDebito': return 'Tarjeta Débito';
        case 'tarjetaCredito': return 'Tarjeta Crédito';
        case 'otros': return 'Otros';
        default: return valor;
    }
}

// Elimina un movimiento por id
window.eliminarMovimiento = function(id) {
    if (!confirm('¿Seguro que deseas eliminar este movimiento?')) return;
    let movimientos = getMovimientos().filter(m => m.id !== id);
    setMovimientos(movimientos);
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
};

// Registrar nuevo movimiento
document.getElementById('movimientoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener valores
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const medioPago = document.getElementById('medioPago').value;
    const fecha = document.getElementById('fecha').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validación básica
    if (!tipo || !categoria || !medioPago || !fecha || isNaN(monto) || monto <= 0) {
        mostrarMensaje('Completa todos los campos obligatorios con valores válidos.', true);
        return;
    }

    // Crear y guardar
    let movimientos = getMovimientos();
    movimientos.push({
        id: Date.now(), // id único
        tipo,
        categoria,
        monto,
        medioPago,
        fecha,
        descripcion
    });
    setMovimientos(movimientos);

    // Limpiar formulario y actualizar pantalla
    this.reset();
    mostrarMensaje('Movimiento registrado con éxito.', false);
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
});

// Filters
document.getElementById('filtroCategoria').addEventListener('input', () => {
    mostrarMovimientos(getMovimientos());
});
document.getElementById('filtroMedioPago').addEventListener('input', () => {
    mostrarMovimientos(getMovimientos());
});
document.getElementById('limpiarFiltros').addEventListener('click', () => {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroMedioPago').value = '';
    mostrarMovimientos(getMovimientos());
});

// Feedback usuario
function mostrarMensaje(msj, error = false) {
    const div = document.getElementById('mensajeFeedback');
    div.textContent = msj;
    div.style.color = error ? "#b23b3b" : "#24662d";
    setTimeout(() => { div.textContent = ""; }, 2300);
}

// Inicial
window.onload = function () {
    const movimientos = getMovimientos();
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
};