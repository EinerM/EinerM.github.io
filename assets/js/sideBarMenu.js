let startX = 0;
let currentX = 0;
let isDragging = false;
let ignoreTouch = false;

const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const menuButton = document.querySelector('.menu-button');
let drawerOpen = false;

// Función para abrir el drawer
function openDrawer() {
    drawerOpen = true;
    drawer.classList.add('open');
    overlay.classList.add('active');
    menuButton.textContent = '✕';
    drawer.style.left = '';
}

// Función para cerrar el drawer
function closeDrawer() {
    drawerOpen = false;
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    menuButton.textContent = '☰';
    drawer.style.left = '';
}

// Alternar el drawer
function toggleDrawer() {
    if (!isDragging) {
        ignoreTouch = true; // Bloquea gestos táctiles temporalmente
        drawerOpen ? closeDrawer() : openDrawer();
        setTimeout(() => (ignoreTouch = false), 300); // Reactiva gestos táctiles tras 300ms
    }
}

// Eventos de clic para el botón y el overlay
menuButton.addEventListener('click', toggleDrawer);
overlay.addEventListener('click', closeDrawer);

// Eventos táctiles
document.addEventListener('touchstart', (e) => {
    if (ignoreTouch) return; // Ignora gestos táctiles si se activó el clic del botón

    // Evita iniciar el gesto táctil si se toca cerca del botón
    const target = e.target;
    if (target === menuButton || menuButton.contains(target)) {
        return;
    }

    startX = e.touches[0].clientX;
    isDragging = startX < 50 || drawerOpen;
    drawer.style.transition = 'none';
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging || ignoreTouch) return; // Ignora si no se está arrastrando o si está bloqueado
    currentX = e.touches[0].clientX;
    const translateX = Math.min(0, currentX - 250);
    if (!drawerOpen) drawer.style.left = `${translateX}px`;
});

document.addEventListener('touchend', (e) => {
    if (!isDragging || ignoreTouch) return; // Ignora si no se estaba arrastrando o si está bloqueado
    isDragging = false;
    drawer.style.transition = '';

    const threshold = 80; // Umbral del gesto (en píxeles)
    if (currentX - startX > threshold) {
        openDrawer();
    } else if (currentX - startX < -threshold) {
        closeDrawer();
    } else {
        drawer.style.left = '';
    }
});
