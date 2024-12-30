function irAtras() {
    window.history.back(); 
}

function cargarFavoritos() {
    let contenedor = document.getElementById("contenedor-palabras");
    let vaciarBtnDiv = document.getElementById("vaciarbtn"); 

    contenedor.innerHTML = `<img src="assets/img/load.gif" style="width: 2em;height: 2em;">`;
    if (vaciarBtnDiv){
        vaciarBtnDiv.innerHTML = ""; 
    }


    let resultado = Android.cargarFavoritos();
    let datos = JSON.parse(resultado);
    contenedor.innerHTML = '';


    if (datos && datos.length > 0) {
        //Hay favoritos
    if (vaciarBtnDiv){
            vaciarBtnDiv.innerHTML = `<span onclick="vaciarFavoritos();" class="glyphicon glyphicon-trash"></span>`;
    }
        datos.forEach((favorito) => {
            const card = document.createElement("div");
                card.classList.add("palabra-card");

                // Crear el botón de favorito
                const favoritoButton = document.createElement('button');
                favoritoButton.classList.add('favorito-button');
                favoritoButton.classList.add('btn');
                favoritoButton.classList.add('btn-danger');
                favoritoButton.innerHTML = '<span class="glyphicon glyphicon-trash icono-eliminar-favorito"></span> ';
                favoritoButton.addEventListener('click', () => eliminarFavorito(favorito.id_favorito));
                card.appendChild(favoritoButton);

                const idiomaDiv = document.createElement('div');
                idiomaDiv.classList.add('palabra-idioma');

                // Asignar color de fondo según el idioma
                switch (favorito.idioma_favorito) {
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
                var idiomaLabel = favorito.idioma_favorito;
                if (idiomaLabel === 'espanol') {
                    idiomaLabel = 'español';
                }
                idiomaLabel = idiomaLabel.charAt(0).toUpperCase() + idiomaLabel.slice(1);
                idiomaH3.textContent = idiomaLabel;
                idiomaDiv.appendChild(idiomaH3);

                const idiomaPalabraP = document.createElement('p');
                idiomaPalabraP.textContent = favorito[favorito.idioma_favorito]; // Mostrar la palabra en el idioma del favorito
                idiomaDiv.appendChild(idiomaPalabraP);

                const idiomaEjemploP = document.createElement('small');
                // Construir la clave del ejemplo
                const ejemploKey = `ejemplo_${favorito.idioma_favorito}`;
                idiomaEjemploP.textContent = favorito[ejemploKey] ? `${favorito[ejemploKey]}` : 'Sin ejemplo';
                idiomaDiv.appendChild(idiomaEjemploP);
                
                card.appendChild(idiomaDiv);
                contenedor.appendChild(card);
        });

    } else {
    //No hay favoritos
    if (vaciarBtnDiv){
            vaciarBtnDiv.innerHTML = "";
    }
    contenedor.innerHTML = '<p>No hay favoritos agregados.</p>';

    }
}

cargarFavoritos();

function eliminarFavorito(id) {

    alertify.confirm(
        "QUITAR FAVORITO",
        `¿Quieres quitar de favoritos?`,
        function () {
            let jsonResult = Android.eliminarFavorito(id);
            let result = JSON.parse(jsonResult);
            if (result.status === 'success') {
                alertify.set('notifier', 'position', 'top-center');
                alertify.notify('Se ha quitado de favoritos','default',3);
                cargarFavoritos();
            } else {
                alertify.set('notifier', 'position', 'top-center');
                alertify.notify('Error al quitar de favoritos','default',3);
            }
        },
        function () {
            
        }
    ).set('labels', {ok: 'SI', cancel: 'NO'}).set('transition', 'zoom');

}

function vaciarFavoritos() {

    alertify.confirm(
        "VACIAR FAVORITOS",
        `¿Quieres vaciar favoritos?`,
        function () {
            let jsonResult = Android.vaciarFavoritos();
            let result = JSON.parse(jsonResult);
            if (result.status === 'success') {
                alertify.set('notifier', 'position', 'top-center');
                alertify.notify('Se ha vaciado los favoritos','default',3);
                cargarFavoritos();

            } else {
                alertify.set('notifier', 'position', 'top-center');
                alertify.notify('Error al vaciar favoritos','default',3);
            }
        },
        function () {
            
        }
    ).set('labels', {ok: 'SI', cancel: 'NO'}).set('transition', 'zoom');

}