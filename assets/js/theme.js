$(document).ready(function () {
    const themeToggle = $('#theme-toggle');
    const themeIcon = $('#theme-icon'); 
    const body = $('body');
    const appBar = $('.app-bar');
    const appBar2 = $('.app-bar-2');
    const drawer = $('.drawer');
    const drawer_header = $('.drawer-header');
    const contenedorPrincipal = $('.contenedor-principal');
    const contenedorPrincipal2 = $('.contenedor-principal-2');
    const rectangle = $('.rectangle');
    const circle = $('.circle');
    const contenedorResultados = $('.contenedor-resultado');
    

    // Función para aplicar el modo oscuro
    function applyDarkMode() {
        body.addClass('dark-mode');
        appBar.addClass('dark-mode');
        appBar2.addClass('dark-mode');
        drawer.addClass('dark-mode');
        drawer_header.addClass('dark-mode');
        contenedorPrincipal.addClass('dark-mode');
        contenedorPrincipal2.addClass('dark-mode');
        rectangle.addClass('dark-mode');
        circle.addClass('dark-mode');
        contenedorResultados.addClass('dark-mode');
        $('.contenedor-resultado').each(function() {
            $(this).addClass('dark-mode');
        });
        themeIcon.attr('src', 'assets/img/medialuna.png'); // Cambia src a la imagen de la luna
        
        localStorage.setItem('theme', 'dark');
    }

    // Función para aplicar el modo claro
    function applyLightMode() {
        body.removeClass('dark-mode');
        appBar.removeClass('dark-mode');
        appBar2.removeClass('dark-mode');
        drawer.removeClass('dark-mode');
        drawer_header.removeClass('dark-mode');
        contenedorPrincipal.removeClass('dark-mode');
        contenedorPrincipal2.removeClass('dark-mode');
        rectangle.removeClass('dark-mode');
        circle.removeClass('dark-mode');
        contenedorResultados.removeClass('dark-mode');
        $('.contenedor-resultado').each(function() {
             $(this).removeClass('dark-mode');
        });
        themeIcon.attr('src', 'assets/img/sol.png'); // Cambia src a la imagen del sol
        localStorage.setItem('theme', 'light');
    }

    // Cargar el modo guardado al inicio
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.prop('checked', true);
        applyDarkMode();
    } else {
        applyLightMode();
    }

    // Escuchar cambios en el interruptor
    themeToggle.change(function () {
        if (this.checked) {
            applyDarkMode();
        } else {
            applyLightMode();
        }
    });
});