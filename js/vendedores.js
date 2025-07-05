// vendedores.js

// *** ¡IMPORTANTE! Reemplaza esta URL con la URL de tu Web App de Google Apps Script ***
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const fechaVentasSelect = document.getElementById('fechaVentasSelect');
    const vendedoresGrid = document.getElementById('vendedoresGrid');
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = messageModal ? messageModal.querySelector('.close-button') : null; // Verificación por si el modal no existe al inicio
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Commission Calculator Modal Elements
    const commissionCalculatorModal = document.getElementById('commissionCalculatorModal');
    const closeCalculatorModalButton = document.getElementById('closeCalculatorModal');
    const calcVendorName = document.getElementById('calcVendorName');
    const calcSalesDate = document.getElementById('calcSalesDate');
    const calcTotalSales = document.getElementById('calcTotalSales');
    const calcTotalEfectivo = document.getElementById('calcTotalEfectivo');
    const calcTotalTarjetaCredito = document.getElementById('calcTotalTarjetaCredito'); // Añadido
    const calcTotalTarjetaDebito = document.getElementById('calcTotalTarjetaDebito');   // Añadido
    const calcTotalTransferencia = document.getElementById('calcTotalTransferencia'); // Añadido
    
    const commissionPercentageEfectivo = document.getElementById('commissionPercentageEfectivo');
    const calculatedCommissionEfectivo = document.getElementById('calculatedCommissionEfectivo');
    const commissionPercentageTarjetaCredito = document.getElementById('commissionPercentageTarjetaCredito'); // Añadido
    const calculatedCommissionTarjetaCredito = document.getElementById('calculatedCommissionTarjetaCredito'); // Añadido
    const commissionPercentageTarjetaDebito = document.getElementById('commissionPercentageTarjetaDebito');   // Añadido
    const calculatedCommissionTarjetaDebito = document.getElementById('calculatedCommissionTarjetaDebito');   // Añadido
    const commissionPercentageTransferencia = document.getElementById('commissionPercentageTransferencia'); // Añadido
    const calculatedCommissionTransferencia = document.getElementById('calculatedCommissionTransferencia'); // Añadido

    const totalCommissionAmount = document.getElementById('totalCommissionAmount'); // Total de todas las comisiones
    const deductionCobradoEnVenta = document.getElementById('deductionCobradoEnVenta'); // Para la deducción por pre-reserva
    const netCommissionToPay = document.getElementById('netCommissionToPay'); // Comisión neta a pagar

    const payCommissionButton = document.getElementById('payCommissionButton');
    const cancelCommissionButton = document.getElementById('cancelCommissionButton');

    let currentVendorData = null; // Para almacenar los datos del vendedor seleccionado en el modal

    // --- Funciones de Utilidad (pueden estar en un archivo separado o aquí) ---
    function showLoadingOverlay(show) {
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('show');
            } else {
                loadingOverlay.classList.remove('show');
            }
        }
    }

    function showMessageModal(message, isError = false) {
        if (messageModal && modalMessage) {
            modalMessage.textContent = message;
            messageModal.style.display = 'block';
            modalMessage.style.color = isError ? 'red' : 'green';
        }
    }

    function hideMessageModal() {
        if (messageModal) {
            messageModal.style.display = 'none';
        }
    }

    function showCommissionCalculatorModal(vendorData) {
        currentVendorData = vendorData; // Guarda los datos del vendedor para usar en el cálculo
        calcVendorName.textContent = vendorData.Vendedor;
        calcSalesDate.textContent = fechaVentasSelect.value;
        calcTotalSales.textContent = `Total Ventas: $${vendorData.TotalVentas.toFixed(2)}`;
        calcTotalEfectivo.textContent = `Efectivo: $${vendorData.TotalEfectivo.toFixed(2)}`;
        calcTotalTarjetaCredito.textContent = `Tarjeta Crédito: $${vendorData.TotalTarjetaCredito.toFixed(2)}`;
        calcTotalTarjetaDebito.textContent = `Tarjeta Débito: $${vendorData.TotalTarjetaDebito.toFixed(2)}`;
        calcTotalTransferencia.textContent = `Transferencia: $${vendorData.TotalTransferencia.toFixed(2)}`;

        // Calcular la deducción por montos cobrados en pre-reserva
        let totalDeduction = 0;
        if (vendorData.ReservasDetalle && Array.isArray(vendorData.ReservasDetalle)) {
            vendorData.ReservasDetalle.forEach(reserva => {
                if (reserva.estado === "COBRADO") { // Asegúrate de que el estado sea "COBRADO"
                    totalDeduction += (parseFloat(reserva.montoPagadoPreReserva) || 0);
                }
            });
        }
        deductionCobradoEnVenta.textContent = `Deducción Cobrado en Venta: $${totalDeduction.toFixed(2)}`;

        // Reiniciar porcentajes y valores calculados al abrir el modal
        commissionPercentageEfectivo.value = "";
        calculatedCommissionEfectivo.textContent = '$0.00';
        commissionPercentageTarjetaCredito.value = "";
        calculatedCommissionTarjetaCredito.textContent = '$0.00';
        commissionPercentageTarjetaDebito.value = "";
        calculatedCommissionTarjetaDebito.textContent = '$0.00';
        commissionPercentageTransferencia.value = "";
        calculatedCommissionTransferencia.textContent = '$0.00';
        totalCommissionAmount.textContent = '$0.00';
        netCommissionToPay.textContent = '$0.00';

        commissionCalculatorModal.style.display = 'block';
        calculateCommission(); // Realiza un cálculo inicial al abrir
    }

    function hideCommissionCalculatorModal() {
        commissionCalculatorModal.style.display = 'none';
        currentVendorData = null; // Limpiar datos al cerrar
    }

    function calculateCommission() {
        if (!currentVendorData) return;

        const percEfectivo = parseFloat(commissionPercentageEfectivo.value) / 100 || 0;
        const percTarjetaCredito = parseFloat(commissionPercentageTarjetaCredito.value) / 100 || 0;
        const percTarjetaDebito = parseFloat(commissionPercentageTarjetaDebito.value) / 100 || 0;
        const percTransferencia = parseFloat(commissionPercentageTransferencia.value) / 100 || 0;

        const commEfectivo = currentVendorData.TotalEfectivo * percEfectivo;
        const commTarjetaCredito = currentVendorData.TotalTarjetaCredito * percTarjetaCredito;
        const commTarjetaDebito = currentVendorData.TotalTarjetaDebito * percTarjetaDebito;
        const commTransferencia = currentVendorData.TotalTransferencia * percTransferencia;

        calculatedCommissionEfectivo.textContent = `$${commEfectivo.toFixed(2)}`;
        calculatedCommissionTarjetaCredito.textContent = `$${commTarjetaCredito.toFixed(2)}`;
        calculatedCommissionTarjetaDebito.textContent = `$${commTarjetaDebito.toFixed(2)}`;
        calculatedCommissionTransferencia.textContent = `$${commTransferencia.toFixed(2)}`;

        const totalGrossCommission = commEfectivo + commTarjetaCredito + commTarjetaDebito + commTransferencia;
        totalCommissionAmount.textContent = `$${totalGrossCommission.toFixed(2)}`;

        // Obtener la deducción ya calculada y mostrada en el modal
        const deduction = parseFloat(deductionCobradoEnVenta.textContent.replace('Deducción Cobrado en Venta: $', '')) || 0;
        const netComm = totalGrossCommission - deduction;
        netCommissionToPay.textContent = `$${netComm.toFixed(2)}`;
    }

    async function recordAndPrintCommission() {
        if (!currentVendorData) {
            showMessageModal('No hay datos de vendedor para registrar la comisión.', true);
            return;
        }

        const confirmPay = confirm('¿Confirmar pago de comisión? Esto registrará la comisión y generará un ticket.');
        if (!confirmPay) return;

        showLoadingOverlay(true);

        const commissionData = {
            vendorName: currentVendorData.Vendedor,
            salesDate: fechaVentasSelect.value,
            totalSales: currentVendorData.TotalVentas,
            totalEfectivo: currentVendorData.TotalEfectivo,
            totalTarjetaCredito: currentVendorData.TotalTarjetaCredito,
            totalTarjetaDebito: currentVendorData.TotalTarjetaDebito,
            totalTransferencia: currentVendorData.TotalTransferencia,
            percEfectivo: parseFloat(commissionPercentageEfectivo.value) || 0,
            percTarjetaCredito: parseFloat(commissionPercentageTarjetaCredito.value) || 0,
            percTarjetaDebito: parseFloat(commissionPercentageTarjetaDebito.value) || 0,
            percTransferencia: parseFloat(commissionPercentageTransferencia.value) || 0,
            calcCommEfectivo: parseFloat(calculatedCommissionEfectivo.textContent.replace('$', '')) || 0,
            calcCommTarjetaCredito: parseFloat(calculatedCommissionTarjetaCredito.textContent.replace('$', '')) || 0,
            calcCommTarjetaDebito: parseFloat(calculatedCommissionTarjetaDebito.textContent.replace('$', '')) || 0,
            calcCommTransferencia: parseFloat(calculatedCommissionTransferencia.textContent.replace('$', '')) || 0,
            totalGrossCommission: parseFloat(totalCommissionAmount.textContent.replace('$', '')) || 0,
            deductionCobradoEnVenta: parseFloat(deductionCobradoEnVenta.textContent.replace('Deducción Cobrado en Venta: $', '')) || 0,
            netCommissionToPay: parseFloat(netCommissionToPay.textContent.replace('$', '')) || 0
        };

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'recordCommissionPayment', payload: commissionData })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                showMessageModal('Comisión registrada exitosamente!', false);
                hideCommissionCalculatorModal();
                // Opcional: Volver a cargar las ventas para la fecha actual para reflejar cambios
                fetchVendorSales(fechaVentasSelect.value);

                // Generar ticket (abrir nueva ventana/pestaña con los datos)
                openCommissionTicket(commissionData);

            } else {
                showMessageModal('Error al registrar comisión: ' + result.message, true);
            }
        } catch (e) {
            console.error('Error al registrar comisión:', e);
            showMessageModal('Error de conexión al registrar comisión: ' + e.message, true);
        } finally {
            showLoadingOverlay(false);
        }
    }

    function openCommissionTicket(data) {
        const params = new URLSearchParams({
            vendor: data.vendorName,
            date: data.salesDate,
            totalSales: data.totalSales,
            efectivo: data.totalEfectivo,
            tarjetaCredito: data.totalTarjetaCredito,
            tarjetaDebito: data.totalTarjetaDebito,
            transferencia: data.totalTransferencia,
            percEfectivo: data.percEfectivo,
            calcCommEfectivo: data.calcCommEfectivo,
            percTarjetaCredito: data.percTarjetaCredito,
            calcCommTarjetaCredito: data.calcCommTarjetaCredito,
            percTarjetaDebito: data.percTarjetaDebito,
            calcCommTarjetaDebito: data.calcCommTarjetaDebito,
            percTransferencia: data.percTransferencia,
            calcCommTransferencia: data.calcCommTransferencia,
            totalGrossComm: data.totalGrossCommission,
            deduction: data.deductionCobradoEnVenta,
            finalComm: data.netCommissionToPay,
            paymentDate: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        });
        window.open(`../html/Ticket.html?${params.toString()}`, '_blank');
    }

    // --- Funciones de Carga y Muestra de Contenido ---

    // Carga las fechas únicas disponibles de las reservas para el selector
    async function loadUniqueDatesForVendors() {
        showLoadingOverlay(true);
        fechaVentasSelect.innerHTML = '<option value="">Cargando fechas...</option>'; // Mensaje inicial
        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'getUniqueDates' })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                fechaVentasSelect.innerHTML = '<option value="">Seleccione una fecha</option>'; // Opción por defecto
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                    result.data.forEach(date => {
                        const option = document.createElement('option');
                        option.value = date;
                        option.textContent = date;
                        fechaVentasSelect.appendChild(option);
                    });
                    // Seleccionar la última fecha por defecto si hay alguna
                    fechaVentasSelect.value = result.data[result.data.length - 1];
                    // Cargar las ventas para la fecha seleccionada por defecto
                    fetchVendorSales(fechaVentasSelect.value);
                } else {
                    fechaVentasSelect.innerHTML = '<option value="">No hay fechas disponibles</option>';
                    vendedoresGrid.innerHTML = '<p class="empty-message">No hay ventas registradas para mostrar.</p>';
                }
            } else {
                showMessageModal('Error al cargar fechas: ' + result.message, true);
                fechaVentasSelect.innerHTML = '<option value="">Error al cargar fechas</option>';
            }
        } catch (e) {
            console.error('Error en loadUniqueDatesForVendors:', e);
            showMessageModal('Error de conexión al cargar fechas: ' + e.message, true);
            fechaVentasSelect.innerHTML = '<option value="">Error de conexión</option>';
        } finally {
            showLoadingOverlay(false);
        }
    }

    // Carga y Muestra de Ventas por Vendedor
    async function fetchVendorSales(date) {
        // Verificar si la fecha es válida antes de hacer la solicitud
        if (!date) {
            console.warn("No se seleccionó ninguna fecha para cargar las ventas de vendedores.");
            vendedoresGrid.innerHTML = '<p class="empty-message">Por favor, seleccione una fecha.</p>';
            showLoadingOverlay(false);
            return; // Salir de la función si no hay fecha
        }

        vendedoresGrid.innerHTML = '<p class="empty-message">Cargando ventas...</p>';
        showLoadingOverlay(true);

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'text/plain;charset=utf-8' 
                },
                // ¡IMPORTANTE! 'date' ahora va anidado dentro de 'payload'
                body: JSON.stringify({ 
                    action: 'getVendorSalesByDate', 
                    payload: { date: date } 
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP: ${response.status} - ${errorText || response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                displayVendorSales(result.data); // Asegúrate de que esta función exista y maneje la visualización
            } else {
                showMessageModal('Error al cargar ventas: ' + result.message, true);
                vendedoresGrid.innerHTML = '<p class="empty-message">Error al cargar las ventas.</p>';
            }
        } catch (e) {
            console.error('Error en fetchVendorSales:', e);
            showMessageModal('Error de conexión o de red al cargar ventas: ' + e.message, true);
            vendedoresGrid.innerHTML = '<p class="empty-message">Error de conexión al cargar las ventas.</p>';
        } finally {
            showLoadingOverlay(false);
        }
    }

    // Función para mostrar los datos de ventas por vendedor en el grid
    function displayVendorSales(salesData) {
        if (!vendedoresGrid) return; // Asegurar que el elemento existe
        
        vendedoresGrid.innerHTML = ''; // Limpiar contenido anterior

        if (!salesData || salesData.length === 0) {
            vendedoresGrid.innerHTML = '<p class="empty-message">No hay ventas para la fecha seleccionada.</p>';
            return;
        }

        salesData.forEach(vendor => {
            const card = document.createElement('div');
            card.className = 'vendor-card';
            card.innerHTML = `
                <h3>${vendor.Vendedor}</h3>
                <p><strong>Total Ventas:</strong> $${vendor.TotalVentas.toFixed(2)}</p>
                <p><strong>Reservas Realizadas:</strong> ${vendor.CantidadReservas}</p>
                <div class="payment-summary">
                    <h4>Desglose por Método de Pago:</h4>
                    <p>Efectivo: $${vendor.TotalEfectivo.toFixed(2)}</p>
                    <p>Tarjeta de Crédito: $${vendor.TotalTarjetaCredito.toFixed(2)}</p>
                    <p>Tarjeta de Débito: $${vendor.TotalTarjetaDebito.toFixed(2)}</p>
                    <p>Transferencia: $${vendor.TotalTransferencia.toFixed(2)}</p>
                </div>
                <button class="calculate-commission-btn" data-vendor='${JSON.stringify(vendor)}'>Calcular Comisión</button>
            `;
            vendedoresGrid.appendChild(card);
        });

        // Añadir event listeners a los botones de calcular comisión
        vendedoresGrid.querySelectorAll('.calculate-commission-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const vendorData = JSON.parse(event.target.dataset.vendor);
                showCommissionCalculatorModal(vendorData);
            });
        });
    }

    // --- Event Listeners ---
    fechaVentasSelect.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
            fetchVendorSales(selectedDate);
        } else {
            vendedoresGrid.innerHTML = '<p class="empty-message">Seleccione una fecha para ver las ventas por vendedor.</p>';
        }
    });

    if (closeModalButton) { // Asegura que el botón existe antes de añadir el listener
        closeModalButton.addEventListener('click', hideMessageModal);
    }
    window.addEventListener('click', (event) => {
        if (messageModal && event.target === messageModal) {
            hideMessageModal();
        }
    });

    // Commission Calculator Modal Listeners
    closeCalculatorModalButton.addEventListener('click', hideCommissionCalculatorModal);
    cancelCommissionButton.addEventListener('click', hideCommissionCalculatorModal);
    window.addEventListener('click', (event) => {
        if (commissionCalculatorModal && event.target === commissionCalculatorModal) {
            hideCommissionCalculatorModal();
        }
    });

    commissionPercentageEfectivo.addEventListener('input', calculateCommission); // Usar 'input' para actualización en tiempo real
    commissionPercentageTarjetaCredito.addEventListener('input', calculateCommission); // Añadido
    commissionPercentageTarjetaDebito.addEventListener('input', calculateCommission);   // Añadido
    commissionPercentageTransferencia.addEventListener('input', calculateCommission); // Añadido

    payCommissionButton.addEventListener('click', recordAndPrintCommission);

    // --- Carga Inicial ---
    loadUniqueDatesForVendors(); // Cargar las fechas al inicio de la página
});