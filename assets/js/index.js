//funcion personalizado para retardo despues de escribir
$.fn.delayPasteKeyUp = function(tiempoEspera, callback) {
    var temporizador;
    return this.on('propertychange input', ()=>{
        clearTimeout(temporizador);

        temporizador = setTimeout(function() {
            if (typeof callback === 'function') {
                callback();
            }
        }, tiempoEspera);
    });
};

function cargarPalabras() {
    let contenedor = document.getElementById("contenedor-palabras");
    let cantidadPalabrasDiv = document.getElementById("cantidadPalabras");
    contenedor.innerHTML = `<img src="assets/img/load.gif" style="width: 2em;height: 2em;">`;
    let idiomaSeleccionado = document.getElementById("selectIdioma").value;

    let resultado = Android.cargarPalabras(idiomaSeleccionado);
    let datos = JSON.parse(resultado);
    contenedor.innerHTML = '';

    datos.forEach((palabra) => {
        // Crear un card para cada palabra
        const card = document.createElement("div");
        card.classList.add("palabra-card");

    // Crear el botón de favorito
        const favoritoButton = document.createElement('button');
        favoritoButton.classList.add('add-favorito-button');
        favoritoButton.classList.add('btn');
        favoritoButton.classList.add('btn-default');
        favoritoButton.innerHTML = '<span class="glyphicon glyphicon-star icono-agregar-favorito"></span>';
        favoritoButton.addEventListener('click', () => agregarAFavoritos(palabra.id_palabra));
        card.appendChild(favoritoButton);


        // Crear un div para el idioma seleccionado
        const idiomaDiv = document.createElement('div');
        idiomaDiv.classList.add('palabra-idioma');


        // Asignar color de fondo según el idioma
        switch (idiomaSeleccionado) {
            case "miskito":
                idiomaDiv.style.backgroundColor = "#f0f8ff";  // AliceBlue
                break;
            case "mayagna":
                idiomaDiv.style.backgroundColor = "#f0fff0"; // Honeydew
                break;
            case "espanol":
                idiomaDiv.style.backgroundColor = "#faebd7"; // AntiqueWhite
                break;
            case "ingles":
                idiomaDiv.style.backgroundColor = "#fff0f5"; // LavenderBlush
                break;
            default:
                idiomaDiv.style.backgroundColor = "#f5f5f5"; // WhiteSmoke
        }


        const idiomaH3 = document.createElement('h3');
        var idioamModif = idiomaSeleccionado;
        if (idioamModif === 'espanol') {
            idioamModif = 'español';
        }
        let idiomaLabel = idioamModif.charAt(0).toUpperCase() + idioamModif.slice(1); // Capitalizar la primera letra
        idiomaH3.textContent = idiomaLabel;
        idiomaDiv.appendChild(idiomaH3);

        const idiomaPalabraP = document.createElement('p');
        idiomaPalabraP.textContent = palabra[idiomaSeleccionado]; // Mostrar la palabra en el idioma seleccionado
        idiomaDiv.appendChild(idiomaPalabraP);

        const idiomaEjemploP = document.createElement('small');
        const ejemploKey = `ejemplo_${idiomaSeleccionado}`; // Construir la clave del ejemplo
        idiomaEjemploP.textContent = palabra[ejemploKey] ? `Ejemplo: ${palabra[ejemploKey]}` : 'Sin ejemplo'; // Mostrar ejemplo en idioma seleccionado si existe
        idiomaDiv.appendChild(idiomaEjemploP);

        card.appendChild(idiomaDiv);



        // Crear botón de traducciones
        const traduccionesButton = document.createElement('button');
        traduccionesButton.classList.add('btn', 'btn-primary', 'traducciones-button');
        traduccionesButton.textContent = 'Traducciones';
        traduccionesButton.addEventListener('click', () => mostrarTraducciones(palabra)); // Pasar la información de la palabra
        card.appendChild(traduccionesButton);



        contenedor.appendChild(card);
    });

    cantidadPalabrasDiv.textContent = `${datos.length}`;

}

function mostrarTraducciones(palabra) {

    // Obtener el idioma principal seleccionado
    let idiomaSeleccionado = document.getElementById("selectIdioma").value;
    var idiomaMod = idiomaSeleccionado;
    if (idiomaMod === 'espanol') {
        idiomaMod = 'español';
    }

    if (idiomaMod === 'ingles') {
        idiomaMod = 'inglés';
    }

    let idiomaLabel = idiomaMod.charAt(0).toUpperCase() + idiomaMod.slice(1);


    // Crear el modal
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade','modal-fullscreen');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    modal.appendChild(modalDialog);

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalDialog.appendChild(modalContent);

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalContent.appendChild(modalHeader);

    let modalTitle = document.createElement('label');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = `${palabra[idiomaSeleccionado]} (${idiomaLabel})`;
    modalHeader.appendChild(modalTitle);


    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalContent.appendChild(modalBody);


    // Orden de idiomas
    let idiomasOrdenados = [];
    if (palabra.miskito) idiomasOrdenados.push({nombre: "Miskito", datos: {palabra: palabra.miskito, ejemplo: palabra.ejemplo_miskito}});
    if (palabra.mayagna) idiomasOrdenados.push({nombre: "Mayagna", datos: {palabra: palabra.mayagna, ejemplo: palabra.ejemplo_mayagna}});
    if (palabra.espanol) idiomasOrdenados.push({nombre: "Español", datos: {palabra: palabra.espanol, ejemplo: palabra.ejemplo_espanol}});
    if (palabra.ingles) idiomasOrdenados.push({nombre: "Inglés", datos: {palabra: palabra.ingles, ejemplo: palabra.ejemplo_ingles}});




    idiomasOrdenados.forEach(idioma => {
    if (idioma.nombre.toLowerCase() !== idiomaMod.toLowerCase()) {
        const idiomaDiv = document.createElement('div');
        idiomaDiv.classList.add('palabra-idioma');

        // Asignar color de fondo según el idioma
        switch (idioma.nombre) {
            case "Miskito":
                idiomaDiv.style.backgroundColor = "#f0f8ff";  // AliceBlue
                break;
            case "Mayagna":
                idiomaDiv.style.backgroundColor = "#f0fff0"; // Honeydew
                break;
            case "Español":
                idiomaDiv.style.backgroundColor = "#faebd7"; // AntiqueWhite
                break;
            case "Inglés":
                idiomaDiv.style.backgroundColor = "#fff0f5"; // LavenderBlush
                break;
            default:
                idiomaDiv.style.backgroundColor = "#f5f5f5"; // WhiteSmoke
        }

        const idiomaH3 = document.createElement('h3');
        idiomaH3.textContent = idioma.nombre;
        idiomaDiv.appendChild(idiomaH3);

        const idiomaPalabraP = document.createElement('p');
        idiomaPalabraP.textContent = idioma.datos.palabra;
        idiomaDiv.appendChild(idiomaPalabraP);

        const idiomaEjemploP = document.createElement('small');
        idiomaEjemploP.textContent = idioma.datos.ejemplo ? `Ejemplo: ${idioma.datos.ejemplo}` : 'Sin ejemplo';
        idiomaDiv.appendChild(idiomaEjemploP);

        modalBody.appendChild(idiomaDiv);
        }
    });


    // Agrega el modal al body y muestra
    document.body.appendChild(modal);
    $(modal).modal('show');

    // Eliminar el modal del DOM al cerrarlo
    $(modal).on('hidden.bs.modal', function () {
        modal.remove();
    });
}

function agregarAFavoritos(idPalabra) {
    var idioma = document.getElementById("selectIdioma").value;
    var idiomaMod = idioma;
    if (idiomaMod ==='espanol') {
        idiomaMod = 'español';
    }
    alertify.confirm(
        "AGREGAR A FAVORITOS",
        `¿Quieres agregar la palabra en ${idiomaMod} a favoritos?`,
        function () {
            var resultadoJson = Android.agregarAFavoritos(parseInt(idPalabra),idioma);
            try {
                let resultado = JSON.parse(resultadoJson);
                if (resultado.status === "success") {
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.notify('Se agrego a favoritos','default',4);
                } else if (resultado.status === "validation") {
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.notify('Ya esta en favoritos','default',4);
                } else if(resultado.status === "error") {
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.notify('Error al guardar','default',4);
                } else {
                    console.error("Error: Resultado desconocido " + resultado);
                }
            } catch (e) {
                console.error("Error al parsear JSON: " + e);
            }
        },
        function () {
            
        }
    ).set('labels', {ok: 'SI', cancel: 'NO'})
    .set('transition', 'zoom');
}

$('#inputBusqueda').delayPasteKeyUp(400, function() {
    let idiomaSeleccionado = document.getElementById("selectIdioma").value;
    let palabra = document.getElementById("inputBusqueda").value.trim();

    if (palabra.length > 0) {
        let contenedor = document.getElementById("contenedor-palabras");
        contenedor.innerHTML = `<img src="assets/img/load.gif" style="width: 2em;height: 2em;">`;
        let resultado = Android.buscarPalabra(idiomaSeleccionado, palabra);
         try {
            contenedor.innerHTML = '';
            var resultados = JSON.parse(resultado);

            if (resultados == "Idioma inválido") {
                contenedor.innerHTML = "<h4>" + resultados + "</h4>";
            } else if (resultados == "Ha ocurrido un error al buscar") {
                contenedor.innerHTML = "<h4>" + resultados + "</h4>";
            } else if (resultados.resultado == "con") {

                    // Crear un card para cada palabra
                   const card = document.createElement("div");
                    card.classList.add("palabra-card");
                    card.style.maxHeight = "18em"; // Establecer una altura máxima para la card
                 // Crear el botón de favorito
                    const favoritoButton = document.createElement('button');
                    favoritoButton.classList.add('add-favorito-button');
                    favoritoButton.classList.add('btn');
                    favoritoButton.classList.add('btn-default');
                    favoritoButton.innerHTML = '<span class="glyphicon glyphicon-star icono-agregar-favorito"></span>';
                    favoritoButton.addEventListener('click', () => agregarAFavoritos(resultados.id_palabra));
                    card.appendChild(favoritoButton);



                   // Crear un div para el idioma seleccionado
                    const idiomaDiv = document.createElement('div');
                    idiomaDiv.classList.add('palabra-idioma');


                    // Asignar color de fondo según el idioma
                    switch (idiomaSeleccionado) {
                        case "miskito":
                            idiomaDiv.style.backgroundColor = "#f0f8ff";  // AliceBlue
                            break;
                        case "mayagna":
                            idiomaDiv.style.backgroundColor = "#f0fff0"; // Honeydew
                            break;
                        case "espanol":
                            idiomaDiv.style.backgroundColor = "#faebd7"; // AntiqueWhite
                            break;
                        case "ingles":
                            idiomaDiv.style.backgroundColor = "#fff0f5"; // LavenderBlush
                            break;
                        default:
                            idiomaDiv.style.backgroundColor = "#f5f5f5"; // WhiteSmoke
                    }

                     const idiomaH3 = document.createElement('h3');
                    var idioamModif = idiomaSeleccionado;
                    if (idioamModif === 'espanol') {
                       idioamModif = 'español';
                   }
                   let idiomaLabel = idioamModif.charAt(0).toUpperCase() + idioamModif.slice(1); // Capitalizar la primera letra
                    idiomaH3.textContent = idiomaLabel;
                     idiomaDiv.appendChild(idiomaH3);


                    const idiomaPalabraP = document.createElement('p');
                   idiomaPalabraP.textContent = resultados[idiomaSeleccionado]; // Mostrar la palabra en el idioma seleccionado
                    idiomaDiv.appendChild(idiomaPalabraP);

                   const idiomaEjemploP = document.createElement('small');
                    const ejemploKey = `ejemplo_${idiomaSeleccionado}`; // Construir la clave del ejemplo
                    idiomaEjemploP.textContent = resultados[ejemploKey] ? `Ejemplo: ${resultados[ejemploKey]}` : 'Sin ejemplo'; // Mostrar ejemplo en idioma seleccionado si existe
                     idiomaDiv.appendChild(idiomaEjemploP);

                  card.appendChild(idiomaDiv);


                    // Crear botón de traducciones
                     const traduccionesButton = document.createElement('button');
                    traduccionesButton.classList.add('btn', 'btn-primary', 'traducciones-button');
                    traduccionesButton.textContent = 'Traducciones';
                     traduccionesButton.addEventListener('click', () => mostrarTraducciones(resultados)); // Pasar la información de la palabra
                    card.appendChild(traduccionesButton);


                contenedor.appendChild(card);


            } else if (resultados.resultado == "sin") {
                 contenedor.innerHTML = "<h4>Sin resultados.</h4>";
             }
        } catch (error) {
              console.error("Error al analizar o mostrar JSON: ", error);
              contenedor.innerHTML = "<h4>Error al procesar la respuesta.</h4>";
         }

    } else {
        cargarPalabras();
    }
});


// Función para ordenar los idiomas
function ordenarIdiomas(idiomas, idiomaPrincipal) {
    const orden = ["Miskito", "Mayagna", "Español", "Inglés"];

    if (idiomaPrincipal === "miskito") {
    return [...idiomas.filter(i => i.nombre === "Miskito"), ...idiomas.filter(i => i.nombre !== "Miskito")];
    }else if (idiomaPrincipal === "mayagna") {
        return [...idiomas.filter(i => i.nombre === "Mayagna"), ...idiomas.filter(i => i.nombre !== "Mayagna")];
    }else if (idiomaPrincipal === "espanol") {
        return [...idiomas.filter(i => i.nombre === "Español"), ...idiomas.filter(i => i.nombre !== "Español")];
    } else if (idiomaPrincipal === "ingles"){
        return [...idiomas.filter(i => i.nombre === "Inglés"), ...idiomas.filter(i => i.nombre !== "Inglés")];
    } else {
        return idiomas; // Si el idioma principal no es uno de los 4, mantener el orden original
    }
}

cargarPalabras();

document.getElementById('selectIdioma').addEventListener('change', function() {
    let selectedValue = document.getElementById('selectIdioma').value;
    const inputElement = document.getElementById('inputBusqueda');
    cargarPalabras();
    if (selectedValue === 'miskito') {
        inputElement.placeholder = 'Busqueda en miskito';
    } else if (selectedValue === 'mayagna') {
        inputElement.placeholder = 'Busqueda en mayagna';
    } else if (selectedValue === 'espanol') {
         inputElement.placeholder = 'Busqueda en español';
    } else if (selectedValue === 'ingles') {
         inputElement.placeholder = 'Busqueda en ingles';
    } else {
        inputElement.placeholder = "Buscar";
    }
});

function salirApp(){
    alertify.confirm(
        "SALIR",
        "¿Estás seguro de salir de la aplicacion?",
        function () {
            Android.cerrarApp();
        },
        function () {
            
        }
    ).set('labels', {ok: 'SI', cancel: 'NO'})
    .set('transition', 'zoom');
}


function setupScrollToTopButton() {
    const contenedorPalabras = document.getElementById("contenedor-palabras");
    const scrollToTopButton = document.createElement("button");
  
    //Configuracion del boton
    scrollToTopButton.classList.add("scroll-to-top-button", "btn", "btn-default");
    scrollToTopButton.innerHTML = '<span class="glyphicon glyphicon-arrow-up"></span>';
    scrollToTopButton.style.display = "none"; // Inicialmente oculto
  
    document.body.appendChild(scrollToTopButton);
  
  
    // Agrega el evento scroll al contenedor
    contenedorPalabras.addEventListener("scroll", () => {
      if (contenedorPalabras.scrollTop > 200) {
        scrollToTopButton.style.display = "block";
      } else {
        scrollToTopButton.style.display = "none";
      }
    });
  
    // Agrega la funcion de subir al inicio al click
    scrollToTopButton.addEventListener("click", () => {
      contenedorPalabras.scrollTo({ top: 0, behavior: "smooth" });
    });
  
  
    // Estilos CSS
    const style = document.createElement('style');
      style.textContent = `
        .scroll-to-top-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
           display: none; /* Inicialmente oculto */
  
        }
      `;
       document.head.appendChild(style);
    }
  
  // Llama a la función cuando el DOM esté cargado
  document.addEventListener('DOMContentLoaded', setupScrollToTopButton);
