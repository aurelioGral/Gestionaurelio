// script.js (para el formulario de reservas definitivas)

// ¡IMPORTANTE! Reemplaza esto con la URL de tu aplicación web de Google Apps Script.
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec';

// --- Elementos del DOM ---
const fechaInput = document.getElementById('fecha');
const nReservaInput = document.getElementById('nReserva');
const cantidadDiasAlquilerInput = document.getElementById('cantidadDiasAlquiler');
const vendedorSelect = document.getElementById('vendedor');
const reservaPasajerosInput = document.getElementById('reservaPasajeros');
const btnBuscarPreReserva = document.getElementById('btnBuscarPreReserva');
const inputPreReservaId = document.getElementById('inputPreReservaId');
const btnBuscarReserva = document.getElementById('btnBuscarReserva');
const inputBuscarReserva = document.getElementById('inputBuscarReserva');
const nombreCompletoInput = document.getElementById('nombreCompleto');
const telMailInput = document.getElementById('telMail');
const pasajerosContainer = document.getElementById('pasajerosContainer');
const observacionesTextarea = document.getElementById('observaciones');
const montoTotalAlquilerInput = document.getElementById('montoTotalAlquiler');
const montoTotalClasesInput = document.getElementById('montoTotalClases');
const descuentoInput = document.getElementById('descuento');
const montoTotalFinalInput = document.getElementById('montoTotalFinal');
const metodoPagoSelect = document.getElementById('metodoPagoSelect'); 
const tipoPagoSelect = document.getElementById('tipoPagoSelect'); 
const montoPagadoInput = document.getElementById('montoPagadoInput'); 
const montoPagadoPreRESERVAInput = document.getElementById('montoPagadoPreRESERVAInput'); 
const restaPagarInput = document.getElementById('restaPagarInput'); 
const btnGenerarTicket = document.getElementById('btnGenerarTicket');
const btnEliminar = document.getElementById('btnEliminar');
const btnActualizar = document.getElementById('btnActualizar');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnCargar = document.getElementById('btnCargar');
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeButton = document.querySelector('.close-button');
const loadingOverlay = document.getElementById('loadingOverlay');

const preReservaDateSelect = document.getElementById('preReservaDateSelect');
const preReservasTableContainer = document.getElementById('preReservasTableContainer');

// NUEVO: Referencia al input oculto de ESTADO de la pre-reserva
const estadoPreReservaHidden = document.getElementById('estadoPreReservaHidden');


const selectOptions = {
    TABLAS: [
        { value: "", text: "Seleccione" }, // Opción vacía por defecto
        { value: "SKI COMPLETO HEAD", text: "SKI COMPLETO HEAD" },
        { value: "SKI COMPLETO FISHER", text: "SKI COMPLETO FISHER" },
        { value: "SKI COMPLETO VOLKL", text: "SKI COMPLETO VOLKL" },
        { value: "TABLA SKI", text: "TABLA SKI" },
        { value: "SKI JUNIOR", text: "SKI JUNIOR" },
        { value: "BASTONES", text: "BASTONES" },
        { value: "SNOW COMPLETO", text: "SNOW COMPLETO" },
        { value: "TABLA SNOW", text: "TABLA SNOW" }
    ],
    BOTAS: [
        { value: "", text: "Seleccione" },
        { value: "SKI COMPLETO HEAD", text: "SKI COMPLETO HEAD" },
        { value: "SKI COMPLETO FISHER", text: "SKI COMPLETO FISHER" },
        { value: "SKI COMPLETO VOLKL", text: "SKI COMPLETO VOLKL" },
        { value: "SKI BOTAS", text: "SKI BOTAS" },
        { value: "SKI JUNIOR", text: "SKI JUNIOR" },
        { value: "SNOW BOTAS", text: "SNOW BOTAS" }
    ],
    ROPA: [
        { value: "", text: "Seleccione" },
        { value: "ROPA COMPLETO", text: "ROPA COMPLETO" },
        { value: "CAMPERA", text: "CAMPERA" },
        { value: "PANTALON", text: "PANTALON" },
        { value: "GUANTES", text: "GUANTES" },
        { value: "PRE-SKI", text: "PRE-SKI" },
        { value: "PANT-GUAN", text: "PANT-GUAN" },
        { value: "PANT-GUAN-PRESKI", text: "PANT-GUAN-PRESKI" },
        { value: "CAMP-GUANTES", text: "CAMP-GUANTES" },
        { value: "CAMP-GUANTES-PRESKI", text: "CAMP-GUANTES-PRESKI" },
        { value: "CAMP-PRESKI", text: "CAMP-PRESKI" },
        { value: "PANT-CAMP", text: "PANT-CAMP" },
        { value: "CAMP-GUANT-PANT", text: "CAMAP-GUNT-PANT" },
        { value: "PANT-PRESKI", text: "PANT-PRESKI" }
    ],
    CASCO_Y_ANTIPARRAS: [
        { value: "", text: "Seleccione" },
        { value: "CASCO Y ANTIPARRAS", text: "CASCO Y ANTIPARRAS" },
        { value: "CASCO", text: "CASCO" },
        { value: "ANTIPARRAS", text: "ANTIPARRAS" },
        { value: "TRINEO MEDIANO", text: "TRINEO MEDIANO" },
        { value: "TRINEO DOBLE", text: "TRINEO DOBLE" },
        { value: "CULI PATIN", text: "CULI PATIN" }
    ],
    CLASES: [
        { value: "", text: "Seleccione" },
        { value: "SKI GRUPAL", text: "SKI GRUPAL" },
        { value: "SKI PRIVADA", text: "SKI PRIVADA" },
        { value: "SNOW GRUPAL", text: "SKI GRUPAL" },
        { value: "SNOW PRIVADA", text: "SNOW PRIVADA" }
    ]
};

// --- Funciones para el Loading Overlay ---
function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// --- Funciones de Utilidad ---

/**
 * Muestra un mensaje al usuario en un pop-up modal.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - 'success', 'error', o 'info'.
 */
function showMessage(message, type) {
    modalMessage.textContent = message;
    messageModal.classList.add('show'); 
    
    // Limpiar clases de estilo previas y añadir la nueva
    modalMessage.className = ''; 
    const modalContent = messageModal.querySelector('.modal-content');
    modalContent.className = 'modal-content'; 
    modalContent.classList.add(type); 

    messageModal.style.display = 'flex'; 

    // Cerrar el modal al hacer clic en el botón de cerrar
    closeButton.onclick = function() {
        messageModal.style.display = 'none';
        modalMessage.className = ''; 
        modalContent.className = 'modal-content'; 
    }

    // Cerrar el modal al hacer clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == messageModal) {
            messageModal.style.display = 'none';
            modalMessage.className = '';
            modalContent.className = 'modal-content';
        }
    }

    // Opcional: Cerrar automáticamente después de unos segundos
    if (type !== 'error') { 
        setTimeout(() => {
            messageModal.style.display = 'none';
            modalMessage.className = '';
            modalContent.className = 'modal-content';
        }, 5000);
    }
}

/**
 * Realiza una solicitud POST a la aplicación web de Apps Script.
 * @param {string} action - La acción a realizar en el backend.
 * @param {Object} payload - Los datos a enviar al backend.
 * @returns {Promise<Object>} - La respuesta del backend.
 */
async function callAppsScript(action, payload = {}) {
    showLoading(); // <--- Mostrar el loading antes de la llamada
    try {
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify({ action, payload }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error calling Apps Script:', error);
        showMessage(`Error de comunicación con el servidor: ${error.message}`, 'error');
        return { success: false, message: 'Error de red o servidor.' };
    } finally {
        hideLoading(); // <--- Ocultar el loading SIEMPRE al finalizar (éxito o error)
    }
}

/**
 * Genera dinámicamente las filas de pasajeros en el formulario.
 * @param {number} count - Número de filas de pasajeros a generar.
 */
function generatePasajeroRows(count) {
    pasajerosContainer.innerHTML = ''; // Limpiar el contenedor actual
    for (let i = 1; i <= count; i++) {
        const row = document.createElement('div');
        row.className = 'pasajero-row';
        row.dataset.paxNum = i;
        row.innerHTML = `
            <h3>Pasajero ${i}</h3>
            <div class="form-group">
                <label for="tablas_pax${i}">TABLAS:</label>
                <select id="tablas_pax${i}"></select>
            </div>
            <div class="form-group">
                <label for="botas_pax${i}">BOTAS:</label>
                <select id="botas_pax${i}"></select>
            </div>
            <div class="form-group">
                <label for="ropa_pax${i}">ROPA:</label>
                <select id="ropa_pax${i}"></select>
            </div>
            <div class="form-group">
                <label for="casco_y_antiparras_pax${i}">CASCO Y ANTIPARRAS:</label>
                <select id="casco_y_antiparras_pax${i}"></select>
            </div>
            <div class="form-group">
                <label for="clases_pax${i}">CLASES:</label>
                <select id="clases_pax${i}"></select>
            </div>
            <div class="form-group">
                <label for="monto_alquiler_pax${i}">Valor Alquiler:</label>
                <input type="number" id="monto_alquiler_pax${i}" min="0" value="0">
            </div>
            <div class="form-group">
                <label for="monto_clase_pax${i}">Valor Clase:</label>
                <input type="number" id="monto_clase_pax${i}" min="0" value="0">
            </div>
        `;
        pasajerosContainer.appendChild(row);

        // Llenar los select con opciones
        populateSelect(`tablas_pax${i}`, selectOptions.TABLAS);
        populateSelect(`botas_pax${i}`, selectOptions.BOTAS);
        populateSelect(`ropa_pax${i}`, selectOptions.ROPA);
        populateSelect(`casco_y_antiparras_pax${i}`, selectOptions.CASCO_Y_ANTIPARRAS);
        populateSelect(`clases_pax${i}`, selectOptions.CLASES);
    }
    addPaxInputChangeListeners(); // Añadir listeners para los cálculos
    calculateTotals(); // Recalcular totales cada vez que se regeneran las filas
}

/**
 * Llena un elemento <select> con opciones.
 * @param {string} selectId - El ID del elemento select.
 * @param {Array<Object>} options - Un array de objetos {value: '...', text: '...'}.
 */
function populateSelect(selectId, options) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    selectElement.innerHTML = ''; // Limpiar opciones existentes
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        selectElement.appendChild(opt);
    });
}

/**
 * Añade listeners de cambio a los inputs de monto de cada pasajero para recalcular totales.
 */
function addPaxInputChangeListeners() {
    document.querySelectorAll('[id^="monto_alquiler_pax"], [id^="monto_clase_pax"]').forEach(input => {
        input.removeEventListener('input', calculateTotals); // Eliminar listener previo si existe
        input.addEventListener('input', calculateTotals);
    });
    descuentoInput.removeEventListener('input', calculateTotals);
    descuentoInput.addEventListener('input', calculateTotals);
    
    if (montoPagadoInput) {
        montoPagadoInput.removeEventListener('input', calculateRestaPagar);
        montoPagadoInput.addEventListener('input', calculateRestaPagar);
    }
}


/**
 * Calcula los montos totales de alquiler, clases, el final, y la resta a pagar.
 */
function calculateTotals() {
    let totalAlquiler = 0;
    let totalClases = 0;

    for (let i = 1; i <= parseInt(reservaPasajerosInput.value || 0); i++) {
        const montoAlquilerPax = parseFloat(document.getElementById(`monto_alquiler_pax${i}`)?.value || 0);
        const montoClasePax = parseFloat(document.getElementById(`monto_clase_pax${i}`)?.value || 0);
        totalAlquiler += montoAlquilerPax;
        totalClases += montoClasePax;
    }

    montoTotalAlquilerInput.value = totalAlquiler.toFixed(2);
    montoTotalClasesInput.value = totalClases.toFixed(2);

    const descuento = parseFloat(descuentoInput.value || 0);
    const montoFinal = totalAlquiler + totalClases - descuento;
    montoTotalFinalInput.value = montoFinal.toFixed(2);

    // Llama a calculateRestaPagar para asegurar que se actualice después de los totales
    calculateRestaPagar(); 
}

/**
 * Recopila todos los datos del formulario.
 * @returns {Object} Un objeto con los datos del formulario.
 */
function getFormData() { 
    const formData = {
        NRESERVA: nReservaInput.value,
        FECHA: fechaInput.value,
        DIAS: cantidadDiasAlquilerInput.value,
        CANTIDAD_PASAJEROS: reservaPasajerosInput.value,
        NOMBRE_COMPLETO: nombreCompletoInput.value,
        TEL_MAIL: telMailInput.value,
        VENDEDOR: vendedorSelect.value,
        OBSERVACIONES: observacionesTextarea.value,
        MONTO_TOTAL_ALQUILER: parseFloat(montoTotalAlquilerInput.value),
        MONTO_TOTAL_CLASES: parseFloat(montoTotalClasesInput.value),
        DESCUENTO: parseFloat(descuentoInput.value),
        MONTO_TOTAL_FINAL: parseFloat(montoTotalFinalInput.value),
        METODO_DE_PAGO: metodoPagoSelect.value,
        
        // Nuevos campos de pago
        TIPO_DE_PAGO: tipoPagoSelect.value, 
        MONTO_PAGADO_PRE_RESERVA: parseFloat(montoPagadoPreRESERVAInput.value) || 0,
        MONTO_PAGADO: parseFloat(montoPagadoInput.value), 
        
        RESTA_PAGAR: parseFloat(restaPagarInput.value), 
        ID_PRE_RESERVA: inputPreReservaId.value,
        // *** NUEVO: Incluir el ESTADO de la pre-reserva (Cobrado/No Cobrado) ***
        ESTADO: estadoPreReservaHidden.value 
    };

    // Recopilar datos de pasajeros
    document.querySelectorAll('.pasajero-row').forEach((row, index) => {
        const paxNum = index + 1;
        formData[`TABLAS_PAX${paxNum}`] = row.querySelector(`#tablas_pax${paxNum}`).value;
        formData[`BOTAS_PAX${paxNum}`] = row.querySelector(`#botas_pax${paxNum}`).value;
        formData[`ROPA_PAX${paxNum}`] = row.querySelector(`#ropa_pax${paxNum}`).value;
        formData[`CASCO_Y_ANTIPARRAS_PAX${paxNum}`] = row.querySelector(`#casco_y_antiparras_pax${paxNum}`).value;
        formData[`CLASES_PAX${paxNum}`] = row.querySelector(`#clases_pax${paxNum}`).value;
        formData[`MONTO_ALQUILER_PAX${paxNum}`] = parseFloat(row.querySelector(`#monto_alquiler_pax${paxNum}`).value); 
        formData[`MONTO_CLASE_PAX${paxNum}`] = parseFloat(row.querySelector(`#monto_clase_pax${paxNum}`).value); 
    });

    return formData;
}

/**
 * Rellena el formulario con los datos de una reserva.
 * @param {Object} data - Objeto con los datos de la reserva.
 */
function fillForm(data) {
    // Campos principales
    fechaInput.value = data.FECHA || '';
    nReservaInput.value = data.NRESERVA || '';
    cantidadDiasAlquilerInput.value = data.DIAS || '';
    vendedorSelect.value = data.VENDEDOR || '';
    
    // Importante: setear la cantidad de pasajeros ANTES de generar las filas
    const cantPasajeros = parseInt(data.CANTIDAD_PASAJEROS) || 1;
    reservaPasajerosInput.value = cantPasajeros;
    generatePasajeroRows(cantPasajeros); // Generar las filas de pasajeros primero
    
    nombreCompletoInput.value = data.NOMBRE_COMPLETO || '';
    telMailInput.value = data.TEL_MAIL || '';
    observacionesTextarea.value = data.OBSERVACIONES || '';

    // Rellenar campos de pasajeros
    for (let i = 1; i <= cantPasajeros; i++) {
        const tablasPax = document.getElementById(`tablas_pax${i}`);
        if (tablasPax) populateSelect(`tablas_pax${i}`, selectOptions.TABLAS); 
        if (tablasPax) tablasPax.value = data[`TABLAS_PAX${i}`] || '';

        const botasPax = document.getElementById(`botas_pax${i}`);
        if (botasPax) populateSelect(`botas_pax${i}`, selectOptions.BOTAS);
        if (botasPax) botasPax.value = data[`BOTAS_PAX${i}`] || '';

        const ropaPax = document.getElementById(`ropa_pax${i}`);
        if (ropaPax) populateSelect(`ropa_pax${i}`, selectOptions.ROPA);
        if (ropaPax) ropaPax.value = data[`ROPA_PAX${i}`] || '';

        const cascoAntiparrasPax = document.getElementById(`casco_y_antiparras_pax${i}`);
        if (cascoAntiparrasPax) populateSelect(`casco_y_antiparras_pax${i}`, selectOptions.CASCO_Y_ANTIPARRAS);
        if (cascoAntiparrasPax) cascoAntiparrasPax.value = data[`CASCO_Y_ANTIPARRAS_PAX${i}`] || '';

        const clasesPax = document.getElementById(`clases_pax${i}`);
        if (clasesPax) populateSelect(`clases_pax${i}`, selectOptions.CLASES);
        if (clasesPax) clasesPax.value = data[`CLASES_PAX${i}`] || '';
        
        // Montos numéricos: asegurarse de parsear a float y usar toFixed para mostrar
        const montoAlquilerPax = document.getElementById(`monto_alquiler_pax${i}`);
        if (montoAlquilerPax) montoAlquilerPax.value = (parseFloat(data[`MONTO_ALQUILER_PAX${i}`]) || 0).toFixed(2);
        
        const montoClasePax = document.getElementById(`monto_clase_pax${i}`);
        if (montoClasePax) montoClasePax.value = (parseFloat(data[`MONTO_CLASE_PAX${i}`]) || 0).toFixed(2);
    }

    // Campos de totales y pago
    montoTotalAlquilerInput.value = (parseFloat(data.MONTO_TOTAL_ALQUILER) || 0).toFixed(2);
    montoTotalClasesInput.value = (parseFloat(data.MONTO_TOTAL_CLASES) || 0).toFixed(2);
    descuentoInput.value = (parseFloat(data.DESCUENTO) || 0).toFixed(2);
    montoTotalFinalInput.value = (parseFloat(data.MONTO_TOTAL_FINAL) || 0).toFixed(2);
    metodoPagoSelect.value = data.METODO_DE_PAGO || '';
    
    // Nuevos campos de pago
    tipoPagoSelect.value = data.TIPO_DE_PAGO || 'Parcial'; 
    montoPagadoInput.value = (parseFloat(data.MONTO_PAGADO) || 0).toFixed(2); 
    montoPagadoPreRESERVAInput.value = (data.MONTO_PAGADO_PRE_RESERVA || 0).toFixed(2);

    // *** NUEVO: Llenar el campo oculto con el ESTADO de la pre-reserva ***
    if (estadoPreReservaHidden) {
        // Asume que la propiedad se llama ESTADO en los datos devueltos por getPreReserva o getReservaDefinitiva
        estadoPreReservaHidden.value = data.ESTADO || 'No Cobrado'; 
    }
  
    // Actualizar el estado del campo Monto Pagado basado en el Tipo de Pago cargado
    if (tipoPagoSelect.value === 'Total') {
        montoPagadoInput.value = restaPagarInput.value;
                montoPagadoInput.setAttribute('readonly', true);
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
    } else {
        montoPagadoInput.removeAttribute('readonly');
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }

    // Recalcular para asegurar consistencia (especialmente si algún valor no vino o es inválido)
    calculateTotals(); 
}

/**
 * Limpia todos los campos del formulario.
 */
function clearForm() {
    fechaInput.value = new Date().toLocaleDateString('es-AR');
    nReservaInput.value = '';
    cantidadDiasAlquilerInput.value = '';
    vendedorSelect.value = '';
    reservaPasajerosInput.value = '1';
    nombreCompletoInput.value = '';
    telMailInput.value = '';
    observacionesTextarea.value = '';
    montoTotalAlquilerInput.value = '0.00'; 
    montoTotalClasesInput.value = '0.00';
    descuentoInput.value = '0';
    montoTotalFinalInput.value = '0.00';
    metodoPagoSelect.value = '';
    
    // Limpiar nuevos campos de pago
    if (tipoPagoSelect) tipoPagoSelect.value = ''; 
    if (montoPagadoInput) {
        montoPagadoInput.value = '0';
        montoPagadoInput.removeAttribute('readonly'); 
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }
     if (montoPagadoPreRESERVAInput) {
        montoPagadoPreRESERVAInput.value = '0';
        montoPagadoPreRESERVAInput.removeAttribute('readonly'); 
        montoPagadoPreRESERVAInput.style.backgroundColor = '#fcfcfc';
    }
    // *** NUEVO: Limpiar el campo oculto de ESTADO ***
    if (estadoPreReservaHidden) {
        estadoPreReservaHidden.value = ''; 
    }

    restaPagarInput.value = '0.00';
    inputPreReservaId.value = '';
    inputBuscarReserva.value = '';

    generatePasajeroRows(1);
    getNextReservaIdAndPopulate();
    calculateRestaPagar(); 
}

/**
 * Genera el HTML del ticket para impresión en una nueva ventana.
 * @param {Object} data - Los datos de la reserva para el ticket.
 */
function generatePrintableTicket(data) {
    let paxDetailsHtml = '';
    const numPasajeros = parseInt(data.CANTIDAD_PASAJEROS || 0);

    for (let i = 1; i <= numPasajeros; i++) {
        const montoAlquilerPax = (parseFloat(data[`MONTO_ALQUILER_PAX${i}`]) || 0).toFixed(2);
        const montoClasePax = (parseFloat(data[`MONTO_CLASE_PAX${i}`]) || 0).toFixed(2);

        paxDetailsHtml += `
            <div class="pax-detail">
                <h4>Pasajero ${i}</h4>
                <p><strong>Tablas:</strong> ${data[`TABLAS_PAX${i}`] || '-'}</p>
                <p><strong>Botas:</strong> ${data[`BOTAS_PAX${i}`] || '-'}</p>
                <p><strong>Ropa:</strong> ${data[`ROPA_PAX${i}`] || '-'}</p>
                <p><strong>Casco/Antiparras:</strong> ${data[`CASCO_Y_ANTIPARRAS_PAX${i}`] || '-'}</p>
                <p><strong>Clases:</strong> ${data[`CLASES_PAX${i}`] || '-'}</p>
                <p><strong>Valor Alquiler:</strong> $${montoAlquilerPax}</p>
                <p><strong>Valor Clases:</strong> $${montoClasePax}</p>
            </div>
        `;
    }

    const montoTotalAlquiler = parseFloat(data.MONTO_TOTAL_ALQUILER) || 0;
    const montoTotalClases = parseFloat(data.MONTO_TOTAL_CLASES) || 0;
    const descuento = parseFloat(data.DESCUENTO) || 0;
    const montoTotalFinal = parseFloat(data.MONTO_TOTAL_FINAL) || 0;
    const montoPagado = parseFloat(data.MONTO_PAGADO) || 0; 
    const montoPagadoPreRESERVA = parseFloat(data.MONTO_PAGADO_PRE_RESERVA) || 0; 
    const restaPagar = parseFloat(data.RESTA_PAGAR) || 0;

    const singleTicketContent = `
        <div class="ticket">
            <h2>DETALLE DE RESERVA</h2>
            <div class="line"></div>
            <p class="flex-row"><span>N° Reserva:</span> <span>#${data.NRESERVA || '-'}</span></p>
            <p class="flex-row"><span>Fecha:</span> <span>${data.FECHA || '-'}</span></p>
            <p class="flex-row"><span>Días Alquiler:</span> <span>${data.DIAS || '-'}</span></p>
            <p class="flex-row"><span>Cant. Pasajeros:</span> <span>${data.CANTIDAD_PASAJEROS || '-'}</span></p>
            <p class="flex-row"><span>Cliente:</span> <span>${data.NOMBRE_COMPLETO || '-'}</span></p>
            <p class="flex-row"><span>Contacto:</span> <span>${data.TEL_MAIL || '-'}</span></p>
            <p class="flex-row"><span>Vendedor:</span> <span>${data.VENDEDOR || '-'}</span></p>
            <p class="flex-row"><span>Estado de Pago (Pre-reserva):</span> <span>${data.ESTADO || '-'}</span></p>
            <div class="line"></div>
            <h3>Detalle por Pasajero:</h3>
            ${paxDetailsHtml}
            <div class="line"></div>
            <p class="flex-row"><span>Subtotal Alquiler:</span> <span>$${montoTotalAlquiler.toFixed(2)}</span></p>
            <p class="flex-row"><span>Subtotal Clases:</span> <span>$${montoTotalClases.toFixed(2)}</span></p>
            <p class="flex-row"><span>Descuento:</span> <span>$${descuento.toFixed(2)}</span></p>
            <p class="flex-row total-line"><span>MONTO TOTAL FINAL:</span> <span>$${montoTotalFinal.toFixed(2)}</span></p>
            <p class="flex-row"><span>Método de Pago:</span> <span>${data.METODO_DE_PAGO || '-'}</span></p>
            <p class="flex-row"><span>Tipo de Pago:</span> <span>${data.TIPO_DE_PAGO || '-'}</span></p>
            <p class="flex-row"><span>Monto Pagado:</span> <span>$${montoPagado.toFixed(2)}</span></p>
            <p class="flex-row"><span>Monto Pagado en Pre Reserva:</span> <span>$${montoPagadoPreRESERVA.toFixed(2)}</span></p>
            <p class="flex-row"><span>Resta Pagar:</span> <span>$${restaPagar.toFixed(2)}</span></p>
            <div class="line"></div>
            <p><strong>Observaciones:</strong> ${data.OBSERVACIONES || '-'}</p>
            <div class="line"></div>
            <p style="text-align: center;">¡Gracias por su reserva!</p>
        </div>
    `;

    const repeatedTicketContent = singleTicketContent.repeat(4);

    const ticketHtml = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket de Reserva #${data.NRESERVA}</title>
            <style>
                body {
                    font-family: 'Courier New', Courier, monospace;
                    margin: 20mm; 
                    font-size: 10pt;
                }
                .ticket {
                    width: 80mm;
                    margin: 0 auto 15mm auto; 
                    border: 1px dashed #ccc;
                    padding: 10px;
                    page-break-after: always; 
                }
                h2, h3, h4 { text-align: center; margin-bottom: 5px; }
                p { margin: 2px 0; }
                .line { border-top: 1px dashed #ccc; margin: 10px 0; }
                .flex-row { display: flex; justify-content: space-between; }
                .total-line { font-weight: bold; }
                .pax-detail { border: 1px solid #eee; padding: 8px; margin-bottom: 10px; background-color: #f9f9f9; }
                .pax-detail h4 { text-align: left; margin-bottom: 5px; color: #333; }
                @media print {
                    .no-print { display: none; }
                    body { margin: 0; } 
                    .ticket { border: none; padding: 0; width: auto; }
                }
            </style>
        </head>
        <body>
            ${repeatedTicketContent} 
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                    }, 500); 
                };
            </script>
        </body>
        </html>
    `;

    try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(ticketHtml);
            printWindow.document.close();
        } else {
            alert('No se pudo abrir la ventana de impresión. Verifique la configuración de bloqueadores de pop-ups.');
            console.error('El navegador bloqueó la ventana de impresión o falló al abrirla.');
        }
    } catch (error) {
        console.error('Error al generar el ticket de impresión:', error);
        alert('Hubo un error al generar el ticket. Consulte la consola para más detalles.');
    }
}


/**
 * Carga las fechas con pre-reservas en el select correspondiente.
 */
async function populatePreReservaDates() {
    preReservaDateSelect.innerHTML = '<option value="">Cargando fechas...</option>'; 
    const response = await callAppsScript('getDatesWithPreReservas');
    if (response.success && response.dates.length > 0) {
        preReservaDateSelect.innerHTML = '<option value="">-- Seleccione una fecha --</option>'; 
        response.dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            preReservaDateSelect.appendChild(option);
        });
    } else if (response.success && response.dates.length === 0) {
        preReservaDateSelect.innerHTML = '<option value="">No hay pre-reservas disponibles</option>';
    } else {
        preReservaDateSelect.innerHTML = '<option value="">Error al cargar fechas</option>';
        showMessage(response.message, 'error');
    }
}

/**
 * Genera y muestra la tabla de pre-reservas para una fecha dada.
 * @param {string} date - La fecha seleccionada en formato DD/MM/YYYY.
 */
async function displayPreReservasTable(date) {
    if (!date) {
        preReservasTableContainer.innerHTML = '<p>Seleccione una fecha para ver las pre-reservas.</p>';
        return;
    }

    preReservasTableContainer.innerHTML = '<p>Cargando pre-reservas para ' + date + '...</p>';
    const response = await callAppsScript('getPreReservasByDate', { date: date });

    if (response.success && response.preReservas.length > 0) {
        let tableHtml = `
            <table class="pre-reservas-table">
                <thead>
                    <tr>
                        <th>N° Pre-reserva</th>
                        <th>Nombre Completo</th>
                        <th>Estado Pago</th>
                        <th>Situación</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;
        response.preReservas.forEach(pr => {
            // Clases para el estado de pago
            const estadoPagoClass = pr.estado === 'Cobrado' ? 'status-cobrado' : 'status-no-cobrado';
            // Clases para la situación (Cargada/No Cargada)
            const situacionClass = pr.situacion === 'Cargada' ? 'status-cargada' : '';

            const buttonText = pr.situacion === 'Cargada' ? 'Cargada' : 'Cargar';
            const buttonDisabled = pr.situacion === 'Cargada' ? 'disabled' : '';

            tableHtml += `
                <tr data-prereserva-id="${pr.id}">
                    <td>${pr.id}</td>
                    <td>${pr.nombreCompleto}</td>
                    <td class="${estadoPagoClass}">${pr.estado}</td>
                    <td class="${situacionClass}">${pr.situacion}</td>
                    <td>
                        <button class="load-prereserva-btn" data-id="${pr.id}" ${buttonDisabled}>${buttonText}</button>
                    </td>
                </tr>
            `;
        });
        tableHtml += `
                </tbody>
            </table>
        `;
        preReservasTableContainer.innerHTML = tableHtml;

        document.querySelectorAll('.load-prereserva-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const preReservaId = event.target.dataset.id;
                const confirmation = confirm(`¿Desea cargar la pre-reserva N° ${preReservaId} al formulario principal?`);
                if (confirmation) {
                    await loadPreReservaIntoForm(preReservaId); // Llamamos a la función de carga
                } else {
                    showMessage('Carga de pre-reserva cancelada.', 'info');
                }
            });
        });

    } else if (response.success && response.preReservas.length === 0) {
        preReservasTableContainer.innerHTML = '<p>No hay pre-reservas para esta fecha.</p>';
    } else {
        preReservasTableContainer.innerHTML = '<p>Error al cargar pre-reservas: ' + response.message + '</p>';
        showMessage(response.message, 'error');
    }
}

/**
 * Carga los datos de una pre-reserva en el formulario principal y la marca como "Cargada".
 * Esta función es la que se llama al hacer clic en el botón "Cargar" de la tabla de pre-reservas.
 * @param {string} idPreReserva - El ID de la pre-reserva a cargar.
 */
async function loadPreReservaIntoForm(idPreReserva) {
    const result = await callAppsScript('getPreReserva', { idPreReserva: idPreReserva });

    if (result.success && result.data) {
        const preReserva = result.data;
        
        // Limpiar el formulario antes de cargar nuevos datos, excepto la fecha actual
        // No llamamos a clearForm() directamente para mantener la fecha del formulario si es necesario
        // Opcional: podrías llamar a clearForm() y luego re-setear la fecha con preReserva.FECHA
        clearForm(); // Limpia todo, incluyendo la fecha, y luego la fillForm la setea
        

        fillForm(preReserva); // Rellena el formulario con los datos de la pre-reserva
        fechaInput.value =  new Date().toLocaleDateString('es-AR'); // Si la fecha de la pre-reserva es prioritaria
        // Asigna el ID de la pre-reserva al campo PRE_RESERVA_ID en el formulario principal
        inputPreReservaId.value = preReserva.ID_PRE_RESERVA; // Asegúrate de que el campo PRE_RESERVA_ID se capture en getFormData()

        showMessage(`Pre-reserva N° ${idPreReserva} cargada con éxito.`, 'success');
        
        // Opcional: Si deseas que el N° de Reserva se genere después de cargar la pre-reserva,
        // y no se herede de la pre-reserva (que no tiene NRESERVA de reserva definitiva)
        nReservaInput.value = ''; // Limpiar el NRESERVA para que se genere uno nuevo al guardar
        await getNextReservaIdAndPopulate(); // Obtener el siguiente ID de reserva definitiva

        // Marcar la pre-reserva como "Cargada" en la hoja 'PreReserva' (columna SITUACION)
        const markResponse = await callAppsScript('markPreReservaAsLoaded', { 
            idPreReserva: idPreReserva, 
            newSituation: 'Cargada' // Coincide con el nombre de la columna en Apps Script
        });
        if (markResponse.success) {
            console.log(markResponse.message);
            // Si la tabla de pre-reservas está visible, actualiza su estado visual
            displayPreReservasTable(preReservaDateSelect.value); 
        } else {
            console.error('Error al marcar pre-reserva como cargada:', markResponse.message);
        }

    } else {
        showMessage('Error al cargar pre-reserva: ' + result.message, 'error');
        clearForm(); // Limpia el formulario si la carga falla
    }
}


// --- Event Listeners ---

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fechaInput.value = new Date().toLocaleDateString('es-AR');
    populatePreReservaDates();

     if (btnLimpiar) { // Asegurarse de que el botón exista antes de añadir el listener
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea limpiar todos los campos del formulario?')) {
                // Aquí se llama a la función que realiza la limpieza del formulario.
                // Esta función (clearForm()) es la que te proporcioné en la respuesta anterior.
                clearForm(); 
                showMessage('Formulario limpiado.', 'info');
            } else {
                showMessage('Limpieza de formulario cancelada.', 'info');
            }
        });
    }

    preReservaDateSelect.addEventListener('change', (event) => {
        displayPreReservasTable(event.target.value);
    });

    reservaPasajerosInput.addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        if (!isNaN(count) && count >= 1 && count <= 15) {
            generatePasajeroRows(count);
        } else if (isNaN(count) || count < 1) {
            generatePasajeroRows(1); 
            reservaPasajerosInput.value = 1;
        }
    });

    generatePasajeroRows(parseInt(reservaPasajerosInput.value));
    
    getNextReservaIdAndPopulate();

    const montoTotalFinalVal = parseFloat(montoTotalFinalInput.value) || 0; 
    const montoPagadoPreRESERVAcuenta = parseFloat(montoPagadoPreRESERVAInput.value)|| 0;
    if (tipoPagoSelect.value === 'Total') {
        montoPagadoInput.value = restaPagarInput.value;
        montoPagadoInput.setAttribute('readonly', true);
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
    } else {
        montoPagadoInput.removeAttribute('readonly');
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }
    calculateRestaPagar(); 
});


// Botón Buscar Pre-Reserva
btnBuscarPreReserva.addEventListener('click', async () => {
    const id = inputPreReservaId.value.trim();
    if (!id) {
        showMessage('Por favor, ingrese un ID de Pre-Reserva.', 'error');
        return;
    }
    await loadPreReservaIntoForm(id); // Usa la nueva función unificada
});

// Botón Buscar Reserva
btnBuscarReserva.addEventListener('click', async () => {
    const id = inputBuscarReserva.value.trim();
    if (!id) {
        showMessage('Por favor, ingrese un N° de Reserva para buscar.', 'error');
        return;
    }

    const response = await callAppsScript('getReservaDefinitiva', { nReserva: id });
    if (response.success) {
        fillForm(response.reserva);
        showMessage('Reserva cargada para edición.', 'success');
        // Cuando cargas una reserva definitiva, no es una pre-reserva, 
        // así que limpia el campo de PRE_RESERVA_ID y el estado oculto.
        inputPreReservaId.value = ''; 
        if (estadoPreReservaHidden) {
            estadoPreReservaHidden.value = ''; 
        }
    } else {
        showMessage(response.message, 'error');
        clearForm();
    }
});

// Botón Cargar (Crear nueva Reserva)
btnCargar.addEventListener('click', async () => {
    const formData = getFormData();
    if (!formData.NOMBRE_COMPLETO || !formData.CANTIDAD_PASAJEROS || parseInt(formData.CANTIDAD_PASAJEROS) < 1) {
        showMessage('Por favor, complete al menos Nombre Completo y Cantidad de Pasajeros.', 'error');
        return;
    }

    const response = await callAppsScript('addReserva', formData);
    if (response.success) {
        showMessage(`Reserva #${response.newId} cargada con éxito.`, 'success');
        formData.NRESERVA = response.newId; // Asegurar que el ticket tenga el N° de Reserva real
        generatePrintableTicket(formData);
        clearForm();
        populatePreReservaDates(); // Recargar las fechas de pre-reservas para reflejar cambios de SITUACION
        displayPreReservasTable(preReservaDateSelect.value); // Actualizar la tabla de pre-reservas
    } else {
        showMessage(response.message, 'error');
    }
});

// Botón Actualizar
btnActualizar.addEventListener('click', async () => {
    const formData = getFormData();
    if (!formData.NRESERVA || parseInt(formData.NRESERVA) === 0 || formData.NRESERVA === 'Error') {
        showMessage('No hay N° de Reserva válido para actualizar. Cargue o busque una reserva primero.', 'error');
        return;
    }

    const response = await callAppsScript('updateReserva', formData);
    if (response.success) {
        showMessage('Reserva actualizada con éxito.', 'success');
        generatePrintableTicket(formData);
        clearForm();
        // Después de actualizar, podría ser bueno actualizar las listas de pre-reservas si aplica
        populatePreReservaDates(); 
        displayPreReservasTable(preReservaDateSelect.value); 
    } else {
        showMessage(response.message, 'error');
    }
});

// Botón Eliminar
btnEliminar.addEventListener('click', async () => {
    const nReservaToDelete = nReservaInput.value.trim();

    if (!nReservaToDelete || parseInt(nReservaToDelete) === 0 || nReservaToDelete === 'Error') {
        showMessage('No hay N° de Reserva válido para eliminar. Cargue o busque una reserva primero.', 'error');
        return;
    }

    if (!confirm(`¿Está seguro de que desea eliminar la reserva N° ${nReservaToDelete}? Esta acción es irreversible.`)) {
        showMessage('Eliminación cancelada.', 'info');
        return;
    }

    const response = await callAppsScript('deleteReserva', { nReserva: nReservaToDelete });

    if (response.success) {
        showMessage(`Reserva N° ${nReservaToDelete} eliminada con éxito.`, 'success');
        clearForm();
        // Si se elimina una reserva que vino de una pre-reserva,
        // podrías querer cambiar el estado de la pre-reserva de vuelta a "No Cargada"
        // Esto implicaría una lógica adicional en tu Apps Script para `deleteReserva`
        // o una llamada adicional aquí si sabes el ID de pre-reserva.
        populatePreReservaDates(); 
        displayPreReservasTable(preReservaDateSelect.value); 
    } else {
        showMessage(response.message, 'error');
    }
});

// Y también para getNextReservaIdAndPopulate, ya que también hace una llamada
async function getNextReservaIdAndPopulate() {
    const response = await callAppsScript('getNextReservaId');
    if (response.success) {
        nReservaInput.value = response.nextId;
    } else {
        nReservaInput.value = 'Error';
        console.error('No se pudo obtener el siguiente ID de reserva:', response.message);
    }
}

// Listener para el tipo de pago (Total/Parcial)
tipoPagoSelect.addEventListener('change', () => {
    const montoTotalFinal = parseFloat(montoTotalFinalInput.value) || 0;
    const montoPagadoPreRESERVA = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
    if (tipoPagoSelect.value === 'Total') {
        montoPagadoInput.value = montoTotalFinal.toFixed(2);
        montoPagadoInput.setAttribute('readonly', true); 
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
    } else {
        montoPagadoInput.removeAttribute('readonly'); 
        montoPagadoInput.style.backgroundColor = '#fcfcfc'; 
    }
    calculateRestaPagar(); 
});

// Listener para el Monto Pagado (para recalcular la resta a pagar)
montoPagadoInput.addEventListener('input', calculateRestaPagar);
// Listener para los montos totales (para recalcular la resta a pagar)
montoTotalAlquilerInput.addEventListener('input', calculateTotals); 
montoTotalClasesInput.addEventListener('input', calculateTotals);
descuentoInput.addEventListener('input', calculateTotals);
if (montoPagadoPreRESERVAInput) {
    montoPagadoPreRESERVAInput.addEventListener('input', calculateRestaPagar);
}


// Esta función ahora debe sumar el MONTO_PAGADO_PRE_RESERVA al MONTO_PAGADO actual.
function calculateRestaPagar() {
    const montoTotalFinal = parseFloat(montoTotalFinalInput.value) || 0;
    const montoPagadoActual = parseFloat(montoPagadoInput.value) || 0;
    // **AQUÍ SE AGREGA/MODIFICA:** Obtener el valor del monto pagado en pre-reserva
    const montoPagadoPreReserva = parseFloat(montoPagadoPreRESERVAInput.value) || 0; 
    
    // Suma ambos montos para el total ya pagado
    const totalPagado = montoPagadoActual + montoPagadoPreReserva; 
    
    const resta = montoTotalFinal - totalPagado;
    restaPagarInput.value = resta.toFixed(2);
}