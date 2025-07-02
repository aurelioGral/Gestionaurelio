// vendedores.js

document.addEventListener('DOMContentLoaded', () => {
    // *** ¡IMPORTANTE! Reemplaza esta URL con la URL de tu Web App de Google Apps Script ***
    // Esta URL debe ser la misma que usas en script.js y clientes.js
    const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec';

    // --- Elementos del DOM ---
    const fechaVentasSelect = document.getElementById('fechaVentasSelect');
    const vendedoresGrid = document.getElementById('vendedoresGrid');
    const messageModal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeButton = document.querySelector('.close-button'); // General close button for message modal
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Calculator Modal Elements
    const commissionCalculatorModal = document.getElementById('commissionCalculatorModal');
    const closeCalculatorModalBtn = document.getElementById('closeCalculatorModal');
    const calcVendorName = document.getElementById('calcVendorName');
    const calcSalesDate = document.getElementById('calcSalesDate');
    const calcTotalSales = document.getElementById('calcTotalSales');
    const commissionPercentageInput = document.getElementById('commissionPercentage');
    const calculatedCommissionAmount = document.getElementById('calculatedCommissionAmount');
    const payCommissionButton = document.getElementById('payCommissionButton');
    const cancelCommissionButton = document.getElementById('cancelCommissionButton');

    let currentVendorData = null; // To store data for the current vendor being processed

    // --- Funciones para el Loading Overlay (copiado de script.js) ---
    function showLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
    }

    // --- Funciones de Utilidad (copiado de script.js) ---
    /**
     * Muestra un mensaje al usuario en un pop-up modal.
     * @param {string} message - El mensaje a mostrar.
     * @param {string} type - 'success', 'error', o 'info'.
     */
    function showMessage(message, type) {
        modalMessage.textContent = message;
        if (messageModal) {
            messageModal.classList.add('show'); 
            const modalContent = messageModal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.className = 'modal-content'; 
                modalContent.classList.add(type); 
            }
            messageModal.style.display = 'flex'; 

            if (closeButton) {
                closeButton.onclick = function() {
                    messageModal.style.display = 'none';
                    if (modalMessage) modalMessage.className = '';
                    if (modalContent) modalContent.className = 'modal-content';
                }
            }

            window.onclick = function(event) {
                if (event.target == messageModal && event.target !== commissionCalculatorModal) { // Exclude calculator modal
                    messageModal.style.display = 'none';
                    if (modalMessage) modalMessage.className = '';
                    if (modalContent) modalContent.className = 'modal-content';
                }
            }

            if (type !== 'error') { 
                setTimeout(() => {
                    if (messageModal) messageModal.style.display = 'none';
                    if (modalMessage) modalMessage.className = '';
                    if (modalContent) modalContent.className = 'modal-content';
                }, 5000);
            }
        }
    }

    /**
     * Realiza una solicitud POST a la aplicación web de Apps Script.
     * @param {string} action - La acción a realizar en el backend.
     * @param {Object} payload - Los datos a enviar al backend.
     * @returns {Promise<Object>} - La respuesta del backend.
     */
    async function callAppsScript(action, payload = {}) {
        showLoading();
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
            hideLoading();
        }
    }

    // --- Funciones específicas para Vendedores ---

    async function fetchSalesDates() {
        if (!fechaVentasSelect) return;

        fechaVentasSelect.innerHTML = '<option value="">Cargando fechas...</option>';
        showLoading();
        try {
            const result = await callAppsScript('getSalesDates');
            if (result.success && result.data && result.data.length > 0) {
                fechaVentasSelect.innerHTML = '<option value="">Seleccione una fecha</option>'; // Default option
                result.data.forEach(date => {
                    const option = document.createElement('option');
                    option.value = date;
                    option.textContent = date;
                    fechaVentasSelect.appendChild(option);
                });
            } else {
                fechaVentasSelect.innerHTML = '<option value="">No hay fechas disponibles</option>';
                showMessage(result.message || 'No se encontraron fechas de ventas.', 'info');
            }
        } catch (error) {
            console.error('Error al cargar fechas de ventas:', error);
            fechaVentasSelect.innerHTML = '<option value="">Error al cargar fechas</option>';
            showMessage('Error al cargar las fechas de ventas. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            hideLoading();
        }
    }

    async function fetchVendorSales() {
        if (!vendedoresGrid) return;

        const selectedDate = fechaVentasSelect ? fechaVentasSelect.value : '';
        if (!selectedDate) {
            vendedoresGrid.innerHTML = '<p class="empty-message">Seleccione una fecha para ver las ventas por vendedor.</p>';
            return;
        }

        vendedoresGrid.innerHTML = '<p class="empty-message">Cargando ventas...</p>';
        showLoading();
        try {
            const result = await callAppsScript('getVendorSalesByDate', { date: selectedDate });
            if (result.success && result.data && result.data.length > 0) {
                displayVendorSales(result.data, selectedDate);
            } else {
                vendedoresGrid.innerHTML = '<p class="empty-message">No se encontraron ventas para la fecha seleccionada.</p>';
                showMessage(result.message || 'No se encontraron ventas para esta fecha.', 'info');
            }
        } catch (error) {
            console.error('Error al cargar ventas por vendedor:', error);
            vendedoresGrid.innerHTML = '<p class="empty-message error">Error al cargar las ventas. Por favor, inténtalo de nuevo más tarde.<br>Detalle: ' + error.message + '</p>';
            showMessage('Error al cargar las ventas por vendedor. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            hideLoading();
        }
    }

    function displayVendorSales(vendorSalesData, selectedDate) {
        if (!vendedoresGrid) return;
        vendedoresGrid.innerHTML = ''; // Limpiar el contenedor

        vendorSalesData.forEach(vendor => {
            const vendorCard = document.createElement('div');
            vendorCard.className = 'vendor-card';
            vendorCard.innerHTML = `
                <h3>${vendor.Vendedor || 'N/A'}</h3>
                <p><strong>Total Ventas:</strong> $${(vendor.TotalVentas || 0).toFixed(2)}</p>
                <p><strong>Cantidad de Reservas:</strong> ${vendor.CantidadReservas || 0}</p>
                <button class="commission-button" 
                        data-vendor="${vendor.Vendedor}" 
                        data-date="${selectedDate}" 
                        data-total-sales="${vendor.TotalVentas}">
                    Cargar Pago de Comisión
                </button>
            `;
            vendedoresGrid.appendChild(vendorCard);
        });

        // Add event listeners to the commission buttons
        document.querySelectorAll('.commission-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const vendorName = event.target.dataset.vendor;
                const date = event.target.dataset.date;
                const totalSales = parseFloat(event.target.dataset.totalSales);
                
                // Store current vendor data
                currentVendorData = { vendorName, date, totalSales };

                // Populate and show the calculator modal
                calcVendorName.textContent = vendorName;
                calcSalesDate.textContent = date;
                calcTotalSales.textContent = `$${totalSales.toFixed(2)}`;
                commissionPercentageInput.value = 0; // Reset percentage
                calculatedCommissionAmount.textContent = '$0.00'; // Reset calculated amount
                commissionCalculatorModal.style.display = 'flex';
            });
        });
    }

    // --- Commission Calculator Modal Logic ---
    if (commissionPercentageInput && calcTotalSales && calculatedCommissionAmount) {
        commissionPercentageInput.addEventListener('input', () => {
            const percentage = parseFloat(commissionPercentageInput.value);
            const totalSales = parseFloat(currentVendorData.totalSales);
            if (!isNaN(percentage) && !isNaN(totalSales)) {
                const calculatedAmount = (totalSales * (percentage / 100)).toFixed(2);
                calculatedCommissionAmount.textContent = `$${calculatedAmount}`;
            } else {
                calculatedCommissionAmount.textContent = '$0.00';
            }
        });
    }

    if (payCommissionButton) {
        payCommissionButton.addEventListener('click', async () => {
            if (!currentVendorData) return;

            const vendorName = currentVendorData.vendorName;
            const salesDate = currentVendorData.date;
            const commissionAmount = parseFloat(calculatedCommissionAmount.textContent.replace('$', ''));

            if (isNaN(commissionAmount) || commissionAmount <= 0) {
                showMessage('Monto de comisión inválido. Por favor, calcula un monto positivo.', 'error');
                return;
            }

            hideCalculatorModal();
            await recordCommissionPayment(vendorName, commissionAmount, salesDate, currentVendorData.totalSales);
        });
    }

    if (cancelCommissionButton) {
        cancelCommissionButton.addEventListener('click', () => {
            hideCalculatorModal();
            showMessage('Carga de comisión cancelada.', 'info');
        });
    }

    if (closeCalculatorModalBtn) {
        closeCalculatorModalBtn.addEventListener('click', () => {
            hideCalculatorModal();
        });
    }

    function hideCalculatorModal() {
        if (commissionCalculatorModal) {
            commissionCalculatorModal.style.display = 'none';
        }
    }


    async function recordCommissionPayment(vendorName, amount, salesDate, totalSalesForPeriod) {
        showLoading();
        try {
            const paymentDate = new Date().toLocaleDateString('es-AR');
            const result = await callAppsScript('recordCommissionPayment', {
                vendor: vendorName,
                amount: amount,
                date: salesDate, // This is the sales date
                paymentDate: paymentDate, // This is the actual payment date
                totalSales: totalSalesForPeriod // Include total sales for ticket
            });

            if (result.success) {
                showMessage(`Pago de comisión de $${amount.toFixed(2)} para ${vendorName} registrado con éxito.`, 'success');
                // *** Ticket Printing Logic ***
                printCommissionTicket({
                    vendorName: vendorName,
                    commissionAmount: amount,
                    salesDate: salesDate,
                    paymentDate: paymentDate,
                    totalSales: totalSalesForPeriod
                });
                // Optionally refresh sales data after recording payment
                fetchVendorSales(); 
            } else {
                showMessage(result.message || 'Error al registrar el pago de comisión.', 'error');
            }
        } catch (error) {
            console.error('Error al registrar pago de comisión:', error);
            showMessage('Error al registrar el pago de comisión. Por favor, inténtalo de nuevo.', 'error');
        } finally {
            hideLoading();
        }
    }

    function printCommissionTicket(details) {
        // Construct URL parameters
        const params = new URLSearchParams({
            vendorName: details.vendorName,
            commissionAmount: details.commissionAmount.toFixed(2),
            salesDate: details.salesDate,
            paymentDate: details.paymentDate,
            totalSales: details.totalSales.toFixed(2)
        }).toString();

        // Open new window for printing
        const printWindow = window.open(`../html/Ticket.html?${params}`, '_blank', 'width=800,height=600');
        if (printWindow) {
            printWindow.onload = () => {
                // The Ticket.html script will handle printing on load
            };
        } else {
            showMessage('No se pudo abrir la ventana de impresión. Por favor, permite pop-ups para este sitio.', 'error');
        }
    }


    // --- Event Listeners ---
    if (fechaVentasSelect) {
        fechaVentasSelect.addEventListener('change', fetchVendorSales);
    }

    // --- Cargar fechas al inicio ---
    fetchSalesDates();
});