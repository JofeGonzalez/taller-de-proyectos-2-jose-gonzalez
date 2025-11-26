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
