// DATA MANAGEMENT
// Retrieves all movements from localStorage, returns empty array if none exist
function getMovimientos() {
    return JSON.parse(localStorage.getItem('movimientos')) || [];
}

// Saves movements to localStorage as JSON string
function setMovimientos(movimientos) {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Deletes a movement by id and refreshes the UI
function eliminarMovimiento(id) {
    let movimientos = getMovimientos().filter(m => m.id !== id);
    setMovimientos(movimientos);
    actualizarResumen(movimientos);
    mostrarMovimientos(movimientos);
    drawCategoriesChart(movimientos);
}
