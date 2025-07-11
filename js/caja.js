// caja.js

// ¡IMPORTANTE! Reemplaza esta URL con la URL de tu Web App de Google Apps Script.
// La encuentras en tu proyecto de Apps Script: "Implementar" -> "Gestionar implementaciones" -> URL de la app web.
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec';

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const fechaCajaSelect = document.getElementById('fechaCajaSelect');
    const cashRegisterDashboard = document.getElementById('cashRegisterDashboard');
    const ingresoExtraInput = document.getElementById('ingresoExtraInput');
    const gasto1Input = document.getElementById('gasto1Input');
    const gasto2Input = document.getElementById('gasto2Input');
    const gasto3Input = document.getElementById('gasto3Input');
    const gasto4Input = document.getElementById('gasto4Input');
    const gasto5Input = document.getElementById('gasto5Input');
    const gastoInputs = [gasto1Input, gasto2Input, gasto3Input, gasto4Input, gasto5Input];

    const totalFinalCajaDisplay = document.getElementById('totalFinalCaja'); // El display original, ahora para el Total Caja Final ARS
    const totalFinalCajaARSElement = document.getElementById('totalFinalCajaARS'); // Elemento específico para ARS
    const totalFinalCajaBRLElement = document.getElementById('totalFinalCajaBRL'); // Elemento específico para BRL
    const totalFinalCajaDOLARElement = document.getElementById('totalFinalCajaDOLAR'); // Elemento específico para DOLAR
    const totalGastosARSElement = document.getElementById('totalGastosARS'); // Elemento para mostrar el total de gastos ARS

    const closeCashRegisterButton = document.getElementById('closeCashRegisterButton');
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = messageModal ? messageModal.querySelector('.close-button') : null;
    const loadingOverlay = document.getElementById('loadingOverlay');

    let currentSalesData = null; // Almacena los datos de ventas de la fecha seleccionada, accesible en todo este scope

    // --- Funciones de Utilidad ---

    function showLoadingOverlay() {
        if (loadingOverlay) loadingOverlay.classList.add('show');
    }

    function hideLoadingOverlay() {
        if (loadingOverlay) loadingOverlay.classList.remove('show');
    }

    function showMessageModal(message) {
        if (modalMessage) modalMessage.textContent = message;
        if (messageModal) messageModal.style.display = 'block';
    }

    function hideMessageModal() {
        if (messageModal) messageModal.style.display = 'none';
    }

    /**
     * Formatea un monto numérico a formato de moneda local.
     * @param {number} amount - El monto a formatear.
     * @param {string} currencyCode - El código de la moneda ('ARS', 'BRL', 'DOLAR').
     * @returns {string} El monto formateado como cadena de texto.
     */
    function formatCurrency(amount, currencyCode = 'ARS') {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }

        let locale = 'es-AR';
        let symbol = '$';

        switch (currencyCode) {
            case 'ARS':
                locale = 'es-AR';
                symbol = '$';
                break;
            case 'BRL':
                locale = 'pt-BR';
                symbol = 'R$';
                break;
            case 'DOLAR':
                locale = 'en-US';
                symbol = 'U$D';
                break;
            default:
                locale = 'es-AR';
                symbol = '$';
        }

        try {
            const formatter = new Intl.NumberFormat(locale, {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            return `${symbol} ${formatter.format(amount)}`;
        } catch (e) {
            console.error("Error formatting currency:", e);
            return `${symbol} ${amount.toFixed(2)}`; // Fallback si hay un error
        }
    }

    // --- Funciones de Cálculo ---

    /**
     * Calcula los totales finales de caja (ARS, BRL efectivo, DOLAR efectivo)
     * basándose en el resumen de ventas y los inputs de ingresos/gastos del DOM.
     * @param {Object} salesSummary - Objeto con el resumen de ventas por moneda.
     * @returns {Object} Un objeto con totalCajaFinalARS, totalEfectivoBRL, totalEfectivoDOLAR, y totalGastosARS.
     */
    function calculateTotalFinalCaja(salesSummary) {
        let totalCajaFinalARS = 0;
        let totalEfectivoBRL = 0;
        let totalEfectivoDOLAR = 0;

        // Calcular el Total Caja Final ARS (incluye efectivo, tarjeta crédito/débito, transferencia de ARS)
        if (salesSummary && salesSummary.PESOS_ARG) {
            const arsData = salesSummary.PESOS_ARG;
            totalCajaFinalARS += arsData.TotalEfectivo + arsData.TotalTarjetaCredito + arsData.TotalTarjetaDebito + arsData.TotalTransferencia;
        }

        // Obtener ingresos extra y gastos (estos siempre se asumen en ARS)
        const ingresoExtra = parseFloat(ingresoExtraInput.value) || 0;
        let totalGastos = 0;
        gastoInputs.forEach(input => {
            totalGastos += parseFloat(input.value) || 0;
        });

        totalCajaFinalARS += ingresoExtra;
        totalCajaFinalARS -= totalGastos;

        // Obtener el Total Efectivo para BRL y DOLAR directamente de los datos del resumen
        if (salesSummary && salesSummary.REAL_BRL) {
            totalEfectivoBRL = salesSummary.REAL_BRL.TotalEfectivo;
        }
        if (salesSummary && salesSummary.DOLAR_USA) {
            totalEfectivoDOLAR = salesSummary.DOLAR_USA.TotalEfectivo;
        }

        return {
            totalCajaFinalARS: totalCajaFinalARS,
            totalEfectivoBRL: totalEfectivoBRL,
            totalEfectivoDOLAR: totalEfectivoDOLAR,
            totalGastosARS: totalGastos
        };
    }

    /**
     * Actualiza los elementos de display del DOM con los totales finales de caja y gastos.
     * Utiliza la variable global `currentSalesData`.
     */
    function updateFinalCashTotals() {
    let totalARS = 0;
    let totalBRL = 0;
    let totalDOLAR = 0;

    // Obtener valores de Ingreso Extra y Gastos
    const ingresoExtra = parseFloat(ingresoExtraInput.value) || 0;
    const totalGastos = gastoInputs.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);

    if (currentSalesData) {
        // Sumar TotalEfectivo de cada moneda usando las claves exactas del backend
        // Usamos notación de corchetes para claves con espacios
        if (currentSalesData['PESOS ARG']) {
            totalARS += currentSalesData['PESOS ARG'].TotalEfectivo;
        }
        if (currentSalesData['REAL BRL']) {
            totalBRL += currentSalesData['REAL BRL'].TotalEfectivo;
        }
        if (currentSalesData['DOLAR USA']) { // Clave corregida: 'DOLAR USA'
            totalDOLAR += currentSalesData['DOLAR USA'].TotalEfectivo;
        }

        // Sumar todos los TotalVentasPesos para obtener el total general en ARS
        // Este bucle ya debería funcionar bien porque itera sobre todas las claves existentes
        for (const currencyCode in currentSalesData) {
            if (currentSalesData.hasOwnProperty(currencyCode)) {
                // Asegúrate de que TotalVentasPesos exista en cada objeto de moneda
                // Agregamos `|| 0` para manejar casos donde la propiedad podría no existir o ser nula
                totalARS += currentSalesData[currencyCode].TotalVentasPesos || 0;
            }
        }
    }

    // Aplicar ingreso extra y gastos solo al total en ARS
    totalARS += ingresoExtra - totalGastos;

    // Actualizar los elementos del DOM
    totalFinalCajaARSElement.textContent = formatCurrency(totalARS, 'ARS');
    totalFinalCajaBRLElement.textContent = formatCurrency(totalBRL, 'BRL');
    totalFinalCajaDOLARElement.textContent = formatCurrency(totalDOLAR, 'DOLAR'); // Pasamos 'DOLAR' como string
}

    // --- Funciones de Carga y Display de Datos ---

    /**
     * Carga las fechas únicas disponibles para el resumen de caja desde el backend.
     */
    async function loadUniqueDatesForCaja() {
        showLoadingOverlay();
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'getUniqueDatesForCaja' })
            });
            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                fechaCajaSelect.innerHTML = '<option value="">Seleccionar Fecha</option>';
                data.data.forEach(date => {
                    const option = document.createElement('option');
                    option.value = date;
                    option.textContent = date;
                    fechaCajaSelect.appendChild(option);
                });
            } else {
                fechaCajaSelect.innerHTML = '<option value="">No hay fechas disponibles</option>';
                showMessageModal(data.message || 'No se pudieron cargar las fechas disponibles.');
            }
        } catch (error) {
            console.error('Error cargando fechas:', error);
            showMessageModal('Error al cargar las fechas disponibles.');
        } finally {
            hideLoadingOverlay();
        }
    }

    /**
     * Obtiene los datos de caja para la fecha seleccionada desde el backend y los muestra.
     * @param {string} selectedDate - La fecha seleccionada en formato "dd/MM/yyyy".
     */
    async function fetchCashRegisterData(selectedDate) {
        showLoadingOverlay();
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'getCashRegisterDataByDate', payload: { date: selectedDate } })
            });
            const data = await response.json();
            console.log('Datos de caja recibidos del backend:', data);

            if (data.success) {
                currentSalesData = data.data; // Almacena los datos para usar en los cálculos
                displayCashRegisterData(currentSalesData); // Muestra los detalles de ventas por moneda
                updateFinalCashTotals(); // Actualiza todos los totales finales y gastos
            } else {
                cashRegisterDashboard.innerHTML = `<p class="empty-message">${data.message || 'No se encontraron datos para la fecha seleccionada.'}</p>`;
                currentSalesData = null; // Limpiar datos anteriores
                updateFinalCashTotals(); // Reiniciar los displays de totales si no hay datos
            }
        } catch (error) {
            console.error('Error fetching cash register data:', error);
            showMessageModal('Error al obtener los datos de caja.');
            cashRegisterDashboard.innerHTML = `<p class="empty-message">Error al cargar los datos.</p>`;
            currentSalesData = null; // Limpiar datos anteriores
            updateFinalCashTotals(); // Reiniciar los displays de totales
        } finally {
            hideLoadingOverlay();
        }


    }

    /**
     * Muestra los datos detallados de ventas por método de pago y moneda en el dashboard.
     * @param {Object} data - El objeto con el resumen de ventas por moneda.
     */
    function displayCashRegisterData(data) {
        cashRegisterDashboard.innerHTML = ''; // Limpiar el dashboard

        if (!data || Object.keys(data).length === 0) {
            cashRegisterDashboard.innerHTML = '<p class="empty-message">No hay movimientos de caja para la fecha seleccionada.</p>';
            return;
        }

        for (const currency in data) {
            if (data.hasOwnProperty(currency)) {
                const currencyData = data[currency];
                const currencySection = document.createElement('div');
                currencySection.classList.add('currency-section');
                currencySection.innerHTML = `
                    <h3>Ventas en ${currency.replace('_', ' ')}</h3>
                    <div class="payment-method-details">
                        <div class="detail-item">
                            <strong>Efectivo:</strong>
                            <p class="amount-display">${formatCurrency(currencyData.TotalEfectivo, currency === 'PESOS ARG' ? 'ARS' : (currency === 'REAL BRL' ? 'BRL' : currency==='DOLAR'))}</p>
                        </div>
                        <div class="detail-item">
                            <strong>Tarjeta de Crédito:</strong>
                            <p class="amount-display">${formatCurrency(currencyData.TotalTarjetaCredito, currency === 'PESOS ARG' ? 'ARS' : (currency === 'REAL BRL' ? 'BRL' : 'DOLAR'))}</p>
                        </div>
                        <div class="detail-item">
                            <strong>Tarjeta de Débito:</strong>
                            <p class="amount-display">${formatCurrency(currencyData.TotalTarjetaDebito, currency === 'PESOS ARG' ? 'ARS' : (currency === 'REAL BRL' ? 'BRL' : 'DOLAR'))}</p>
                        </div>
                        <div class="detail-item">
                            <strong>Transferencia:</strong>
                            <p class="amount-display">${formatCurrency(currencyData.TotalTransferencia, currency === 'PESOS ARG' ? 'ARS' : (currency === 'REAL BRL' ? 'BRL' : 'DOLAR'))}</p>
                        </div>
                    </div>
                    <p class="currency-total">Total Ventas en ${currency.replace('_', ' ')}: ${formatCurrency(currencyData.TotalVentasOriginal, currency === 'PESOS ARG' ? 'ARS' : (currency === 'REALBRL' ? 'BRL' : 'DOLAR'))}</p>
                    ${currency === 'PESOS ARG' ? '' : `<p class="currency-total">Total Equivalente en Pesos: ${formatCurrency(currencyData.TotalVentasPesos, 'ARS')}</p>`}
                `;
                cashRegisterDashboard.appendChild(currencySection);
            }
        }
    }

    // --- Cierre de Caja ---
    /**
     * Envía los datos de cierre de caja al backend para registrar la caja diaria.
     */
    async function closeCashRegister() {
        if (!fechaCajaSelect.value) {
            showMessageModal('Por favor, seleccione una fecha antes de cerrar la caja.');
            return;
        }

        const confirmClose = confirm('¿Está seguro de que desea cerrar la caja para esta fecha? Esta acción registrará los totales.');
        if (!confirmClose) {
            return;
        }

        showLoadingOverlay();

        const fechaCierre = fechaCajaSelect.value;
        const ingresoExtra = parseFloat(ingresoExtraInput.value) || 0;
        const gastos = gastoInputs.map(input => parseFloat(input.value) || 0);

        // Recalcular los totales finales justo antes de enviar para asegurar que sean los más recientes
        const finalTotals = calculateTotalFinalCaja(currentSalesData);

        // Estructurar los datos para enviar al backend
        const cashRegisterDetails = {
            fechaCierre: fechaCierre,
            totalVentasPorMoneda: currentSalesData, // Datos detallados por moneda y método de pago
            ingresoExtra: ingresoExtra,
            gastos: gastos,
            totalFinalCajaARS: finalTotals.totalCajaFinalARS,
            totalEfectivoBRL: finalTotals.totalEfectivoBRL,
            totalEfectivoDOLAR: finalTotals.totalEfectivoDOLAR
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'closeDailyCashRegister', payload: cashRegisterDetails })
            });
            const data = await response.json();
            console.log('Respuesta de cierre de caja:', data);

            if (data.success) {
                showMessageModal('Caja cerrada exitosamente para el ' + fechaCierre + '.');
                // Opcional: Limpiar o resetear la interfaz después de cerrar caja
                fechaCajaSelect.value = '';
                cashRegisterDashboard.innerHTML = '<p class="empty-message">Seleccione una fecha para ver el resumen de caja.</p>';
                ingresoExtraInput.value = '0';
                gastoInputs.forEach(input => input.value = '0');
                currentSalesData = null; // Limpiar datos anteriores
                updateFinalCashTotals(); // Reiniciar los displays de totales a 0
            } else {
                showMessageModal(data.message || 'Error al cerrar la caja. Intente de nuevo.');
            }
        } catch (error) {
            console.error('Error cerrando caja:', error);
            showMessageModal('Error de conexión o al procesar el cierre de caja.');
        } finally {
            hideLoadingOverlay();
        }
    }

    // --- Event Listeners ---

    // Cuando se selecciona una fecha, cargar los datos de caja
    fechaCajaSelect.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
            fetchCashRegisterData(selectedDate);
        } else {
            // Si no se selecciona ninguna fecha (ej. se vuelve a la opción por defecto)
            cashRegisterDashboard.innerHTML = '<p class="empty-message">Seleccione una fecha para ver el resumen de caja.</p>';
            currentSalesData = null;
            updateFinalCashTotals(); // Limpiar los displays de totales
        }
    });

    // Actualizar totales finales cuando cambian los inputs de ingreso extra o gastos
    ingresoExtraInput.addEventListener('input', updateFinalCashTotals);
    gastoInputs.forEach(input => input.addEventListener('input', updateFinalCashTotals));

    // Botón para cerrar la caja
    closeCashRegisterButton.addEventListener('click', closeCashRegister);

    // Listeners para cerrar el modal de mensajes
    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideMessageModal);
    }
    window.addEventListener('click', (event) => {
        if (messageModal && event.target === messageModal) {
            hideMessageModal();
        }
    });

    // --- Carga Inicial al cargar la página ---
    loadUniqueDatesForCaja();
    updateFinalCashTotals(); // Inicializa los displays de totales (en 0) al cargar la página
});