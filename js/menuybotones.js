// --- Navbar functionality for mobile and dropdowns ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const dropdownToggle = document.querySelector('.dropdown .dropbtn'); // El botón de "Clases"

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Cuando se abre/cierra el menú principal, asegúrate de cerrar cualquier dropdown abierto
        if (!navLinks.classList.contains('active')) {
            const openDropdownContent = document.querySelector('.dropdown-content.show-dropdown');
            if (openDropdownContent) {
                openDropdownContent.classList.remove('show-dropdown');
            }
        }
    });

    // Manejar el clic en el botón de dropdown "Clases"
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            const dropdownContent = dropdownToggle.nextElementSibling; // El div con las opciones de clases
            if (dropdownContent) {
                dropdownContent.classList.toggle('show-dropdown');
            }
        });
    }

    // Cerrar el menú principal si se hace clic en un enlace que NO ES un dropdown toggle
    navLinks.querySelectorAll('a:not(.dropbtn)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            // También cierra el dropdown si estaba abierto
            const openDropdownContent = document.querySelector('.dropdown-content.show-dropdown');
            if (openDropdownContent) {
                openDropdownContent.classList.remove('show-dropdown');
            }
        });
    });

    // Cerrar el dropdown si se hace clic fuera de él (solo para desktop si es necesario, en móvil el toggle ya lo controla)
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
            const openDropdowns = document.querySelectorAll('.dropdown-content.show-dropdown');
            openDropdowns.forEach(openDropdown => {
                openDropdown.classList.remove('show-dropdown');
            });
        }
    });
}