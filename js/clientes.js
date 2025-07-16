let allReservations = []; // Guardaremos todas las reservas aquí
 let currentTab = 'active'; // Estado actual de pestaña
document.addEventListener('DOMContentLoaded', () => {
    // *** ¡IMPORTANTE! Reemplaza esta URL con la URL de tu Web App de Google Apps Script ***
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw6QQMWsDAZm1gTbqZIjzvuVAMXQkOIBHJntYsUsCOGIVtVeNFlC20c4kIlloRUTFJnnw/exec'; 

    const reservationsGrid = document.getElementById('reservationsGrid');
    const activeReservationsBtn = document.getElementById('activeReservationsBtn');
    const finishedReservationsBtn = document.getElementById('finishedReservationsBtn');
    const selectFecha             = document.getElementById('fecha-select');


   

  

    // Function to show/hide loading overlay
    function showLoadingOverlay(show) {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('show');
            } else {
                overlay.classList.remove('show');
            }
        }
    }

    async function fetchReservations() {
        reservationsGrid.innerHTML = '<p class="empty-message">Cargando reservas...</p>';
        showLoadingOverlay(true); // Mostrar overlay de carga

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({ action: 'getAllReservas' }) 
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Error desconocido al obtener reservas.');
            }

            console.log("Datos recibidos:", result.data); 
            allReservations = result.data; 
            initializeDateFilter();
            displayReservations('active'); // Mostrar activas por defecto
        } catch (error) {
            console.error('Error al cargar las reservas:', error);
            reservationsGrid.innerHTML = '<p class="empty-message error">Error al cargar las reservas. Por favor, inténtalo de nuevo más tarde.<br>Detalle: ' + error.message + '</p>';
        } finally {
            showLoadingOverlay(false); // Ocultar overlay de carga
        }
    }

    function displayReservations(type) {
    const reservationsGrid = document.getElementById('reservationsGrid');
    reservationsGrid.innerHTML = ''; // Limpiar contenedor
    let reservationsToDisplay = [];

    if (type === 'active') {
        reservationsToDisplay = allReservations.filter(res => res.RESERVAS_TERMINADA !== "TRUE");
        activeReservationsBtn.classList.add('active');
        finishedReservationsBtn.classList.remove('active');
    } else if (type === 'finished') {
        reservationsToDisplay = allReservations.filter(res => res.RESERVAS_TERMINADA === "TRUE");
        activeReservationsBtn.classList.remove('active');
        finishedReservationsBtn.classList.add('active');
    }

    currentTab = type; // Importante para que el filtro sepa qué tab está activo

    const fechaSeleccionada = document.getElementById('fecha-select')?.value;
    const filtradas = fechaSeleccionada
        ? reservationsToDisplay.filter(r => r.FECHA === fechaSeleccionada)
        : reservationsToDisplay;

    displayReservationsFromData(filtradas); // Llama a la nueva función que dibuja las tarjetas
}

    // Event Listeners for tabs
   
activeReservationsBtn.addEventListener('click', () => {
  displayReservations('active');
});


finishedReservationsBtn.addEventListener('click', () => {
  displayReservations('finished');
});



    // Cargar reservas al inicio
    fetchReservations();

    // Lógica para el dropdown del navbar (si aplica para este archivo)
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        dropdown.addEventListener('click', function(event) {
            this.querySelector('.dropdown-content').classList.toggle('show-dropdown');
            event.stopPropagation(); // Evita que el clic se propague al documento
        });
        // Cerrar el dropdown si se hace clic fuera
        window.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.querySelector('.dropdown-content').classList.remove('show-dropdown');
            }
        });
    }

    function displayReservationsFromData(data) {
    const reservationsGrid = document.getElementById('reservationsGrid');
    reservationsGrid.innerHTML = '';

    if (data.length === 0) {
        reservationsGrid.innerHTML = `<p class="empty-message">No hay reservas ${currentTab === 'active' ? 'activas' : 'terminadas'} para esta fecha.</p>`;
        return;
    }

    data = data.slice().reverse(); // Mostrar más nuevas arriba

    data.forEach(res => {
        const reservationCard = document.createElement('div');
        reservationCard.classList.add('reservation-card');

        const headerClass = currentTab === 'active' ? 'active-res' : 'finished-res';

        // Header de la tarjeta
        reservationCard.innerHTML += `
        <div class="card-header ${headerClass}">
            <div class="client-details">
                <h3>Reserva #${res.NRESERVA || 'N/A'} - ${res.NOMBRE_COMPLETO || 'N/A'}</h3>
                <p>Fecha: ${formatDateToDDMMAA(res.FECHA)} | Días Totales: ${res.DIAS || 'N/A'} | Vendedor: ${res.VENDEDOR || 'N/A'}</p>
            </div>
        </div>
        `;

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        // Estadísticas principales
        cardContent.innerHTML += `
            <div class="stat-group">
                <div class="stat-item">
                    <span class="stat-label">Monto Total Alquiler:</span>
                    <span class="stat-value">$${(res.MONTO_TOTAL_ALQUILER || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Monto Total Clases:</span>
                    <span class="stat-value">$${(res.MONTO_TOTAL_CLASES || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Descuento:</span>
                    <span class="stat-value">$${(res.DESCUENTO || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Monto Total Final:</span>
                    <span class="stat-valueMF">$${(res.MONTO_TOTAL_FINAL || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${res.SI_PAGO_TOTAL ? 'Pago Completo' : 'Monto Pagado'}:</span>
                    <span class="stat-valueMP">$${(res.MONTO_PAGADO || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Resta Pagar:</span>
                    <span class="stat-valueRP">$${(res.RESTA_PAGAR || 0).toLocaleString('es-AR')}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Moneda:</span>
                    <span class="stat-value">${res.TIPO_DE_MONEDA || "N/A"}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Método de Pago:</span>
                    <span class="stat-value">${res.METODO_DE_PAGO || res.METODO_DE_PAGO_REAL || res.METODO_DE_PAGO_DOLAR || 'N/A'}</span>
                </div>
            </div>
        `;

        // Detalle por PAX
        const paxDetailsSection = document.createElement('div');
        paxDetailsSection.classList.add('pax-details-section');
        paxDetailsSection.innerHTML = '<h4>Detalle por Pasajero:</h4>';

        const cantidadPasajeros = typeof res.CANTIDAD_PASAJEROS === 'number' ? res.CANTIDAD_PASAJEROS : parseInt(res.CANTIDAD_PASAJEROS) || 0;

        for (let i = 1; i <= cantidadPasajeros; i++) {
            const diasPax = res[`DIAS_PAX${i}`] || 0;
            const diasCumplidosPax = res[`DIAS_CUMPLIDOS_PAX${i}`] || 0;
            const diasRestantesPax = res[`DIAS_REST_PAX${i}`] !== undefined ? res[`DIAS_REST_PAX${i}`] : 'N/A';
            const isPaxFinished = diasRestantesPax === 0 && diasPax > 0;

            paxDetailsSection.innerHTML += `
                <div class="pax-item-detail">
                    <strong>PAX ${i}:</strong> ${res[`NOMBRE_PAX${i}`] || 'N/A'}<br>
                    <strong>Equipos:</strong> Tabla: ${res[`TABLAS_PAX${i}`] || 'N/A'}, Botas: ${res[`BOTAS_PAX${i}`] || 'N/A'}, Ropa: ${res[`ROPA_PAX${i}`] || 'N/A'}<br>
                    <strong>Clases:</strong> ${res[`CLASES_PAX${i}`] || 'N/A'}<br>
                    <strong>Monto Alquiler:</strong> $${(res[`MONTO_ALQUILER_PAX${i}`] || 0).toLocaleString('es-AR')}<br>
                    <strong>Monto Clase:</strong> $${(res[`MONTO_CLASE_PAX${i}`] || 0).toLocaleString('es-AR')}<br>
                    <div class="pax-days-status ${isPaxFinished ? 'finished' : ''}">
                        Días Totales: ${diasPax} | Días Cumplidos: ${diasCumplidosPax} | Días Restantes: ${diasRestantesPax}
                    </div>
                </div>
            `;
        }

        cardContent.appendChild(paxDetailsSection);
        reservationCard.appendChild(cardContent);
        reservationsGrid.appendChild(reservationCard);
    });
}

function initializeDateFilter() {
  const selectFecha = document.getElementById('fecha-select');
  const fechasUnicas = [...new Set(allReservations.map(r => r.FECHA))].sort((a, b) => new Date(b) - new Date(a));
  
  selectFecha.innerHTML = '<option value="">Todas</option>';
  fechasUnicas.forEach(fecha => {
    const option = document.createElement('option');
    option.value = fecha;
    option.textContent = formatDateToDDMMAA(fecha);
    selectFecha.appendChild(option);
  });

  selectFecha.addEventListener('change', () => {
  displayReservations(currentTab);
});


}

function formatDateToDDMMAA(dateString) {
    if (!dateString) {
        return 'N/A';
    }
    const date = new Date(dateString);
    
    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
        return 'Fecha inválida'; // O puedes devolver 'N/A' o el formato original si falla la conversión
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = String(date.getFullYear()).slice(-2); // Obtiene los últimos dos dígitos del año

    return `${day}/${month}/${year}`;
}

 // Cargar reservas al inicio
    fetchReservations();
});

