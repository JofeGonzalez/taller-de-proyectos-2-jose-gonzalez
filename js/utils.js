// FORMATTING UTILITIES
// Converts category codes to readable Spanish text
function formatearCategoria(valor) {
    switch (valor) {
        case 'sueldo': return 'Sueldo';
        case 'servicios': return 'Servicios';
        case 'telefono': return 'Teléfono';
        case 'seguros': return 'Seguros';
        case 'alquiler': return 'Alquiler';
        case 'mantenimiento': return 'Mantenimiento';
        case 'muebles': return 'Muebles y Electro';
        case 'suscripciones': return 'Suscripciones';
        case 'transportePrivado': return 'Transporte Privado';
        case 'transportePublico': return 'Transporte Público';
        case 'supermercado': return 'Supermercado';
        case 'kiosco': return 'Kiosco';
        case 'cuidado': return 'Cuidado Personal';
        case 'salud': return 'Salud';
        case 'indumentaria': return 'Indumentaria';
        case 'ahorro': return 'Ahorro';
        case 'inversiones': return 'Inversiones';
        case 'imprevistos': return 'Imprevistos';
        case 'familia': return 'Familia';
        case 'tarjetas': return 'Tarjetas';
        case 'educacion': return 'Educación';
        case 'viajes': return 'Viajes';
        case 'salidas': return 'Salidas';
        case 'comidas': return 'Comidas';
        case 'delivery': return 'Delivery';
        case 'entretenimiento': return 'Entretenimiento';
        case 'regalos': return 'Regalos';
        case 'hobbies': return 'Hobbies y Gustos';
        case 'oficina': return 'Oficina';
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
