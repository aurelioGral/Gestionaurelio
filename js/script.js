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
const tipoDeMonedaSelect = document.getElementById('tipoDeMonedaSelect');
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

const tipoDeCambioGroup = document.getElementById('tipoDeCambioGroup');
const tipoDeCambioInput = document.getElementById('tipoDeCambio');
let loadingOverlay = document.getElementById('loadingOverlay'); // ¡Añade esta línea!

const preReservaDateSelect = document.getElementById('preReservaDateSelect');
const preReservasTableContainer = document.getElementById('preReservasTableContainer');

// NUEVO: Referencia al input oculto de ESTADO de la pre-reserva
const estadoPreReservaHidden = document.getElementById('estadoPreReservaHidden');
const montoPagoHechoInput = document.getElementById('montoPagoHecho');
const pagoHechoGroup = document.getElementById('pagoHechoGroup'); // El contenedor del nuevo input

// --- Elementos del DOM para el Contador de Días ---
    const reservaDiasContadorInput = document.getElementById('reservaDiasContador');
    const paxNumeroDiasInput = document.getElementById('paxNumeroDias');
    const btnSumarDiaPax = document.getElementById('btnSumarDiaPax');
    const sumarDiaATodosPaxCheckbox = document.getElementById('sumarDiaATodosPax');
    const btnSumarDiaTodos = document.getElementById('btnSumarDiaTodos');
    const dayCounterMessage = document.getElementById('dayCounterMessage');



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

function showLoadingOverlay(show) {
        if (loadingOverlay) {
           
            if (show) {
                loadingOverlay.classList.add('show');
                loadingOverlay.style.display = 'flex'; // 🔒 fuerza ocultamiento
                
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.visibility = 'visible';
    loadingOverlay.style.pointerEvents = 'all';
    loadingOverlay.style.zIndex = '9999';           // Lo traemos al frente
    


            } else {
                loadingOverlay.classList.remove('show');
                 // 🔁 Forzar invisibilidad en todas capas
    loadingOverlay.style.display = 'none';
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.visibility = 'hidden';
    loadingOverlay.style.pointerEvents = 'none';

   // NUEVO: Forzar un reflow/repaint del navegador para "despertarlo"
            loadingOverlay.offsetHeight; // Esto es clave con la pista de F12

            loadingOverlay.style.display = 'none'; 

            setTimeout(() => {
                nombreCompletoInput.focus();
            }, 200);
            }
        } else {
          
        }
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
    showLoadingOverlay(true); // <--- Mostrar el loading antes de la llamada
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
        showLoadingOverlay(false); // <--- Ocultar el loading SIEMPRE al finalizar (éxito o error)
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
                <input type="number" id="monto_alquiler_pax${i}" min="0" value="">
            </div>
            <div class="form-group">
                <label for="monto_clase_pax${i}">Valor Clase:</label>
                <input type="number" id="monto_clase_pax${i}" min="0" value="">
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


 // --- Funciones para el Contador de Días ---

    /**
     * Muestra un mensaje en la sección del contador de días.
     * @param {string} message - El mensaje a mostrar.
     * @param {boolean} isSuccess - True si es un mensaje de éxito, false para error.
     */
    function showDayCounterMessage(message, isSuccess) {
        dayCounterMessage.textContent = message;
        dayCounterMessage.className = `message-display ${isSuccess ? 'success' : 'error'}`;
        setTimeout(() => {
            dayCounterMessage.textContent = '';
            dayCounterMessage.className = 'message-display';
        }, 5000); // El mensaje desaparece después de 5 segundos
    }

    /**
     * Envía la solicitud al backend para actualizar los días cumplidos.
     * @param {string} reservaId - El ID de la reserva.
     * @param {number | null} paxNumber - El número de pax específico (1-15) o null si es para todos.
     */
    async function updateDiasCumplidos(reservaId, paxNumber = null) {
        if (!reservaId) {
            showDayCounterMessage('Por favor, ingrese un número de reserva.', false);
            return;
        }

        
        dayCounterMessage.textContent = ''; // Limpiar mensaje anterior

        try {
            const payload = {
                reservaId: reservaId,
                paxNumber: paxNumber // Será un número (1-15) o null
            };

            const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ action: 'updateDiasCumplidos', payload: payload }),
            });

            const data = await response.json();

            if (data.success) {
                showDayCounterMessage(data.message, true);
                // Opcional: limpiar inputs después de éxito
                reservaDiasContadorInput.value = '';
                paxNumeroDiasInput.value = '';
                sumarDiaATodosPaxCheckbox.checked = false;
            } else {
                showDayCounterMessage(data.message || 'Error al actualizar días cumplidos.', false);
            }
        } catch (error) {
            console.error('Error al enviar datos de días cumplidos:', error);
            showDayCounterMessage('Error de conexión al actualizar días cumplidos. Intente de nuevo.', false);
        } finally {
            
        }
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
        TEL_MAIL: telMailInput.value, // Corregido: Coincide con el encabezado de la hoja
        VENDEDOR: vendedorSelect.value,
        OBSERVACIONES: observacionesTextarea.value,
        MONTO_TOTAL_ALQUILER: parseFloat(montoTotalAlquilerInput.value) || 0,
        MONTO_TOTAL_CLASES: parseFloat(montoTotalClasesInput.value) || 0,
        DESCUENTO: parseFloat(descuentoInput.value) || 0,
        MONTO_TOTAL_FINAL: parseFloat(montoTotalFinalInput.value) || 0,
        ID_PRE_RESERVA: inputPreReservaId.value || '',
        ESTADO: estadoPreReservaHidden.value || '' // Estado de la pre-reserva cargada
    };

    // Recopilar datos de pasajeros. Se mantiene la estructura original de tu código
    // utilizando IDs dinámicos para cada pasajero y cada campo.
    document.querySelectorAll('.pasajero-row').forEach((row, index) => {
        const paxNum = index + 1;
        // Se utiliza el operador ?. (optional chaining) y || '' o || 0
        // para manejar casos donde el elemento o su valor puedan no existir.
        formData[`TABLAS_PAX${paxNum}`] = row.querySelector(`#tablas_pax${paxNum}`)?.value || '';
        formData[`BOTAS_PAX${paxNum}`] = row.querySelector(`#botas_pax${paxNum}`)?.value || '';
        formData[`ROPA_PAX${paxNum}`] = row.querySelector(`#ropa_pax${paxNum}`)?.value || '';
        formData[`CASCO_Y_ANTIPARRAS_PAX${paxNum}`] = row.querySelector(`#casco_y_antiparras_pax${paxNum}`)?.value || '';
        formData[`CLASES_PAX${paxNum}`] = row.querySelector(`#clases_pax${paxNum}`)?.value || '';
        formData[`MONTO_ALQUILER_PAX${paxNum}`] = parseFloat(row.querySelector(`#monto_alquiler_pax${paxNum}`)?.value) || 0;
        formData[`MONTO_CLASE_PAX${paxNum}`] = parseFloat(row.querySelector(`#monto_clase_pax${paxNum}`)?.value) || 0;
    });

    // Lógica para determinar el valor final de 'MONTO_PAGADO' que se enviará a la hoja 'DatosRESERVA'.
    // Este cálculo es crucial para que los pagos se sumen correctamente.
    let montoPagadoParaGuardar = 0;
    const currentMontoPagadoPreReserva = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
    const montoPagadoMostradoEnInput = parseFloat(montoPagadoInput.value) || 0; // Lo que se muestra en el input "Monto Pagado"
    const montoAdicionalHecho = parseFloat(montoPagoHechoInput.value) || 0; // El valor del nuevo input "Pago Adicional Hecho"

    if (pagoHechoGroup.style.display === 'block') {
        // Escenario: Se está actualizando una reserva definitiva con pago parcial y se realiza un "pago hecho" adicional.
        const montoPagadoExistenteOriginal = montoPagadoMostradoEnInput - currentMontoPagadoPreReserva;
        montoPagadoParaGuardar = montoPagadoExistenteOriginal + montoAdicionalHecho;
    } else if (tipoPagoSelect.value === 'Total') {
        // Escenario: El tipo de pago se ha establecido en 'Total'.
        montoPagadoParaGuardar = (parseFloat(montoTotalFinalInput.value) || 0) - currentMontoPagadoPreReserva;
    } else {
        // Escenario: Nueva reserva parcial, o edición manual de 'Monto Pagado'
        montoPagadoParaGuardar = montoPagadoMostradoEnInput - currentMontoPagadoPreReserva;
        if (montoPagadoParaGuardar < 0) montoPagadoParaGuardar = 0;
    }

    // --- INICIO DE NUEVA LÓGICA PARA MANEJO DE MONEDAS, TIPO_DE_CAMBIO Y CONVERSION_A_PESOS ---
    const tipoDeMoneda = tipoDeMonedaSelect.value;
    formData.TIPO_DE_MONEDA = tipoDeMoneda; // Siempre se guarda el tipo de moneda seleccionado

    let tipoDeCambioValor = ''; // Inicializar para la columna TIPO_DE_CAMBIO
    let conversionAPesos = '';  // Inicializar para la columna CONVERSION_A_PESOS

    if (tipoDeMoneda === 'dolar usa' || tipoDeMoneda === 'real brl') {
        // Solo procesar si la moneda es DÓLAR o REAL
        tipoDeCambioValor = parseFloat(tipoDeCambioInput.value) || 0; // Obtener el valor del input

        // Realizar el cálculo de CONVERSION_A_PESOS
        if (tipoDeCambioValor > 0 && formData.MONTO_TOTAL_FINAL > 0) {
            conversionAPesos = (formData.MONTO_TOTAL_FINAL * tipoDeCambioValor).toFixed(2);
        } else {
            // Si el tipo de cambio no es válido o el monto final no es válido, la conversión es 0.00
            conversionAPesos = '0.00';
        }
    }
    // Si tipoDeMoneda no es 'DOLAR' ni 'REAL', tipoDeCambioValor y conversionAPesos permanecerán como strings vacíos

    // Añadir los nuevos campos al objeto formData
    formData.TIPO_DE_CAMBIO = tipoDeCambioValor;
    formData.CONVERSION_A_PESOS = conversionAPesos;
    // --- FIN DE NUEVA LÓGICA ---

    // Determinar el valor de PAGO_PARCIAL basado en el TIPO_DE_PAGO
    const pagoParcialValue = (tipoPagoSelect.value === 'Parcial') ? montoPagadoMostradoEnInput : 0;

    switch (tipoDeMoneda) {
        case 'pesos arg': // Ajustado de 'pesos arg' para coincidir con tu HTML
            formData.METODO_DE_PAGO = metodoPagoSelect.value;
            formData.PAGO_PARCIAL = pagoParcialValue;
            formData.RESTA_PAGAR = parseFloat(restaPagarInput.value) || 0;
            formData.TIPO_DE_PAGO = tipoPagoSelect.value;
            formData.MONTO_PAGADO = montoPagadoParaGuardar;
            formData.MONTO_PAGADO_PRE_RESERVA = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
            formData.PAGO_HECHO = parseFloat(montoPagoHechoInput.value) || 0;
            // Para asegurar que no se envíen datos residuales de otras monedas
            delete formData.METODO_DE_PAGO_REAL;
            delete formData.PAGO_PARCIAL_REAL;
            delete formData.RESTA_PAGAR_REAL;
            delete formData.TIPO_DE_PAGO_REAL;
            delete formData.MONTO_PAGADO_REAL;
            delete formData.MONTO_PAGADO_PRE_RESERVA_REAL;
            delete formData.PAGO_HECHO_REAL;
            delete formData.METODO_DE_PAGO_DOLAR;
            delete formData.PAGO_PARCIAL_DOLAR;
            delete formData.RESTA_PAGAR_DOLAR;
            delete formData.TIPO_DE_PAGO_DOLAR;
            delete formData.MONTO_PAGADO_DOLAR;
            delete formData.MONTO_PAGADO_PRE_RESERVA_DOLAR;
            delete formData.PAGO_HECHO_DOLAR;
            break;
        case 'real brl': // Ajustado de 'real brl'
            formData.METODO_DE_PAGO_REAL = metodoPagoSelect.value;
            formData.PAGO_PARCIAL_REAL = pagoParcialValue;
            formData.RESTA_PAGAR_REAL = parseFloat(restaPagarInput.value) || 0;
            formData.TIPO_DE_PAGO_REAL = tipoPagoSelect.value;
            formData.MONTO_PAGADO_REAL = montoPagadoParaGuardar;
            formData.MONTO_PAGADO_PRE_RESERVA_REAL = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
            formData.PAGO_HECHO_REAL = parseFloat(montoPagoHechoInput.value) || 0;
            // Limpiar campos de otras monedas
            delete formData.METODO_DE_PAGO;
            delete formData.PAGO_PARCIAL;
            delete formData.RESTA_PAGAR;
            delete formData.TIPO_DE_PAGO;
            delete formData.MONTO_PAGADO;
            delete formData.MONTO_PAGADO_PRE_RESERVA;
            delete formData.PAGO_HECHO;
            delete formData.METODO_DE_PAGO_DOLAR;
            delete formData.PAGO_PARCIAL_DOLAR;
            delete formData.RESTA_PAGAR_DOLAR;
            delete formData.TIPO_DE_PAGO_DOLAR;
            delete formData.MONTO_PAGADO_DOLAR;
            delete formData.MONTO_PAGADO_PRE_RESERVA_DOLAR;
            delete formData.PAGO_HECHO_DOLAR;
            break;
        case 'dolar usa': // Ajustado de 'dolar usa'
            formData.METODO_DE_PAGO_DOLAR = metodoPagoSelect.value;
            formData.PAGO_PARCIAL_DOLAR = pagoParcialValue;
            formData.RESTA_PAGAR_DOLAR = parseFloat(restaPagarInput.value) || 0;
            formData.TIPO_DE_PAGO_DOLAR = tipoPagoSelect.value;
            formData.MONTO_PAGADO_DOLAR = montoPagadoParaGuardar;
            formData.MONTO_PAGADO_PRE_RESERVA_DOLAR = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
            formData.PAGO_HECHO_DOLAR = parseFloat(montoPagoHechoInput.value) || 0;
            // Limpiar campos de otras monedas
            delete formData.METODO_DE_PAGO;
            delete formData.PAGO_PARCIAL;
            delete formData.RESTA_PAGAR;
            delete formData.TIPO_DE_PAGO;
            delete formData.MONTO_PAGADO;
            delete formData.MONTO_PAGADO_PRE_RESERVA;
            delete formData.PAGO_HECHO;
            delete formData.METODO_DE_PAGO_REAL;
            delete formData.PAGO_PARCIAL_REAL;
            delete formData.RESTA_PAGAR_REAL;
            delete formData.TIPO_DE_PAGO_REAL;
            delete formData.MONTO_PAGADO_REAL;
            delete formData.MONTO_PAGADO_PRE_RESERVA_REAL;
            delete formData.PAGO_HECHO_REAL;
            break;
        default: // Fallback por si acaso, guarda en las columnas de pesos
            formData.METODO_DE_PAGO = metodoPagoSelect.value;
            formData.PAGO_PARCIAL = pagoParcialValue;
            formData.RESTA_PAGAR = parseFloat(restaPagarInput.value) || 0;
            formData.TIPO_DE_PAGO = tipoPagoSelect.value;
            formData.MONTO_PAGADO = montoPagadoParaGuardar;
            formData.MONTO_PAGADO_PRE_RESERVA = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
            formData.PAGO_HECHO = parseFloat(montoPagoHechoInput.value) || 0;
            // Asegurarse de que campos de otras monedas no se envíen
            delete formData.METODO_DE_PAGO_REAL;
            delete formData.PAGO_PARCIAL_REAL;
            delete formData.RESTA_PAGAR_REAL;
            delete formData.TIPO_DE_PAGO_REAL;
            delete formData.MONTO_PAGADO_REAL;
            delete formData.MONTO_PAGADO_PRE_RESERVA_REAL;
            delete formData.PAGO_HECHO_REAL;
            delete formData.METODO_DE_PAGO_DOLAR;
            delete formData.PAGO_PARCIAL_DOLAR;
            delete formData.RESTA_PAGAR_DOLAR;
            delete formData.TIPO_DE_PAGO_DOLAR;
            delete formData.MONTO_PAGADO_DOLAR;
            delete formData.MONTO_PAGADO_PRE_RESERVA_DOLAR;
            delete formData.PAGO_HECHO_DOLAR;
            break;
    }

    // Este campo es independiente de la moneda, se mantiene aquí
    formData.SI_PAGO_TOTAL = (tipoPagoSelect.value === 'Total');

    return formData;
}

/**
 * Rellena el formulario con los datos de una reserva.
 * @param {Object} data - Objeto con los datos de la reserva.
 */
// --- Función fillForm(data) ---
function fillForm(data) {
    // Limpiar el formulario primero para asegurar un estado consistente
    fechaInput.value = '';
    cantidadDiasAlquilerInput.value = '';
    vendedorSelect.value = '';
    reservaPasajerosInput.value = '1'; // Resetear a 1 pasajero por defecto
    nombreCompletoInput.value = '';
    telMailInput.value = '';
    observacionesTextarea.value = '';
    montoTotalAlquilerInput.value = '';
    montoTotalClasesInput.value = '';
    descuentoInput.value = '0';
    montoTotalFinalInput.value = '';
    metodoPagoSelect.value = '';
    montoPagadoInput.value = '';
    montoPagadoPreRESERVAInput.value = '';
    restaPagarInput.value = '';
    montoPagoHechoInput.value = '';
    pagoHechoGroup.style.display = 'none';
    montoPagadoInput.removeAttribute('readonly');
    montoPagadoInput.style.backgroundColor = '#fcfcfc';
    if (tipoPagoSelect) tipoPagoSelect.value = '';
    if (montoPagadoInput) { montoPagadoInput.value = '0'; montoPagadoInput.removeAttribute('readonly'); montoPagadoInput.style.backgroundColor = '#fcfcfc'; }
    if (montoPagadoPreRESERVAInput) { montoPagadoPreRESERVAInput.value = '0'; montoPagadoPreRESERVAInput.removeAttribute('readonly'); montoPagadoPreRESERVAInput.style.backgroundColor = '#fcfcfc'; }
    if (estadoPreReservaHidden) { estadoPreReservaHidden.value = ''; }
    inputPreReservaId.value = '';
    inputBuscarReserva.value = '';
    generatePasajeroRows(1);

    // Determinar si se está cargando una pre-reserva o una reserva definitiva
    const isPreReservaLoad = data.hasOwnProperty('ID_PRE_RESERVA') && (!data.hasOwnProperty('NRESERVA') || !data.NRESERVA);
    const isDefinitiveReservaLoad = data.hasOwnProperty('NRESERVA') && data.NRESERVA;

    // --- Llenar campos comunes ---
    fechaInput.value = data.FECHA || '';
    nReservaInput.value = data.NRESERVA || '';
    cantidadDiasAlquilerInput.value = data.DIAS || '';
    vendedorSelect.value = data.VENDEDOR || '';
    nombreCompletoInput.value = data.NOMBRE_COMPLETO || '';
    telMailInput.value = data.TEL_MAIL || ''; // CORREGIDO: Usar TEL_MAIL de la hoja
    observacionesTextarea.value = data.OBSERVACIONES || '';
    
    // Pasajeros: Primero generar las filas de inputs vacías
    reservaPasajerosInput.value = data.CANTIDAD_PASAJEROS || 1;
    generatePasajeroRows(parseInt(reservaPasajerosInput.value)); // Generar las filas de pasajeros necesarias

    // Luego, rellenar los datos de cada pasajero si vienen en el objeto 'data' (desde la hoja de cálculo)
    // Esto es crucial si el backend devuelve un objeto plano y no un array 'PASAJEROS'
    for (let i = 1; i <= parseInt(data.CANTIDAD_PASAJEROS || 0); i++) {
        const tablasPaxElement = document.getElementById(`tablas_pax${i}`);
        if (tablasPaxElement) {
            tablasPaxElement.value = data[`TABLAS_PAX${i}`] || '';
        }
        const botasPaxElement = document.getElementById(`botas_pax${i}`);
        if (botasPaxElement) {
            botasPaxElement.value = data[`BOTAS_PAX${i}`] || '';
        }
        const ropaPaxElement = document.getElementById(`ropa_pax${i}`);
        if (ropaPaxElement) {
            ropaPaxElement.value = data[`ROPA_PAX${i}`] || '';
        }
        const cascoAntiparrasPaxElement = document.getElementById(`casco_y_antiparras_pax${i}`);
        if (cascoAntiparrasPaxElement) {
            cascoAntiparrasPaxElement.value = data[`CASCO_Y_ANTIPARRAS_PAX${i}`] || '';
        }
        const clasesPaxElement = document.getElementById(`clases_pax${i}`);
        if (clasesPaxElement) {
            clasesPaxElement.value = data[`CLASES_PAX${i}`] || '';
        }
        const montoAlquilerPaxElement = document.getElementById(`monto_alquiler_pax${i}`);
        if (montoAlquilerPaxElement) {
            montoAlquilerPaxElement.value = (parseFloat(data[`MONTO_ALQUILER_PAX${i}`]) || 0).toFixed(2);
        }
        const montoClasePaxElement = document.getElementById(`monto_clase_pax${i}`);
        if (montoClasePaxElement) {
            montoClasePaxElement.value = (parseFloat(data[`MONTO_CLASE_PAX${i}`]) || 0).toFixed(2);
        }
    }
    // Fin de la lógica de relleno de pasajeros

    // --- Llenar campos de totales y pago ---
    montoTotalAlquilerInput.value = (parseFloat(data.MONTO_TOTAL_ALQUILER) || 0).toFixed(2);
    montoTotalClasesInput.value = (parseFloat(data.MONTO_TOTAL_CLASES) || 0).toFixed(2);
    descuentoInput.value = (parseFloat(data.DESCUENTO) || 0).toFixed(2);
    montoTotalFinalInput.value = (parseFloat(data.MONTO_TOTAL_FINAL) || 0).toFixed(2);

    // NUEVO: Cargar el TIPO_DE_MONEDA si existe en los datos
    tipoDeMonedaSelect.value = data.TIPO_DE_MONEDA || 'pesos arg'; // Asignar el valor cargado o el predeterminado

    // CAMBIO: Cargar el método y tipo de pago priorizando la moneda específica
    metodoPagoSelect.value = data.METODO_DE_PAGO || data.METODO_DE_PAGO_REAL || data.METODO_DE_PAGO_DOLAR || '';
    tipoPagoSelect.value = data.TIPO_DE_PAGO || data.TIPO_DE_PAGO_REAL || data.TIPO_DE_PAGO_DOLAR || 'Parcial'; 
    
    // CAMBIO: Cargar los montos de pago priorizando la moneda específica
    // 1. Siempre se carga el MONTO_PAGADO_PRE_RESERVA si existe en los datos
    montoPagadoPreRESERVAInput.value = (parseFloat(data.MONTO_PAGADO_PRE_RESERVA) || parseFloat(data.MONTO_PAGADO_PRE_RESERVA_REAL) || parseFloat(data.MONTO_PAGADO_PRE_RESERVA_DOLAR) || 0).toFixed(2);

    // 2. Lógica para 'Monto Pagado' y 'Pago Adicional Hecho'
    pagoHechoGroup.style.display = 'none'; // Ocultar por defecto
    montoPagoHechoInput.value = ''; // Resetear el input de pago adicional

    if (isPreReservaLoad) {
        // Si se carga una Pre-reserva para conversión:
        // 'montoPagadoInput' se usa para el nuevo pago de la reserva definitiva
        montoPagadoInput.value = ''; 
        montoPagadoInput.removeAttribute('readonly');
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    } else if (isDefinitiveReservaLoad) {
        // Si se carga una Reserva Definitiva existente para actualizar:
        // CAMBIO: Priorizar MONTO_PAGADO de la moneda específica
        const currentMontoPagado = parseFloat(data.MONTO_PAGADO) || parseFloat(data.MONTO_PAGADO_REAL) || parseFloat(data.MONTO_PAGADO_DOLAR) || 0;
        // CAMBIO: Priorizar MONTO_PAGADO_PRE_RESERVA de la moneda específica
        const currentMontoPagadoPreReserva = parseFloat(data.MONTO_PAGADO_PRE_RESERVA) || parseFloat(data.MONTO_PAGADO_PRE_RESERVA_REAL) || parseFloat(data.MONTO_PAGADO_PRE_RESERVA_DOLAR) || 0;
        
        // 'montoPagadoInput' muestra la suma de todos los pagos ANTERIORES
        montoPagadoInput.value = (currentMontoPagado + currentMontoPagadoPreReserva).toFixed(2);
        
        // 'montoPagadoInput' se vuelve de solo lectura
        montoPagadoInput.setAttribute('readonly', true); 
        montoPagadoInput.style.backgroundColor = '#f0f0f0';

        // CAMBIO: Priorizar RESTA_PAGAR y PAGO_HECHO de la moneda específica
        restaPagarInput.value = (parseFloat(data.RESTA_PAGAR) || parseFloat(data.RESTA_PAGAR_REAL) || parseFloat(data.RESTA_PAGAR_DOLAR) || 0).toFixed(2);
        montoPagoHechoInput.value = (parseFloat(data.PAGO_HECHO) || parseFloat(data.PAGO_HECHO_REAL) || parseFloat(data.PAGO_HECHO_DOLAR) || 0).toFixed(2);

        // Setear el campo oculto para el estado de la pre-reserva
        if (estadoPreReservaHidden) {
            estadoPreReservaHidden.value = data.ESTADO; 
        }
    } else {
        // Estado por defecto para un formulario nuevo y vacío
        montoPagadoInput.value = '';
        montoPagadoInput.removeAttribute('readonly');
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }
    
    setTimeout(() => {
  nombreCompletoInput.blur();
  nombreCompletoInput.focus();
  nombreCompletoInput.style.pointerEvents = 'auto';
  nombreCompletoInput.style.opacity = '1';
}, 50);
    // Recalcular totales y luego la resta a pagar para asegurar consistencia
    calculateTotals(); 

    // Después del cálculo inicial, verificar si 'pagoHechoGroup' debe ser visible
    const currentRestaPagar = parseFloat(restaPagarInput.value) || 0;
    // Asumimos SI_PAGO_TOTAL es booleano o string 'TRUE'/'FALSE'
    const loadedPagoTotal = (data.SI_PAGO_TOTAL === true || String(data.SI_PAGO_TOTAL).toUpperCase() === 'TRUE' || String(data.SI_PAGO_TOTAL).toUpperCase() === 'SI');
    
    // Mostrar 'pagoHechoGroup' solo si es una reserva definitiva, no está pagada totalmente y hay resta a pagar
    if (isDefinitiveReservaLoad && !loadedPagoTotal && currentRestaPagar > 0) {
        pagoHechoGroup.style.display = 'block';
        // 'montoPagadoInput' ya está readonly si se cargó una reserva definitiva, esto lo refuerza
        montoPagadoInput.setAttribute('readonly', true); 
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
    } else {
        pagoHechoGroup.style.display = 'none';
        montoPagoHechoInput.value = ''; // Asegurarse de que esté limpio si se oculta
    }

    // Aplicar lógica de 'Tipo de Pago' después de todos los cálculos y ajustes de visibilidad.
    // Esto puede sobrescribir el estado de solo lectura de 'montoPagadoInput' si el 'Tipo de Pago' es 'Parcial'
    // Y el 'pagoHechoGroup' no está visible.
    if (tipoPagoSelect.value === 'Total') {
        montoPagadoInput.value = restaPagarInput.value; // Establecer al valor calculado de "resta a pagar"
        montoPagadoInput.setAttribute('readonly', true);
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
        pagoHechoGroup.style.display = 'none'; // Si es pago total, no se necesita input adicional
        montoPagoHechoInput.value = ''; // Limpiar el input adicional
    } else if (pagoHechoGroup.style.display === 'none') {
        // Solo hacer montoPagadoInput editable si es 'Parcial' Y 'pagoHechoGroup' NO es visible
        montoPagadoInput.removeAttribute('readonly');
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }
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
    montoTotalAlquilerInput.value = ''; 
    montoTotalClasesInput.value = '';
    descuentoInput.value = '';
    montoTotalFinalInput.value = '';
    metodoPagoSelect.value = '';
tipoDeMonedaSelect.value = 'pesos arg'; // Asegurarse de que la moneda se resetee
    montoPagadoInput.value = '';
    montoPagadoPreRESERVAInput.value = '';
    restaPagarInput.value = '';
    
    // Limpiar y ocultar el nuevo input de pago adicional
    montoPagoHechoInput.value = '';
    pagoHechoGroup.style.display = 'none'; // Ocultar el grupo

     // Limpiar y ocultar el nuevo input de pago adicional
    tipoDeCambioInput.value = '';
   tipoDeCambioGroup.style.display = 'none'; // Ocultar el grupo
    
    // Asegurarse de que montoPagadoInput sea editable por defecto al limpiar
    montoPagadoInput.removeAttribute('readonly');
    montoPagadoInput.style.backgroundColor = '#fcfcfc';
    
    // Limpiar nuevos campos de pago
    if (tipoPagoSelect) tipoPagoSelect.value = ''; 
    if (montoPagadoInput) {
        montoPagadoInput.value = '';
        montoPagadoInput.removeAttribute('readonly'); 
        montoPagadoInput.style.backgroundColor = '#fcfcfc';
    }
     if (montoPagadoPreRESERVAInput) {
        montoPagadoPreRESERVAInput.value = '';
        montoPagadoPreRESERVAInput.removeAttribute('readonly'); 
        montoPagadoPreRESERVAInput.style.backgroundColor = '#fcfcfc';
    }
    // *** NUEVO: Limpiar el campo oculto de ESTADO ***
    if (estadoPreReservaHidden) {
        estadoPreReservaHidden.value = ''; 
    }

    restaPagarInput.value = '';
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

    // CAMBIO: Obtener el tipo de moneda y los valores de pago correspondientes
    const tipoDeMoneda = data.TIPO_DE_MONEDA || 'pesos arg'; // Asegurarse de tener un valor por defecto

    let montoPagado;
    let montoPagadoPreRESERVA;
    let restaPagar;
    let metodoDePago;
    let tipoDePago;
    let pagoHecho;

    switch (tipoDeMoneda) {
        case 'pesos arg':
            montoPagado = parseFloat(data.MONTO_PAGADO) || 0;
            montoPagadoPreRESERVA = parseFloat(data.MONTO_PAGADO_PRE_RESERVA) || 0;
            restaPagar = parseFloat(data.RESTA_PAGAR) || 0;
            metodoDePago = data.METODO_DE_PAGO || '-';
            tipoDePago = data.TIPO_DE_PAGO || '-';
            pagoHecho = parseFloat(data.PAGO_HECHO) || 0;
            break;
        case 'real brl':
            montoPagado = parseFloat(data.MONTO_PAGADO_REAL) || 0;
            montoPagadoPreRESERVA = parseFloat(data.MONTO_PAGADO_PRE_RESERVA_REAL) || 0;
            restaPagar = parseFloat(data.RESTA_PAGAR_REAL) || 0;
            metodoDePago = data.METODO_DE_PAGO_REAL || '-';
            tipoDePago = data.TIPO_DE_PAGO_REAL || '-';
            pagoHecho = parseFloat(data.PAGO_HECHO_REAL) || 0;
            break;
        case 'dolar usa':
            montoPagado = parseFloat(data.MONTO_PAGADO_DOLAR) || 0;
            montoPagadoPreRESERVA = parseFloat(data.MONTO_PAGADO_PRE_RESERVA_DOLAR) || 0;
            restaPagar = parseFloat(data.RESTA_PAGAR_DOLAR) || 0;
            metodoDePago = data.METODO_DE_PAGO_DOLAR || '-';
            tipoDePago = data.TIPO_DE_PAGO_DOLAR || '-';
            pagoHecho = parseFloat(data.PAGO_HECHO_DOLAR) || 0;
            break;
        default: // Fallback a pesos arg si el tipo de moneda no es reconocido
            montoPagado = parseFloat(data.MONTO_PAGADO) || 0;
            montoPagadoPreRESERVA = parseFloat(data.MONTO_PAGADO_PRE_RESERVA) || 0;
            restaPagar = parseFloat(data.RESTA_PAGAR) || 0;
            metodoDePago = data.METODO_DE_PAGO || '-';
            tipoDePago = data.TIPO_DE_PAGO || '-';
            pagoHecho = parseFloat(data.PAGO_HECHO) || 0;
            break;
    }

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
            <p class="flex-row"><span>Tipo de Moneda:</span> <span>${tipoDeMoneda.toUpperCase()}</span></p> <!-- NUEVO: Tipo de Moneda -->
            <p class="flex-row"><span>Método de Pago:</span> <span>${metodoDePago}</span></p>
            <p class="flex-row"><span>Tipo de Pago:</span> <span>${tipoDePago}</span></p>
            <p class="flex-row"><span>Monto Pagado:</span> <span>$${montoPagado.toFixed(2)}</span></p>
            <p class="flex-row"><span>Monto Pagado en Pre Reserva:</span> <span>$${montoPagadoPreRESERVA.toFixed(2)}</span></p>
            <p class="flex-row"><span>Pago Adicional Hecho:</span> <span>$${pagoHecho.toFixed(2)}</span></p> <!-- NUEVO: Pago Adicional -->
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
                    margin: 0mm; 
                    font-size: 14pt;

                }
                .ticket {
                    width: 72mm;
                    margin: 0 auto 15mm auto; 
                    border: 1px dashed #ccc;
                    padding: 5px;
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
                     body {
    width: 72mm; 
    margin: 0;
  }

  .ticket {
    border: none;
    padding: 5px;
    width: 100%;
    page-break-after: always;
  }
}

@media screen {
  body {
    background-color: #eee;
    display: flex;
    justify-content: center;
  }
  .ticket {
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
}





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

   
    if (loadingOverlay) {
    loadingOverlay.classList.remove('show');
    loadingOverlay.style.pointerEvents = 'none';
  }


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

    // Establecer el tipo de moneda por defecto si no hay una seleccionada
if (!tipoDeMonedaSelect.value) {
    tipoDeMonedaSelect.value = 'pesos arg';
}



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

    if (montoPagoHechoInput) { // Asegura que el elemento existe antes de añadir el listener
    montoPagoHechoInput.addEventListener('input', calculateRestaPagar);
}

    
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

// --- Lógica para TIPO_DE_CAMBIO ---
    // Función para controlar la visibilidad y estado del campo TIPO_DE_CAMBIO
    const toggleTipoDeCambio = () => {
        const selectedCurrency = tipoDeMonedaSelect.value;
       if (selectedCurrency === 'dolar usa' || selectedCurrency === 'real brl') { // Coincide con los 'value' de tu HTML
        tipoDeCambioGroup.style.display = 'block'; // Mostrar el grupo
        tipoDeCambioInput.removeAttribute('disabled'); // Habilitar el input
        tipoDeCambioInput.setAttribute('required', true); // Hacerlo requerido
        tipoDeCambioInput.focus(); // Opcional: poner el foco en el campo
    } else {
        tipoDeCambioGroup.style.display = 'none'; // Ocultar el grupo
        tipoDeCambioInput.setAttribute('disabled', true); // Deshabilitar el input
        tipoDeCambioInput.removeAttribute('required'); // Quitar el atributo requerido
        tipoDeCambioInput.value = ''; // Limpiar el valor cuando se oculta/deshabilita
    }
    };

    // Escuchar cambios en el selector de tipo de moneda
    tipoDeMonedaSelect.addEventListener('change', toggleTipoDeCambio);

    // Llamar una vez al cargar para establecer el estado inicial del campo TIPO_DE_CAMBIO
    toggleTipoDeCambio();


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
        // Forzar actualización de campos numéricos
const r = response.reserva;
document.getElementById("montoTotalFinal").value              = (r.MONTO_TOTAL_FINAL    || 0).toFixed(2);
document.getElementById("montoPagadoInput").value            = (r.MONTO_PAGADO         || 0).toFixed(2);
document.getElementById("montoPagadoPreRESERVAInput").value  = (r.MONTO_PAGADO_PRE_RESERVA || 0).toFixed(2);
document.getElementById("restaPagarInput").value             = (r.RESTA_PAGAR          || 0).toFixed(2);


        showMessage('Reserva cargada para edición.', 'success');
        // Cuando cargas una reserva definitiva, no es una pre-reserva, 
        // así que limpia el campo de PRE_RESERVA_ID y el estado oculto.
        inputPreReservaId.value = ''; 
        // Limpiar visualmente el campo "Pago Adicional Hecho"
document.getElementById('montoPagoHecho').value = '';


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
         setTimeout(() => {
                    location.reload(); // Esto recargará la página por completo
                }, 1500);
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


// --- Event Listeners para el Contador de Días ---

    btnSumarDiaPax.addEventListener('click', () => {
         
        const reservaId = reservaDiasContadorInput.value.trim();
        const paxNumber = parseInt(paxNumeroDiasInput.value, 10);

        if (isNaN(paxNumber) || paxNumber < 1 || paxNumber > 15) {
            showDayCounterMessage('Por favor, ingrese un número de Pax válido (1-15).', false);
            return;
        }
        updateDiasCumplidos(reservaId, paxNumber);
    });

    btnSumarDiaTodos.addEventListener('click', () => {
         
        const reservaId = reservaDiasContadorInput.value.trim();
        if (sumarDiaATodosPaxCheckbox.checked) {
            updateDiasCumplidos(reservaId, null); // null indica que es para todos los pax
        } else {
            showDayCounterMessage('Por favor, tilde el checkbox "Sumar Día a TODOS los Pax de la Reserva" para esta acción.', false);
        }
        
    });

    // Controlar el estado del botón "Sumar Día a Todos" basado en el checkbox
    sumarDiaATodosPaxCheckbox.addEventListener('change', () => {
        btnSumarDiaTodos.disabled = !sumarDiaATodosPaxCheckbox.checked;
    });
    // Inicialmente deshabilitar el botón si el checkbox no está marcado al cargar la página
    btnSumarDiaTodos.disabled = !sumarDiaATodosPaxCheckbox.checked;

// Listener para el tipo de pago (Total/Parcial)

tipoPagoSelect.addEventListener('change', calculateRestaPagar);

// Listener para el Monto Pagado (para recalcular la resta a pagar)
montoPagadoInput.addEventListener('input', calculateRestaPagar);
// Listener para los montos totales (para recalcular la resta a pagar)
montoTotalAlquilerInput.addEventListener('input', calculateTotals); 
montoTotalClasesInput.addEventListener('input', calculateTotals);
descuentoInput.addEventListener('input', calculateTotals);
if (montoPagadoPreRESERVAInput) {
    montoPagadoPreRESERVAInput.addEventListener('input', calculateRestaPagar);
}


// Esta función ahora considera el nuevo input 'montoPagoHechoInput'
function calculateRestaPagar() {
    const montoTotalFinal = parseFloat(montoTotalFinalInput.value) || "";
    const montoPagadoPreReserva = parseFloat(montoPagadoPreRESERVAInput.value) || 0;
    const montoPagadoActualDisplay = parseFloat(montoPagadoInput.value) || 0; // Valor que se muestra en montoPagadoInput (suma de pagos anteriores de la definitiva)
    const montoPagoHecho = parseFloat(montoPagoHechoInput.value) || 0; // Nuevo pago adicional (solo si pagoHechoGroup está visible)

    let totalPagadoAcumuladoHastaAhora = 0; // Monto total pagado antes de considerar el pago actual/nuevo
    let campoDePagoActual = null; // Referencia al input donde el usuario introducirá el monto del pago actual

    // Determinar el escenario: ¿Estamos haciendo un pago inicial/conversión o un pago subsiguiente?
    if (pagoHechoGroup.style.display === 'block') {
        // Escenario: Pagos subsiguientes a una reserva definitiva ya existente
        // montoPagadoActualDisplay contiene los pagos definitivos anteriores.
        // totalPagadoAcumuladoHastaAhora incluye el pago de prereserva + pagos definitivos anteriores.
        totalPagadoAcumuladoHastaAhora = montoPagadoPreReserva + montoPagadoActualDisplay;
        campoDePagoActual = montoPagoHechoInput; // El nuevo pago se ingresa aquí
        montoPagadoInput.setAttribute('readonly', true); // montoPagadoInput es de solo lectura en este escenario
        montoPagadoInput.style.backgroundColor = '#f0f0f0';
    } else {
        // Escenario: Conversión de prereserva o pago inicial de una nueva reserva definitiva
        // totalPagadoAcumuladoHastaAhora es solo el monto de la prereserva.
        totalPagadoAcumuladoHastaAhora = montoPagadoPreReserva;
        campoDePagoActual = montoPagadoInput; // El pago se ingresa en montoPagadoInput
        // La editabilidad de montoPagadoInput se maneja más abajo según tipoPagoSelect
    }

    // Calcular lo que resta pagar ANTES de considerar el pago actual que se está ingresando
    let restaPagarAntesNuevoPago = montoTotalFinal - totalPagadoAcumuladoHastaAhora;

    // Aplicar lógica según el "Tipo de Pago" seleccionado
    if (tipoPagoSelect.value === 'Total') {
        // Si se selecciona 'Total', el campo de pago actual se rellena con la 'restaPagarAntesNuevoPago'
        if (campoDePagoActual) {
            campoDePagoActual.value = Math.max(0, restaPagarAntesNuevoPago).toFixed(2); // Asegurar que no sea negativo
            campoDePagoActual.setAttribute('readonly', true); // Bloquear el campo después de rellenarlo
            campoDePagoActual.style.backgroundColor = '#f0f0f0';
        }
    } else if (tipoPagoSelect.value === 'Parcial') {
        // Si se selecciona 'Parcial', el campo de pago actual se vuelve editable
        if (campoDePagoActual) {
            campoDePagoActual.removeAttribute('readonly');
            campoDePagoActual.style.backgroundColor = '#fcfcfc';
        }
    } else {
        // Si no se selecciona tipo de pago o es otro valor, el campo es editable por defecto (para el pago inicial)
        if (campoDePagoActual) {
            campoDePagoActual.removeAttribute('readonly');
            campoDePagoActual.style.backgroundColor = '#fcfcfc';
        }
    }

    // Calcular el monto total pagado final (sumando el pago de prereserva + pagos definitivos anteriores + el pago actual)
    let montoDelPagoActual = parseFloat(campoDePagoActual ? campoDePagoActual.value : 0) || 0;
    let totalPagadoAcumuladoFinal = totalPagadoAcumuladoHastaAhora + montoDelPagoActual;

    // Finalmente, calcular y mostrar la resta a pagar
    restaPagarInput.value = (montoTotalFinal - totalPagadoAcumuladoFinal).toFixed(2);

    
}