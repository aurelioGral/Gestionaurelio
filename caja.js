// caja.js

// *** ¡IMPORTANTE! Reemplaza esta URL con la URL de tu Web App de Google Apps Script ***
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec';

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const fechaCajaSelect = document.getElementById('fechaCajaSelect');
    const dashboardGrid = document.getElementById('dashboardGrid');
    const lastClosuresGrid = document.getElementById('lastClosuresGrid');

    const ingresoEfectivoARS = document.getElementById('ingresoEfectivoARS');
    const ingresoTarjetaCreditoARS = document.getElementById('ingresoTarjetaCreditoARS');
    const ingresoTarjetaDebitoARS = document.getElementById('ingresoTarjetaDebitoARS');
    const ingresoTransferenciaARS = document.getElementById('ingresoTransferenciaARS');
    const totalIngresosARS = document.getElementById('totalIngresosARS');

    const ingresoEfectivoBRL = document.getElementById('ingresoEfectivoBRL');
    const ingresoTarjetaCreditoBRL = document.getElementById('ingresoTarjetaCreditoBRL');
    const ingresoTarjetaDebitoBRL = document.getElementById('ingresoTarjetaDebitoBRL');
    const ingresoTransferenciaBRL = document.getElementById('ingresoTransferenciaBRL');
    const totalIngresosBRL = document.getElementById('totalIngresosBRL');

    const ingresoEfectivoUSD = document.getElementById('ingresoEfectivoUSD');
    const ingresoTarjetaCreditoUSD = document.getElementById('ingresoTarjetaCreditoUSD');
    const ingresoTarjetaDebitoUSD = document.getElementById('ingresoTarjetaDebitoUSD');
    const ingresoTransferenciaUSD = document.getElementById('ingresoTransferenciaUSD');
    const totalIngresosUSD = document.getElementById('totalIngresosUSD');

    const totalComisiones = document.getElementById('totalComisiones');

    const ingresoExtraDetalle = document.getElementById('ingresoExtraDetalle');
    const ingresoExtraMonto = document.getElementById('ingresoExtraMonto');

    const gasto1ARSEdetalle = document.getElementById('gasto1ARSEdetalle');
    const gasto1ARSmonto = document.getElementById('gasto1ARSmonto');
    const gasto2ARSEdetalle = document.getElementById('gasto2ARSEdetalle');
    const gasto2ARSmonto = document.getElementById('gasto2ARSmonto');
    const gasto3ARSEdetalle = document.getElementById('gasto3ARSEdetalle');
    const gasto3ARSmonto = document.getElementById('gasto3ARSmonto');

    const gasto4USDdetalle = document.getElementById('gasto4USDdetalle');
    const gasto4USDMonto = document.getElementById('gasto4USDMonto');
    const gasto5USDdetalle = document.getElementById('gasto5USDdetalle');
    const gasto5USDMonto = document.getElementById('gasto5USDMonto');

    const finalIngresosARS = document.getElementById('finalIngresosARS');
    const finalIngresosBRL = document.getElementById('finalIngresosBRL');
    const finalIngresosUSD = document.getElementById('finalIngresosUSD');
    const finalPagoComisiones = document.getElementById('finalPagoComisiones');
    const finalGastosARS = document.getElementById('finalGastosARS');
    const finalGastosUSD = document.getElementById('finalGastosUSD');

    const montoTotalFinalARS = document.getElementById('montoTotalFinalARS');
    const montoTotalFinalBRL = document.getElementById('montoTotalFinalBRL');
    const montoTotalFinalUSD = document.getElementById('montoTotalFinalUSD');

    const btnCierreCaja = document.getElementById('btnCierreCaja');
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = messageModal ? messageModal.querySelector('.close-button') : null;
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Variables para almacenar los datos del dashboard
    let currentCajaData = {
        ingresosARS: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
        ingresosBRL: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
        ingresosUSD: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
        comisiones: 0,
    };

    // Function to show/hide loading overlay
    function showLoadingOverlay(show) {
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('show');
            } else {
               loadingOverlay.classList.remove('show');
            }
        }
    }

    // Function to show message modal
    function showMessageModal(message) {
        modalMessage.textContent = message;
        messageModal.style.display = 'block';
    }

    // Function to hide message modal
    function hideMessageModal() {
        messageModal.style.display = 'none';
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideMessageModal);
    }
    window.addEventListener('click', (event) => {
        if (messageModal && event.target === messageModal) {
            hideMessageModal();
        }
    });

    // --- Carga de Fechas Únicas para Caja ---
    async function loadUniqueDatesForCaja() {
        showLoadingOverlay(true);
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ action: 'getUniqueDatesForCaja' }),
            });
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                fechaCajaSelect.innerHTML = '<option value="">Seleccione una fecha</option>';
                data.data.forEach(dateStr => {
                    const option = document.createElement('option');
                    option.value = dateStr;
                    option.textContent = dateStr;
                    fechaCajaSelect.appendChild(option);
                });
            } else {
                fechaCajaSelect.innerHTML = '<option value="">No hay fechas disponibles</option>';
            }
        } catch (error) {
            console.error('Error al cargar fechas para caja:', error);
            showMessageModal('Error al cargar las fechas disponibles. Intente de nuevo.');
            fechaCajaSelect.innerHTML = '<option value="">Error al cargar fechas</option>';
        } finally {
            showLoadingOverlay(false);
        }
    }

    // --- Cargar Datos de Caja para la Fecha Seleccionada ---
    async function fetchCajaData(selectedDate) {
        if (!selectedDate) {
            // Limpiar dashboard y resumen si no hay fecha seleccionada
            resetCajaDashboard();
            calculateFinalSummary();
            return;
        }

        showLoadingOverlay(true);
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Usa application/json, no necesitas text/plain para CORS con Apps Script
                },
                // *** CAMBIO AQUÍ: Envía 'date' dentro de 'payload' ***
                body: JSON.stringify({ action: 'getCajaData', payload: { date: selectedDate } }),
            });
            const data = await response.json();

            if (data.success) {
                currentCajaData = data.data; // Actualizar la variable global
                updateCajaDashboard(currentCajaData);
                calculateFinalSummary(); // Recalcular el resumen con los nuevos datos
            } else {
                showMessageModal(data.message || 'Error al obtener datos de caja.');
                resetCajaDashboard();
                calculateFinalSummary();
            }
        } catch (error) {
            console.error('Error fetching caja data:', error);
            showMessageModal('Error de conexión al obtener los datos de caja. Intente de nuevo.');
            resetCajaDashboard();
            calculateFinalSummary();
        } finally {
            showLoadingOverlay(false);
        }
    }

    function updateCajaDashboard(data) {
        // Ingresos ARS
        ingresoEfectivoARS.textContent = (data.ingresosARS.Efectivo || 0).toFixed(2);
        ingresoTarjetaCreditoARS.textContent = (data.ingresosARS['Tarjeta de Credito'] || 0).toFixed(2);
        ingresoTarjetaDebitoARS.textContent = (data.ingresosARS['Tarjeta de Debito'] || 0).toFixed(2);
        ingresoTransferenciaARS.textContent = (data.ingresosARS.Transferencia || 0).toFixed(2);
        totalIngresosARS.textContent = (data.ingresosARS.total || 0).toFixed(2);

        // Ingresos BRL
        ingresoEfectivoBRL.textContent = (data.ingresosBRL.Efectivo || 0).toFixed(2);
        ingresoTarjetaCreditoBRL.textContent = (data.ingresosBRL['Tarjeta de Credito'] || 0).toFixed(2);
        ingresoTarjetaDebitoBRL.textContent = (data.ingresosBRL['Tarjeta de Debito'] || 0).toFixed(2);
        ingresoTransferenciaBRL.textContent = (data.ingresosBRL.Transferencia || 0).toFixed(2);
        totalIngresosBRL.textContent = (data.ingresosBRL.total || 0).toFixed(2);

        // Ingresos USD
        ingresoEfectivoUSD.textContent = (data.ingresosUSD.Efectivo || 0).toFixed(2);
        ingresoTarjetaCreditoUSD.textContent = (data.ingresosUSD['Tarjeta de Credito'] || 0).toFixed(2);
        ingresoTarjetaDebitoUSD.textContent = (data.ingresosUSD['Tarjeta de Debito'] || 0).toFixed(2);
        ingresoTransferenciaUSD.textContent = (data.ingresosUSD.Transferencia || 0).toFixed(2);
        totalIngresosUSD.textContent = (data.ingresosUSD.total || 0).toFixed(2);

        // Comisiones
        totalComisiones.textContent = (data.comisiones || 0).toFixed(2);
        finalPagoComisiones.textContent = (data.comisiones || 0).toFixed(2); // También actualiza el resumen final
    }

    function resetCajaDashboard() {
        const resetValue = '0.00';
        ingresoEfectivoARS.textContent = resetValue;
        ingresoTarjetaCreditoARS.textContent = resetValue;
        ingresoTarjetaDebitoARS.textContent = resetValue;
        ingresoTransferenciaARS.textContent = resetValue;
        totalIngresosARS.textContent = resetValue;

        ingresoEfectivoBRL.textContent = resetValue;
        ingresoTarjetaCreditoBRL.textContent = resetValue;
        ingresoTarjetaDebitoBRL.textContent = resetValue;
        ingresoTransferenciaBRL.textContent = resetValue;
        totalIngresosBRL.textContent = resetValue;

        ingresoEfectivoUSD.textContent = resetValue;
        ingresoTarjetaCreditoUSD.textContent = resetValue;
        ingresoTarjetaDebitoUSD.textContent = resetValue;
        ingresoTransferenciaUSD.textContent = resetValue;
        totalIngresosUSD.textContent = resetValue;

        totalComisiones.textContent = resetValue;
        finalPagoComisiones.textContent = resetValue;

        // Resetear inputs de gastos e ingresos extra
        ingresoExtraMonto.value = '';
        ingresoExtraDetalle.value = '';
        gasto1ARSmonto.value = '';
        gasto1ARSEdetalle.value = '';
        gasto2ARSmonto.value = '';
        gasto2ARSEdetalle.value = '';
        gasto3ARSmonto.value = '';
        gasto3ARSEdetalle.value = '';
        gasto4USDMonto.value = '';
        gasto4USDdetalle.value = '';
        gasto5USDMonto.value = '';
        gasto5USDdetalle.value = '';

        currentCajaData = {
            ingresosARS: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
            ingresosBRL: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
            ingresosUSD: { "Efectivo": 0, 'Tarjeta de Credito': 0, 'Tarjeta de Debito': 0, "Transferencia": 0, total: 0 },
            comisiones: 0,
        };
    }

    // --- Cálculo del Resumen Final ---
    function calculateFinalSummary() {
        const ingresosTotalesARS = parseFloat(totalIngresosARS.textContent) || 0;
        const ingresosTotalesBRL = parseFloat(totalIngresosBRL.textContent) || 0;
        const ingresosTotalesUSD = parseFloat(totalIngresosUSD.textContent) || 0;
        const comisionesPagadas = parseFloat(totalComisiones.textContent) || 0;

        const extraIncome = parseFloat(ingresoExtraMonto.value) || 0;

        const gasto1ARS = parseFloat(gasto1ARSmonto.value) || 0;
        const gasto2ARS = parseFloat(gasto2ARSmonto.value) || 0;
        const gasto3ARS = parseFloat(gasto3ARSmonto.value) || 0;
        const totalGastosARS = gasto1ARS + gasto2ARS + gasto3ARS;

        const gasto4USD = parseFloat(gasto4USDMonto.value) || 0;
        const gasto5USD = parseFloat(gasto5USDMonto.value) || 0;
        const totalGastosUSD = gasto4USD + gasto5USD;

        // Actualizar valores en el resumen
        finalIngresosARS.textContent = (ingresosTotalesARS + extraIncome).toFixed(2);
        finalIngresosBRL.textContent = ingresosTotalesBRL.toFixed(2);
        finalIngresosUSD.textContent = ingresosTotalesUSD.toFixed(2);
        finalPagoComisiones.textContent = comisionesPagadas.toFixed(2);
        finalGastosARS.textContent = totalGastosARS.toFixed(2);
        finalGastosUSD.textContent = totalGastosUSD.toFixed(2);

        // Calcular totales finales (restando gastos y comisiones)
        const finalBalanceARS = ingresosTotalesARS + extraIncome - totalGastosARS - comisionesPagadas;
        const finalBalanceBRL = ingresosTotalesBRL;
        const finalBalanceUSD = ingresosTotalesUSD - totalGastosUSD;

        montoTotalFinalARS.textContent = finalBalanceARS.toFixed(2);
        montoTotalFinalBRL.textContent = finalBalanceBRL.toFixed(2);
        montoTotalFinalUSD.textContent = finalBalanceUSD.toFixed(2);
    }

    // --- Guardar Cierre de Caja ---
    async function saveCierreCaja() {
        const selectedDate = fechaCajaSelect.value;
        if (!selectedDate) {
            showMessageModal('Por favor, seleccione una fecha para realizar el cierre de caja.');
            return;
        }

        const confirmSave = confirm('¿Está seguro de que desea realizar el cierre de caja para esta fecha? Esta acción guardará los datos actuales.');
        if (!confirmSave) {
            return;
        }

        showLoadingOverlay(true);

        const cierreData = {
            fechaCierre: selectedDate,
            totalEfectivoARS: parseFloat(ingresoEfectivoARS.textContent),
            totalTarjetaCreditoARS: parseFloat(ingresoTarjetaCreditoARS.textContent),
            totalTarjetaDebitoARS: parseFloat(ingresoTarjetaDebitoARS.textContent),
            totalTransferenciaARS: parseFloat(ingresoTransferenciaARS.textContent),
            totalVentasARS: parseFloat(totalIngresosARS.textContent), // Total de ingresos ARS antes de extra/gastos
            totalEfectivoBRL: parseFloat(ingresoEfectivoBRL.textContent),
            totalTarjetaCreditoBRL: parseFloat(ingresoTarjetaCreditoBRL.textContent),
            totalTarjetaDebitoBRL: parseFloat(ingresoTarjetaDebitoBRL.textContent),
            totalTransferenciaBRL: parseFloat(ingresoTransferenciaBRL.textContent),
            totalVentasBRL: parseFloat(totalIngresosBRL.textContent),
            totalEfectivoDOLAR: parseFloat(ingresoEfectivoUSD.textContent),
            totalTarjetaCreditoDOLAR: parseFloat(ingresoTarjetaCreditoUSD.textContent),
            totalTarjetaDebitoDOLAR: parseFloat(ingresoTarjetaDebitoUSD.textContent),
            totalTransferenciaDOLAR: parseFloat(ingresoTransferenciaUSD.textContent),
            totalVentasDOLAR: parseFloat(totalIngresosUSD.textContent), // Total de ingresos USD antes de extra/gastos
            ingresoExtraARS: parseFloat(ingresoExtraMonto.value),
            ingresoExtraDetalle: ingresoExtraDetalle.value,
            gasto1ARS: parseFloat(gasto1ARSmonto.value),
            gasto1detalle: gasto1ARSEdetalle.value,
            gasto2ARS: parseFloat(gasto2ARSmonto.value),
            gasto2detalle: gasto2ARSEdetalle.value,
            gasto3ARS: parseFloat(gasto3ARSmonto.value),
            gasto3detalle: gasto3ARSEdetalle.value,
            gasto4DOLAR: parseFloat(gasto4USDMonto.value),
            gasto4detalle: gasto4USDdetalle.value,
            gasto5DOLAR: parseFloat(gasto5USDMonto.value),
            gasto5detalle: gasto5USDdetalle.value,
            totalGastosARS: parseFloat(finalGastosARS.textContent),
            totalGastosDOLAR: parseFloat(finalGastosUSD.textContent),
            comisionesPagadas: parseFloat(finalPagoComisiones.textContent),
            montoFinalARS: parseFloat(montoTotalFinalARS.textContent),
            montoFinalBRL: parseFloat(montoTotalFinalBRL.textContent),
            montoFinalUSD: parseFloat(montoTotalFinalUSD.textContent),
        };

         try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                // *** ESTO YA ESTABA CORRECTO, RECONFIRMAMOS EL USO DE 'payload' ***
                body: JSON.stringify({ action: 'saveCierreCaja', payload: cierreData }),
            });
            const result = await response.json();

            if (result.success) {
                showMessageModal('Cierre de caja exitoso!');
                // Después de un cierre exitoso, recargar los últimos cierres
                loadLastCierresCaja();
                // Opcional: recargar los datos de caja o limpiar el formulario
                fechaCajaSelect.value = ''; // Limpiar la selección de fecha
                resetCajaDashboard();
                calculateFinalSummary(); // Asegurarse de que el resumen también se resetee
            } else {
                showMessageModal(result.message || 'Error al guardar el cierre de caja.');
            }
        } catch (error) {
            console.error('Error saving cierre de caja:', error);
            showMessageModal('Error de conexión al guardar el cierre de caja. Intente de nuevo.');
        } finally {
            showLoadingOverlay(false);
        }
    }

    // --- Cargar Últimos 3 Cierres de Caja ---
    async function loadLastCierresCaja() {
        lastClosuresGrid.innerHTML = '<p class="empty-message">Cargando últimos cierres...</p>';
        showLoadingOverlay(true);
        try {
    const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'getLastCierresCaja', payload: {} }), // <--- CAMBIO AQUÍ
    });
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                lastClosuresGrid.innerHTML = ''; // Limpiar mensaje de carga
                data.data.forEach(closure => {
                    const card = document.createElement('div');
                    card.classList.add('closure-card');
                    card.innerHTML = `
                        <h4>Fecha: ${closure.FechaDeCierre}</h4>
                        <p>Total Pesos: <strong>${(closure.MontoTotalFinalPesos || 0).toFixed(2)} ARS</strong></p>
                        <p>Total Reales: <strong>${(closure.MontoTotalFinalReales || 0).toFixed(2)} BRL</strong></p>
                        <p>Total Dólares: <strong>${(closure.MontoTotalFinalDolares || 0).toFixed(2)} USD</strong></p>
                    `;
                    lastClosuresGrid.appendChild(card);
                });
            } else {
                lastClosuresGrid.innerHTML = '<p class="empty-message">No hay cierres de caja recientes.</p>';
            }
        } catch (error) {
            console.error('Error al cargar últimos cierres de caja:', error);
            lastClosuresGrid.innerHTML = '<p class="empty-message">Error al cargar cierres recientes.</p>';
        } finally {
            showLoadingOverlay(false);
        }
    }


    // --- Event Listeners ---
    fechaCajaSelect.addEventListener('change', (event) => {
        fetchCajaData(event.target.value);
    });

    // Escuchar cambios en los inputs de ingresos extra y gastos para recalcular el resumen
    [ingresoExtraMonto, gasto1ARSmonto, gasto2ARSmonto, gasto3ARSmonto, gasto4USDMonto, gasto5USDMonto].forEach(input => {
        input.addEventListener('input', calculateFinalSummary);
    });

    btnCierreCaja.addEventListener('click', saveCierreCaja);

    // --- Carga Inicial ---
    loadUniqueDatesForCaja();
    loadLastCierresCaja();
    resetCajaDashboard(); // Inicializar el dashboard y resumen vacíos
});