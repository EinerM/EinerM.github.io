
$('.select').select2({
	placeholder: "Categoria",
	//allowClear: true
});


function formatoHora(hora) { 
 var split = hora.split(':');

 var h = split[0];

if (parseInt(h)>12) {
	var meridiano = 'PM';

	if (h=='13') {h= '01';}
	if (h=='14') {h= '02';}
	if (h=='15') {h= '03';}
	if (h=='16') {h= '04';}
	if (h=='17') {h= '05';}
	if (h=='18') {h= '06';}
	if (h=='19') {h= '07';}
	if (h=='20') {h= '08';}
	if (h=='21') {h= '09';}
	if (h=='22') {h= '10';}
	if (h=='23') {h= '11';}

}else if(h=='00'){
	meridiano = 'AM';
	h = '12';
}else{
	meridiano = 'AM';
}

 var m = split[1];
 var s = split[2];
 
 return h+':'+m+':'+s+' '+meridiano; 
 
}


//Formatea fecha a Dia-Mes-Año
function formatoFecha(texto){
  return texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
}

//Funsion que formatea numero
function formateaNumero(num){
   return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
   
}

function quitaComas(num){
	return num.replace(/,/g, "");
}

//Funsion para utilizar lector de codigo de barra
$.fn.delayPasteKeyUp = function(fn, ms){
	var timer = 0;
	$(this).on('propertychange input', function(){
		clearTimeout(timer);
		timer = setTimeout(fn, ms);

	});
};

$('.select').select2({
	placeholder: "Seleccionar",
	//allowClear: true
});

$('#descuento').select2({});
function resetDescuento(){
	$('#descuento').val(0).trigger("change");
}

function resetSelect2(){
	$('.select').val(null).trigger("change").trigger("change");
}

/*Script para Usuario*/
$(function(){
	
		$('#nuevo_registro').on('click',function(){
		$('#formularioCliente')[0].reset();
		reseteaTodo();
		$('#reg').show();
		$('#ModVenta').modal({
			show:true,
			backdrop:'static'
		});
		setTimeout(function(){document.getElementById('dropdownProducto').focus();},500);
	});
	
	$('#busquedaVenta').delayPasteKeyUp(function(){
		var dato = $('#busquedaVenta').val();
		var url = $('#base_url').val()+'venta/busca_venta';
		$.ajax({
			type:'POST',
			url:url,
			data:{dato:dato},
			beforeSend: function(){
				$('#datosVenta').html(`<div style="text-align:center;"><i style="font-size:20px;" class="fa fa-spinner fa-spin"></i><br>Buscando</div>`);
			},
			success: function(datos){
				$('#datosVenta').html(datos);
			}
		});
		return false;
	});

	$('#busquedaVenta2').delayPasteKeyUp(function(){
		var dato = $('#busquedaVenta2').val();
		var url = $('#base_url').val()+'venta/busca_venta2';
		$.ajax({
			type:'POST',
			url:url,
			data:{dato:dato},
			beforeSend: function(){
				$('#datosVenta2').html(`<div style="text-align:center;"><i style="font-size:20px;" class="fa fa-spinner fa-spin"></i><br>Buscando</div>`);
			},
			success: function(datos){
				$('#datosVenta2').html(datos);
			}
		});
		return false;
	});
	
});

function abreModalCliente(){
	$('#ncliente').val('');
	$('#dataContent').html('');

	$('#buscaCliente').modal({
		show:true,
		backdrop:'static'
	});
	
	setTimeout(function(){document.getElementById('ncliente').focus();},500);	
}


$('#ncliente').delayPasteKeyUp(function(){
	var data = $('#ncliente').val();

	if (data.length>0) {
		$.ajax({
			type:'post',
			url:$('#base_url').val()+'venta/extrae_clientes_por_nombre',
			data:'ncliente='+data,
			beforeSend:function(){
				$('#dataContent').html(`<p style="text-align:center;"><i class="fa fa-spinner fa-spin"></i> Buscado<p>`);
			},
			success:function(respuesta){
				$('#dataContent').html(respuesta);
			}
		});

	}else{
		$('#dataContent').html('');
	}

});


function pegaCliente(id, nombres){
  if (nombres == 'Cliente Particular' && id == 1) {

  		alertify.confirm('Aviso','¿Quieres cambiar a Cliente Particular?', function(e){
			if(e){
				
				$('#id_cliente').val(id);
  				$('#nombreClienteVenta').val(nombres);
  				$('#buscaCliente').modal('hide');
			
			}else{
				return false;
			}
	
	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'});

  }else{
  	$('#id_cliente').val(id);
  	$('#nombreClienteVenta').val(nombres);

  	$('#buscaCliente').modal('hide');
  }

}

//Busqueda mediante el codigo de barra del prducto
$('#codigoBarra').delayPasteKeyUp(function(){
	var codigo = $('#codigoBarra').val();
    
	if (codigo.length>0) {
		$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/buscar_por_codigo_barra',
		data:{codigo:codigo},
		success:function(respuesta){
			var array = eval(respuesta);
			if (array[0]=='0') {

				$('#id_articulo').val('');
				$('#dropdownProducto').val('');
				$('#precio').val('');
				$('#medida').html(`<option>Seleccionar</option>`);
				$('#existencia').val('');
				$('#existenciaFront').val('');
		    	$('#cantidad').val('');
		    	$('#precioTotal').val('');


		    	$('#medida').attr({disabled:'disabled'});
		        $('#cantidad').attr({disabled:'disabled'});
		        $('#precio').attr({disabled:'disabled'});

			}else if(array[0]=='1'){
				
				$('#id_articulo').val(array[1][0].id_articulo);
				$('#dropdownProducto').val(array[1][0].nombre);
				$('#medida').html(array[2]);
				$('#inventariado').val(array[1][0].inventariado);
				if (array[1][0].inventariado == 'Si') {
					$('#existenciaFront').css('display','block');
					$('#existencia').val(array[1][0].stock);
				}else if(array[1][0].inventariado == 'No'){
					$('#existenciaFront').css('display','none');
				}

				$('#existenciaFront').val(array[1][0].stock);
    			$('#cantidad').removeAttr('disabled');
    			//$('#precio').removeAttr('disabled');
    			$('#medida').removeAttr('disabled');
    			$('#medida').val(array[3]).trigger("change");

			} 
			

		}

	    });

	}else{
		$('#id_articulo').val('');
		$('#dropdownProducto').val('');
		$('#precio').val('');
		$('#medida').html(`<option>Seleccionar</option>`);
		$('#existencia').val('');
		$('#existenciaFront').val('');
    	$('#cantidad').val('');
    	$('#precioTotal').val('');


    	$('#medida').attr({disabled:'disabled'});
        $('#cantidad').attr({disabled:'disabled'});
        $('#precio').attr({disabled:'disabled'});

	}

}, 200);
//Fin


$('#medida').change(function(){

	document.getElementById('cantidad').value = '';
	$('#precioTotal').val('');
	var id_articulo = $('#id_articulo').val();
	var inventariado = $('#inventariado').val();
	var splited = $('#medida').val().split('_');
	var medida = splited[0];
	$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/precio_medida',
		data:{id_articulo:id_articulo,medida:medida,inventariado:inventariado},
		beforeSend: function(){
			
		},
		success: function(respuesta){
			document.getElementById('cantidad').focus();
			var array = eval(respuesta);
			$('#existencia').val(array[0]);
			$('#precio').val(array[1]);
			$('#existenciaFront').val(array[0]+' '+array[2]);

			if (inventariado=='Si') {
				if (parseFloat(array[3])>0 && parseFloat(array[0])<=parseFloat(array[3]) && parseFloat(array[0])>0) {
					alertify.set('notifier','position', 'top-right');
					alertify.notify(`<b>Existencia por debajo del mínimo, hacer nuevo pedido.</b>`, 'default', 4);
		
				}
			}else{

			}
			
		}
	});
});


$('#dropdownProducto').focus(function(e){$('.dropdown').addClass('open');});
$('#productList').click(function(e){$('.dropdown').removeClass('open');});
$('input[type=text]').click(function(e){$('.dropdown').removeClass('open');});
$('th').click(function(e){$('.dropdown').removeClass('open');});
$('.form-group').click(function(e){$('.dropdown').removeClass('open');});

//Busqueda mediante el nombre del producto
$('#dropdownProducto').delayPasteKeyUp(function(){
	var data = $('#dropdownProducto').val();

	if (data.length>0) {
		$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/buscar_por_nombre',
		data:'productoN='+data,
		beforeSend:function(){
			$('#ListadoProducto').html(`
					<p style="font-size:14px;text-align:center;">
        				<i class="fa fa-spinner fa-spin"></i>
        				Buscando
        			</p>
				`);
		},
		success:function(respuesta){

			$('#ListadoProducto').html(respuesta);

		}
	    });

	}else{
		$('#id_articulo').val('');
		$('#ListadoProducto').html('');
		$('#codigoBarra').val('');
		$('#dropdownProducto').val('');
		$('#precio').val('');
		$('#existencia').val('');
		$('#medida').html(`<option>Seleccionar</option>`);
		$('#id_UnMedida').val('');
    	$('#cantidad').val('');
    	$('#precioTotal').val('');


    	$('#medida').attr({disabled:'disabled'});
        $('#cantidad').attr({disabled:'disabled'});
        $('#precio').attr({disabled:'disabled'});
	}

});
//Fin 


function pegaArticulo(id,nombre){

	//$('#id_articulo').val(id);
	//$('#codigoBarra').val(codigo);
    //$('#dropdownProducto').val(nombre);
    $('#cantidad').removeAttr('disabled');
    //$('#precio').removeAttr('disabled');
    

    $('#precio').val('');
    $('#cantidad').val('');
    $('#precioTotal').val('');

	$.ajax({
		type:'POST',
		url:$('#base_url').val()+'venta/extrae_articulos',
		data:'id_articulo='+id,
		success: function(registro){
			$('.dropdown').removeClass('open');
			var array = eval(registro);
			if (array[0]=='0') {

				$('#id_articulo').val('');
				$('#dropdownProducto').val('');
				$('#precio').val('');
				$('#medida').html(`<option>Seleccionar</option>`);
				$('#existencia').val('');
				$('#existenciaFront').val('');
		    	$('#cantidad').val('');
		    	$('#precioTotal').val('');


		    	$('#medida').attr({disabled:'disabled'});
		        $('#cantidad').attr({disabled:'disabled'});
		        $('#precio').attr({disabled:'disabled'});

			}else{
				
				$('#id_articulo').val(array[1][0].id_articulo);
				$('#codigoBarra').val(array[1][0].codigo_barra);
				$('#dropdownProducto').val(array[1][0].nombre);
				$('#medida').html(array[2]);
				$('#inventariado').val(array[1][0].inventariado);
				if (array[1][0].inventariado == 'Si') {
					$('#existenciaFront').css('display','block');
					$('#existencia').val(array[1][0].stock);
				}else if(array[1][0].inventariado == 'No'){
					$('#existenciaFront').css('display','none');
				}
				
    			$('#cantidad').removeAttr('disabled');
    			//$('#precio').removeAttr('disabled');
    			$('#medida').removeAttr('disabled');
    			$('#medida').val(array[3]).trigger("change");
			} 
			
			document.getElementById('cantidad').focus();
			return false;
			
		}
	});
	return false;

}

//Funcion para cerrar el modal de busqueda de cliente por nombre en la vista de venta
function cerrarMcliente(){
	$('#buscaCliente').modal('hide');
}
//Fin

//Funcion para cerrar el modal de registro de clientes en la vista de venta
function cerrarMregCliente(){
	$('#ModCliente').modal('hide');
}
//Fin


function cerrarMeditCliente(){
	$('#ModClienteEdi').modal('hide');
}

function abrirMregCliente(){
	$('#nombre').val('');
	$('#ModCliente').modal({
		show:true,
		backdrop:'static'
	});
}

function modalEditaCliente(id_cliente){
	$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/get_cliente',
		data:{id_cliente:id_cliente},
		beforeSend: function(){
			$('#ModNotify').modal({
				show:true,
				backdrop:'static'
			});
		},
		success: function(respuesta){
			$('#ModNotify').modal('hide');
			var array = eval(respuesta);
			if (array[0]=='1') {
				$('#id_cliente_edi').val(id_cliente);
				$('#nombreEdi').val(array[1]['nombres']);
				$('#sexoEdi').val(array[1]['sexo']);
				$('#ModClienteEdi').modal({
					show:true,
					backdrop:'static'
				});
			}else{
				alertify.set('notifier','position', 'top-center');
				alertify.notify('Error', 'success', 3);
			}
			
		}
	});
}


//Funcion para agregar cliente desde la vista de venta
function agregaCliente(){
	var nombre = $('#nombre').val();
	var sexo = $('#sexo').val();
	$.ajax({
		type:'POST',
		url:$('#base_url').val()+'venta/agrega_cliente',
		data:$('#formularioCliente').serialize(),
		beforeSend: function(){
			$('#ModNotify').modal({
				show:true,
				backdrop:'static'
			});
		},
		success: function(registro){
			$('#ModNotify').modal('hide');
			var array = eval(registro);

			if (array[0]=='1') {
				$('#formularioCliente')[0].reset();
				$('#id_cliente').val(array[1]['id_cliente']);
				$('#nombreClienteVenta').val(array[1]['nombres']);
				cerrarMregCliente();
				cerrarMcliente();
				alertify.set('notifier','position', 'top-center');
				alertify.notify('Se agrego el nuevo cliente', 'success', 3);
				
			}else if(array[0]=='error'){
				alertify.alert('Alerta!',array[1]).set({transition:'zoom'});
			}else if(array[0]=='0'){
				alertify.set('notifier','position', 'top-center');
				alertify.notify(array[1], 'success', 3);
			}

			return false;
			
		}
	});
	return false;
}
//Fin

//Funcion para editar cliente desde la vista de venta
function editaCliente(){
	var nombre = $('#nombre').val();
	var sexo = $('#sexo').val();
	$.ajax({
		type:'POST',
		url:$('#base_url').val()+'venta/edita_cliente',
		data:$('#formularioClienteEdi').serialize(),
		beforeSend: function(){
			$('#ModNotify').modal({
				show:true,
				backdrop:'static'
			});
		},
		success: function(registro){
			$('#ModNotify').modal('hide');
			var array = eval(registro);
			if (array[0]=='1') {

				alertify.set('notifier','position', 'top-center');
				alertify.notify('Se cambiaron los datos del cliente', 'success', 3);
				
			}else if(array[0]=='error'){
				alertify.alert('Alerta!',array[1]).set({transition:'zoom'});
			}else if(array[0]=='0'){
				alertify.set('notifier','position', 'top-center');
				alertify.notify(array[1], 'success', 3);
			}

			return false;
			
		}
	});
	return false;
}
//Fin



function eliminaCliente(id_cliente){
	alertify.confirm('Alerta!','¿Quieres eliminar este cliente?', function(e){
		if(e){
			$.ajax({
				type:'post',
				url:$('#base_url').val()+'venta/elimina_cliente',
				data:{id_cliente:id_cliente},
				beforeSend: function(){
					$('#ModNotify').modal({
						show:true,
						backdrop:'static'
					});
				},
				success: function(respuesta){
					$('#ModNotify').modal('hide');
					var array = eval(respuesta);
					if (array[0]=='1') {
						$('#dataContent').html('');
						alertify.set('notifier','position', 'top-center');
						alertify.notify(array[1], 'success', 3);
					}else{
						alertify.alert('Error',array[1]).set({transition:'zoom'});
					}
				}
			});
			
		}else{
			return false;
		}
	
	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'});
}


//calcula el total precio{

//Al ingresar la cantidad
$('#cantidad').delayPasteKeyUp(function(){
	var totalP = $('#cantidad').val() * $('#precio').val();

	$('#precioTotal').val(totalP.toFixed(2));
});

//Al ingresar el precio
$('#precio').delayPasteKeyUp(function(){
	var totalP = $('#cantidad').val() * $('#precio').val();

	$('#precioTotal').val(totalP.toFixed(2));
});

//Fin }


//Funsiones y scripts para agregar los productos temporalmente {

    var productos = [];

	//agrega poducto temporal
	$('#formAgregaProductTemp').submit(function(e){
	  e.preventDefault();
	//Recupera los datos
	var id_articulo = $('#id_articulo').val();
	var nombreProducto = $('#dropdownProducto').val();
	var codigoBarra = $('#codigoBarra').val();
	var cantidad = parseFloat($('#cantidad').val());
	cantidad = cantidad.toFixed(2);
	//Separamos la unidad de medida y la equivalencia que viene juntos en el value del option{
	var dtMedida = $('#medida').val();
	var splitedArray = dtMedida.split('_');
	var medida = splitedArray[0];
	var equivalencia = parseFloat(splitedArray[1]);
	var cantidadTotal = cantidad*equivalencia;
	//}
	var nombreMedida = $(`option[value="${dtMedida}"]`).html();
	var inventariado = $('#inventariado').val();
	var stock = parseFloat($('#existencia').val());
	var precio = parseFloat($('#precio').val());
	var precioTotal = $('#precioTotal').val();

	//Valida los campos 
	if (codigoBarra == '') {
		alertify.alert('Aviso', 'Ingrese el codigo del producto').set({transition:'zoom'});

	}else if ($('#id_articulo').val()=='') {
		alertify.alert('Aviso', 'Seleccione un producto').set({transition:'zoom'});

	}else if ($('#medida').val()=='') {
		alertify.alert('Aviso', 'Seleccione unidad de medida').set({transition:'zoom'});
	}else if ($('#existencia').val()== 0.00 && inventariado =='Si') {
		alertify.alert('Aviso', 'El producto ya no hay en existencia').set({transition:'zoom'});
	}else if((cantidad*equivalencia)>stock && inventariado=='Si'){
		alertify.alert('Aviso', 'La cantidad a vender supera la existencia').set({transition:'zoom'});
	}else if($('#precio').val()==''){
		alertify.alert('Aviso', 'Digite el precio del producto').set({transition:'zoom'});
	}else if($('#cantidad').val()==''){
		alertify.alert('Aviso', 'Digite la cantidad de producto').set({transition:'zoom'});

	}else if(isNaN(cantidad)){
		alertify.alert('Aviso', 'La cantidad debe ser numerico').set({transition:'zoom'});

	}else if(isNaN(precio)){
		alertify.alert('Aviso', 'El precio debe ser numerico').set({transition:'zoom'});

	}else if(isNaN(precioTotal)){
		alertify.alert('Aviso', 'Error al calcular precio total (El campo cantidad y precio no debe contener "," coma como separador de decimales )').set({transition:'zoom'});

	}else if(cantidad == 0){
		alertify.alert('Aviso', 'La cantidad no debe ser igual a cero (0)').set({transition:'zoom'});

	}else if(precio == 0){
		alertify.alert('Aviso', 'El precio no debe ser igual a cero (0)').set({transition:'zoom'});

	}else{
	// Si no hay herrores se procesa los datos


		//llamada ajax para actualizar los precios desde la vista de ventas
			/*$.ajax({
				type:'POST',
				url:$('#base_url').val()+'venta/actualiza_precio',
				data:{id_articulo:id_articulo,medida:medida,precio:precio},
				success: function(registro){
					if (registro=='1') {*/

						//Evalua que no se agregue el producto que ya esta agregado
						var existe = productos.some(item =>{
							return item.id_articulo == id_articulo && item.medida == medida
						});

						if (existe) {
							var palabra;
							var indice = productos.findIndex(item => item.id_articulo==id_articulo && item.medida==medida);
							var cantidadDecimal = parseFloat(productos[indice].cantidad)+parseFloat(cantidad);
								
								productos[indice].id_articulo=id_articulo;
								productos[indice].codigo=codigoBarra;
								productos[indice].nombreProducto=nombreProducto;
								productos[indice].cantidad=cantidadDecimal.toFixed(2);
								productos[indice].medida=medida;
								productos[indice].equivalencia = equivalencia;
								productos[indice].cantidadTotal = productos[indice].cantidad*productos[indice].equivalencia;
								productos[indice].nombreMedida=nombreMedida;
								productos[indice].precio=precio;
								var numDecimal = productos[indice].cantidad*precio;
								productos[indice].precioTotal=numDecimal.toFixed(2);
								productos[indice].inventariado = inventariado;

								document.getElementById('listaProductosA').innerHTML = '';

								var totalFactura = 0.00;
								var totalProductos = 0;
								productos.forEach(function(elemento, pos){

									totalFactura += parseFloat(elemento['precioTotal']);
									totalProductos = pos+1;
								 	document.getElementById('listaProductosA').innerHTML += `
								 	<tr>
								     	<td>${pos+1}</td>
								 	 	<td>${elemento['codigoBarra']}</td> 
								     	<td>${elemento['nombreProducto']}</td>
								     	<td>${elemento['nombreMedida']}</td> 
								     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td> 
								     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
								     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
								     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
								     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
								 		<td><a class="btn btn-danger btn-xs" href="javascript:quitar(${pos},'${elemento['nombreMedida']}','${elemento['nombreProducto']}');"><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
								 	</tr>

								 	`;

								});

							//pega factura total
							//Este solo para proposito de estetica en la vista (con separador de miles)
							$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));
							//$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));

							//Este para mandar al backend
							$('#subTotal').html(totalFactura.toFixed(2));
							//$('#totalFactura').html(totalFactura.toFixed(2));
							aplicaDescuento();

							if (totalProductos > 1) {
								palabra = 'Productos';
							}else{
								palabra = 'Producto';
							}

							$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);

							//Vacia los campos del formulario tanto visibles como ocultos
							
						   $('#id_articulo').val('');
						   $('#dropdownProducto').val('');
						   $('#codigoBarra').val('');
						   $('#medida').html(`<option>Seleccionar</option>`);
						   $('#existencia').val('');
						   $('#existenciaFront').val('');
						   $('#cantidad').val('');
						   $('#precio').val('');
						   $('#precioTotal').val('');
						   $('#id_UnMedida').val('');



						   //Desabilita algunos campos
						   $('#cantidad').attr({disabled:'disabled'});
						   $('#medida').attr({disabled:'disabled'});
						   $('#precio').attr({disabled:'disabled'});
						   $('#cancelarVenta').removeAttr('disabled');

						   document.getElementById('dropdownProducto').focus();
						   $('#descuento').removeAttr('disabled');
							

						}else{
							var palabra;
							//Se inserta el producto al arreglo de objetos
								productos.unshift({
										'id_articulo':id_articulo,
							            'codigoBarra': codigoBarra, 
							            'nombreProducto':nombreProducto, 
							            'cantidad':cantidad,
							            'medida':medida,
							            'equivalencia':equivalencia,
							            'cantidadTotal':cantidadTotal,
							            'nombreMedida':nombreMedida,
							            'precio':precio, 
							            'precioTotal':precioTotal,
							            'inventariado':inventariado,
							        });


								document.getElementById('listaProductosA').innerHTML = '';

								var totalFactura = 0.00;
								var totalProductos = 0;
								productos.forEach(function(elemento, pos){

									totalFactura += parseFloat(elemento['precioTotal']);
									totalProductos = pos+1;
								 document.getElementById('listaProductosA').innerHTML += `
								 <tr>
								     <td>${pos+1}</td>
								 	 <td>${elemento['codigoBarra']}</td> 
								     <td>${elemento['nombreProducto']}</td>
								     <td>${elemento['nombreMedida']}</td> 
								     <td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
								     <td>C$ ${formateaNumero(elemento['precio'])}</td>
								     <td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
								     <td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
								     <td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
								     <td><a class="btn btn-danger btn-xs" href="javascript:quitar(${pos},'${elemento['nombreMedida']}','${elemento['nombreProducto']}');"><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
								 </tr>

								 `;

								});

								//pega factura total
								//Este solo para proposito de estetica en la vista (con separador de miles)
								$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));
								//$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));

								//Este para mandar al backend
								$('#subTotal').html(totalFactura.toFixed(2));
								//$('#totalFactura').html(totalFactura.toFixed(2));
								aplicaDescuento();

								if (totalProductos > 1) {
									palabra = 'Productos';
								}else{
									palabra = 'Producto';
								}

								$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);

								//Vacia los campos del formulario tanto visibles como ocultos
								
							   $('#id_articulo').val('');
							   $('#dropdownProducto').val('');
							   $('#codigoBarra').val('');
							   $('#medida').html(`<option>Seleccionar</option>`);
							   $('#existencia').val('');
							   $('#existenciaFront').val('');
							   $('#cantidad').val('');
							   $('#precio').val('');
							   $('#precioTotal').val('');
							   $('#id_UnMedida').val('');



							   //Desabilita algunos campos
							   $('#cantidad').attr({disabled:'disabled'});
							   $('#medida').attr({disabled:'disabled'});
							   $('#precio').attr({disabled:'disabled'});
							   $('#cancelarVenta').removeAttr('disabled');

							   document.getElementById('dropdownProducto').focus();
							   $('#descuento').removeAttr('disabled');
							   

					   }

					/*}else{
						alertify.set('notifier','position', 'top-center');
						alertify.notify('Hubo un error', 'success', 3);
					}

					return false;
			
				}

	        });*/

		//Fin	
    
    }
	

});


//Funcion para cambiar la cantidad
function cambiarCantidad(pos){
	var cantidad = $(`#${pos}`).val();
	var palabra;
	var cantidadDecimal = parseFloat(cantidad);
	
	if (cantidad == '') {
		alertify.alert('Alerta!','No debe estar vacio').set({transition:'zoom'});
		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});
	}else if(isNaN(cantidad)){
		alertify.alert('Alerta!','Debe ser numerico').set({transition:'zoom'});
		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});
	}else if(cantidad<=0){
		alertify.alert('Alerta!','Debe ser mayor a cero (0)').set({transition:'zoom'});
		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});
	}else{
		productos[pos].cantidad=cantidadDecimal.toFixed(2);
		productos[pos].cantidadTotal = productos[pos].cantidad*productos[pos].equivalencia;
		var numDecimal = productos[pos].cantidad*productos[pos].precio;
		productos[pos].precioTotal=numDecimal.toFixed(2);

		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});

		//pega factura total
		//Este solo para proposito de estetica en la vista (con separador de miles)
		$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));
		//$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));

		//Este para mandar al backend
		$('#subTotal').html(totalFactura.toFixed(2));
		//$('#totalFactura').html(totalFactura.toFixed(2));
		aplicaDescuento();

		if (totalProductos > 1) {
			palabra = 'Productos';
		}else{
			palabra = 'Producto';
		}

		$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);
	}
	
		
}


//Funcion para aumentar la cantidad del producto de la lista temporal
function aumentarCantidad(pos){
	var palabra;
	var cantidadDecimal = parseFloat(productos[pos].cantidad)+parseFloat(1.00);
	
		productos[pos].cantidad=cantidadDecimal.toFixed(2);
		productos[pos].cantidadTotal = productos[pos].cantidad*productos[pos].equivalencia;
		var numDecimal = productos[pos].cantidad*productos[pos].precio;
		productos[pos].precioTotal=numDecimal.toFixed(2);

		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});

	//pega factura total
	//Este solo para proposito de estetica en la vista (con separador de miles)
	$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));
	//$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));

	//Este para mandar al backend
	$('#subTotal').html(totalFactura.toFixed(2));
	//$('#totalFactura').html(totalFactura.toFixed(2));
	aplicaDescuento();

	if (totalProductos > 1) {
		palabra = 'Productos';
	}else{
		palabra = 'Producto';
	}

	$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);

}


//Funcion para Reducir la cantidad del producto de la lista temporal
function reducirCantidad(pos){
	var palabra;
	var cantidadDecimal = 0.00;

	if (productos[pos].cantidad > 1) {
		cantidadDecimal = parseFloat(productos[pos].cantidad)-parseFloat(1.00);
	}else{
		cantidadDecimal = parseFloat(productos[pos].cantidad);
	}
	
		productos[pos].cantidad=cantidadDecimal.toFixed(2);
		productos[pos].cantidadTotal = productos[pos].cantidad*productos[pos].equivalencia;
		var numDecimal = productos[pos].cantidad*productos[pos].precio;
		productos[pos].precioTotal=numDecimal.toFixed(2);

		document.getElementById('listaProductosA').innerHTML = '';

		var totalFactura = 0.00;
		var totalProductos = 0;
		productos.forEach(function(elemento, pos){

			totalFactura += parseFloat(elemento['precioTotal']);
			totalProductos = pos+1;
		 	document.getElementById('listaProductosA').innerHTML += `
		 	<tr>
		     	<td>${pos+1}</td>
		 	 	<td>${elemento['codigoBarra']}</td> 
		     	<td>${elemento['nombreProducto']}</td>
		     	<td>${elemento['nombreMedida']}</td> 
		     	<td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     	<td>C$ ${formateaNumero(elemento['precio'])}</td>
		     	<td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     	<td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     	<td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		 		<td><a class="btn btn-danger btn-xs" href='javascript:quitar(${pos},"${elemento['nombreMedida']}","${elemento['nombreProducto']}");'><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		 	</tr>

		 	`;

		});

	//pega factura total
	//Este solo para proposito de estetica en la vista (con separador de miles)
	$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));
	//$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));

	//Este para mandar al backend
	$('#subTotal').html(totalFactura.toFixed(2));
	//$('#totalFactura').html(totalFactura.toFixed(2));
	aplicaDescuento();

	if (totalProductos > 1) {
		palabra = 'Productos';
	}else{
		palabra = 'Producto';
	}

	$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);

}



//Funcion para quitar producto de la lista temporal
function quitar(pos,medida,producto){
	var palabra;

	alertify.confirm('Alerta!',`¿Quieres quitar "${medida+' de '+producto}" de la lista?`, function(e){
		if(e){
			productos.splice(pos, 1);

			$('#buscaProductoTempo').val('');

			document.getElementById('listaProductosA').innerHTML = '';

			var totalFactura = 0.00;
			var totalProductos = 0;
			productos.forEach(function(elemento, pos){

				totalFactura += parseFloat(elemento['precioTotal']);
				totalProductos = pos+1;
			 document.getElementById('listaProductosA').innerHTML += `
			 <tr>
				 <td>${pos+1}</td>
			     <td>${elemento['codigoBarra']}</td> 
			     <td>${elemento['nombreProducto']}</td>
			     <td>${elemento['nombreMedida']}</td> 
			     <td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td> 
			     <td>C$ ${formateaNumero(elemento['precio'])}</td>
			     <td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
			     <td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
				 <td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
			     <td><a class="btn btn-danger btn-xs" href="javascript:quitar(${pos},'${elemento['nombreMedida']}','${elemento['nombreProducto']}');"><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
			 </tr>`;		
			});


			//desabilita
			if (productos.length == 0) {
				$('#cancelarVenta').attr({disabled:'disabled'});
				resetDescuento();
				$('#descuento').attr({disabled:'disabled'});

			}
			
			
			//pega factura total
			//Este solo para proposito de estetica en la vista (con separador de miles)
			$('#subTotalFront').html(formateaNumero(totalFactura.toFixed(2)));

			//Este para mandarlo al backend
			$('#subTotal').html(totalFactura.toFixed(2));
			aplicaDescuento();

			if (totalProductos > 1) {
				palabra = 'Productos';
			}else{
				palabra = 'Producto';
			}

			$('#totalProductos').html(formateaNumero(totalProductos)+' '+palabra);

		}else{
			return false;
		}

		},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'}).set('movable',false);

}


$('#buscaProductoTempo').delayPasteKeyUp(function(){

		var texto = $('#buscaProductoTempo').val();
		var expR = new RegExp(texto, "gi");

		if (texto == '') {

			document.getElementById('listaProductosA').innerHTML = '';

		    productos.forEach(function(elemento, pos){

		    document.getElementById('listaProductosA').innerHTML += `
		     <tr>
			 <td>${pos+1}</td>
		     <td>${elemento['codigoBarra']}</td> 
		     <td>${elemento['nombreProducto']}</td>
		     <td>${elemento['nombreMedida']}</td> 
		     <td><input onBlur="cambiarCantidad(${pos});" style="width:70px;" id="${pos}" type="text" value="${elemento['cantidad']}"></td>
		     <td>C$ ${formateaNumero(elemento['precio'])}</td>
		     <td>C$ ${formateaNumero(elemento['precioTotal'])}</td>
		     <td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${pos});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
			 <td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${pos});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		     <td><a class="btn btn-danger btn-xs" href="javascript:quitar(${pos},'${elemento['nombreMedida']}','${elemento['nombreProducto']}');"><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		     </tr>`;

	        });



		}else{

		  var result = productos.find(item =>{

			  return expR.test(item.nombreMedida+' '+item.nombreProducto);
		  });

		  if (result) {

		     document.getElementById('listaProductosA').innerHTML = '';

		     document.getElementById('listaProductosA').innerHTML += `
		     <tr>
			 <td>${1}</td>
		     <td>${result['codigoBarra']}</td> 
		     <td>${result['nombreProducto']}</td>
		     <td>${result['nombreMedida']}</td> 
		     <td><input onBlur="cambiarCantidad(${productos.indexOf(result)});" style="width:70px;" id="${productos.indexOf(result)}" type="text" value="${result['cantidad']}"></td> 
		     <td>C$ ${formateaNumero(result['precio'])}</td>
		     <td>C$ ${formateaNumero(result['precioTotal'])}</td>
		     <td><a class="btn btn-primary btn-xs" href='javascript:aumentarCantidad(${productos.indexOf(result)});'><i style="font-size:18px;" class="fa fa-plus"></i></a></td>
		     <td><a class="btn btn-warning btn-xs" href='javascript:reducirCantidad(${productos.indexOf(result)});'><i style="font-size:18px;" class="fa fa-minus"></i></a></td>
		     <td><a class="btn btn-danger btn-xs" href="javascript:quitar(${productos.indexOf(result)},'${result['nombreMedida']}','${result['nombreProducto']}');"><i style="font-size:18px;" class="fa fa-trash"></i></a></td>
		     </tr>`;

		  }else{

			document.getElementById('listaProductosA').innerHTML = `
			<tr><td colspan="8">No hay resultados para: ${texto}</td></tr>`;
		

		}

	}

});


//Fin


function aplicaDescuento(){
	var subTotal = parseFloat($('#subTotal').html());
	var descuento = parseFloat($('#descuento').val());
	var totalFactura = 0;
	if (descuento == 0) {
		totalFactura = subTotal;
	}else{
		descuento = (subTotal*descuento)/100;
		totalFactura = subTotal-descuento;
	}

	$('#totalFacturaFront').html(formateaNumero(totalFactura.toFixed(2)));
	$('#totalFactura').html(totalFactura.toFixed(2));
	$('#valDescuento').html(` = C$ ${formateaNumero(descuento.toFixed(2))}`);
}



//Cierra el modal evitando salir sin guardar los datos
function cerrarModalNuevaVenta(){

	if (productos.length > 0) {

		alertify.confirm('Alerta!','No has guardado los datos, se perderan al salir. <br> ¿Quieres cerrar de todos modos?', function(e){
			if(e){

				productos.splice(0);
				document.getElementById('listaProductosA').innerHTML = ''; 
				document.getElementById('totalFactura').innerHTML = '';
				$('#ModVenta').modal('hide');
			
			}else{
				return false;
			}
	
			},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'}).set('movable',false);

		
		
	}else{

		$('#ModVenta').modal('hide');

	}

}



//Funsion que procesa y envia los datos para registrarlos en la db
function procesarVenta() {
	$('.dropdown').removeClass('open');

	var id_cliente = $('#id_cliente').val();
	var subTotal = $('#subTotal').html();
	var descuento = $('#descuento').val();
	var totalVenta = $('#totalFactura').html();

	if (id_cliente == '') {
		alertify.alert('Alerta', 'Seleccione un cliente porfavor',function(e){
		
		}).set({transition:'zoom'});
		
	}else if (productos.length > 0) {

		alertify.confirm('COBRAR VENTA!',`
				
				<div style="height:300px;text-align:center;padding:5px 20px;">
					<label style="margin-bottom:10px;font-size:20px;">Costo total <br> C$ ${formateaNumero(totalVenta)}</label>
					<br>
					<br>
					<label>Metodo de pago</label>
					<select class="form-control" style="width:150px;margin:0 auto;" id="tipo_pago">
						<option value="Efectivo">Efectivo</option>
						<option value="Tarjeta">Tarjeta</option>
						<option value="Cheque">Cheque</option>
					</select>
					<br>
					<label id="respuestaErr"></label>
					<br>
					<input id="efectivo" onkeyup="creaCambio(${totalVenta});" placeholder="Ingrese efectivo" type="text" class="form-control">
					<br>
					<label>Su Cambio</label>
					<input disabled id="cambio" placeholder="Su Cambio" type="text" class="form-control">
				</div>	

			`, function(e){
			if(e){
				var tipo_pago = $('#tipo_pago').val();
				var efectivo = parseFloat($('#efectivo').val());
				var cambio = parseFloat($('#cambio').val());

				if ($('#efectivo').val()=='') {
					setTimeout(function(){
						procesarVenta();
						$('#respuestaErr').html('ERROR: Ingrese Efectivo');
					},1);
				}else if(efectivo<totalVenta){
					setTimeout(function(){
						procesarVenta();
						$('#respuestaErr').html('ERROR: El efectivo es menor al costo total');
					},1);
				}else if(isNaN(efectivo)){
					setTimeout(function(){
						procesarVenta();
						$('#respuestaErr').html('ERROR: El efectivo debe ser numerico');
					},1);
				}else{

					$.ajax({
						type:'POST',
						url:$('#base_url').val()+'venta/procesaVenta',
						data:{id_cliente:id_cliente,subTotal:subTotal,descuento:descuento,totalVenta:totalVenta, array:productos,efectivo:efectivo,cambio:cambio,tipo_pago:tipo_pago},
						beforeSend: function(){
							$('#ModNotify').modal({
								show:true,
								backdrop:'static'
							});
						},
						success: function(registro){
							
							var array = eval(registro);
							if (array[0]=='error') {
								$('#ModNotify').modal('hide');
								alertify.alert('Alerta!',array[1]).set({transition:'zoom'});

							}else if (array[0]=='1') {
								reseteaTodo();
								resetDescuento();
								$('#valDescuento').html('');
								var html = ``;
								var tabla = `
										<table class="table table-striped table-condensed table-hover table-bordered">
							                <tr>
								                  <th scope="col">N° Factura</th>
								                  <th scope="col">Cliente</th>
								                  <th scope="col">Total Factura</th>
								                  <th scope="col">Fecha</th>
								                  <th scope="col">Hora</th>
								                  <th scope="col" colspan="3">Acciones</th>
							                </tr>
									`;
								for (var i = 0; i <= array[1].length-1; i++) {
									
									var detalleFactura = `<button title="Detalle Factura" onClick="javascript:detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}');" class="btn btn-warning btn-xs">Detalle</button>`;
									var cancelarFactura = `<button title="Cancelar Factura" onClick="javascript:cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}');" class="btn btn-danger btn-xs">Cancelar</button>`;
									var imprimirFactura = `<button title="Imprimir Factura" onClick="javascript:imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}');" class="btn btn-danger btn-xs">Imprimir</button>`;	
									tabla = tabla+`
											<tr>
							                    <td>${array[1][i]['n_factura']}</td>
							                    <td>${array[1][i]['nombres']}</td>
							                    <td>${formateaNumero(array[1][i]['total_venta'])}</td>
							                    <td>${formatoFecha(array[1][i]['fecha_v'])}</td>
							                    <td>${formatoHora(array[1][i]['hora'])}</td>
							                    <td>${detalleFactura}</td>
							                    <td>${cancelarFactura}</td>
							                    <td>${imprimirFactura}</td>
				    						</tr>

									`;

									html = html+`
										<div style="background:rgb(222,225,230);border-radius:10px;margin:20px auto;width:95%;">
								            <div style="background:#394146;color:#fff;margin-bottom:10px;border-top-left-radius:10px;border-top-right-radius:10px;padding:5px;text-align:center;height:35px;" class="cabecera">
								            	  <i title="Cancelar Factura" onclick="cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-remove"></i>
									              <i title="Imprimir Factura" onclick="imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-print"></i>
									              <i title="Detalle Factura" onclick="detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}')" style="font-size:17px;float:right;padding:3px;cursor:pointer;margin-right:2px;" class="fa fa-eye"></i>
								            </div>

								            <div style="padding:5px;" class="cuerpo">
											  <b>Fecha: </b>
											  <i style="margin-top:5px;">${formatoFecha(array[1][i]['fecha_v'])}</i>
								              <i style="margin-top:5px;"> - ${formatoHora(array[1][i]['hora'])}</i>
								              <hr style="margin:0;padding:0;">
								              <p><b>Factura N°:</b> ${array[1][i]['n_factura']}</p>
								              <hr style="margin:0;padding:0;">
								              <p><b>Cliente:</b> ${array[1][i]['nombres']}</p>
								              <hr style="margin:0;padding:0;">
								              
								              
								            </div>
				          
				          				</div>

									`;
								}

								tabla = tabla+`</table>`;

								$('#datosVenta').html(tabla);
								$('#datosVenta2').html(html);
								$('#paginacion').html(array[2]);
								$('#ModNotify').modal('hide');
								alertify.set('notifier','position', 'top-center');
								alertify.notify('facturacion exitoso!', 'success', 3);

								$('#frame').attr({src:`${$('#base_url').val()+array[4]}`});
								$('#frame').on('load',function(){
										document.getElementById('frame').contentWindow.print();
										$.ajax({
												type:'post',
												url:$('#base_url').val()+'empresa/delete_pdf',
												data:{clave:1},
												success: function(respuesta){

												}
													
										});
								});
							}else{
								alertify.set('notifier','position', 'top-center');
								alertify.notify(array[1], 'success', 3);
							}

							return false;
							
						}

					    });

				}
				
			}else{
				return false;
			}
		
		},null).set('labels',{ok:'Cobrar', cancel:'Cancelar'})/*.set('maximizable',true)*/.set('closableByDimmer',false).set('movable',false).set({transition:'zoom'}).set('defaultFocusOff', true)/*.set('padding',false)*/;
		setTimeout(function(){document.getElementById('efectivo').focus();},560);

	}else{
		alertify.alert('Alerta', 'No has seleccionado ningun producto todavia',function(e){
			if (e) {
				setTimeout(function(){document.getElementById('dropdownProducto').focus();},500);
			}else{
				setTimeout(function(){document.getElementById('dropdownProducto').focus();},500);
			}
		}).set({transition:'zoom'});
	}

	
	return false;
	
}


function creaCambio(totalVenta){
	var efectivo = parseFloat($('#efectivo').val());
	var cambio = '';
	if (efectivo=='') {
		$('#cambio').val('');
	}else{
		if (isNaN(efectivo)) {

		}else{
			if (totalVenta>=efectivo) {
				cambio = 0;
			}else{
				cambio = efectivo-totalVenta;
			}

			$('#cambio').val(cambio.toFixed(2));
		}
	}
}



function reseteaTodo(){

	   productos.splice(0);
	   $('input').val('');
	   $('#id_cliente').val('1');
  	   $('#nombreClienteVenta').val('Cliente Particular');
	   $('#medida').html(`<option>Seleccionar</option>`);
	   $('#listaProductosA').html('');
	   $('#subTotal').html('0');
	   $('#subTotalFront').html('0.00');
	   $('#totalFactura').html('0');
	   $('#totalFacturaFront').html('0.00');
	   $('#totalProductos').html('0 Producto');
	  

	   //Desabilita algunos campos
	   $('#precio').attr({disabled:'disabled'});
	   $('#cantidad').attr({disabled:'disabled'});
	   $('#medida').attr({disabled:'disabled'});
	   $('#descuento').attr({disabled:'disabled'});
	   $('#cancelarVenta').attr({disabled:'disabled'});

}


function detalleFactura(id_factura,n_factura,ruta){
	$.ajax({
		type:'post',
		url:ruta,
		data:{id_factura:id_factura},
		beforeSend: function(){
			$('#ModNotify').modal({
				show:true,
				backdrop:'static'
			});
		},
		success: function(respuesta){
			var array = eval(respuesta);
			$('#ModNotify').modal('hide');
			if (array[0]=='1') {
				$('#labelFacturaDet').html(`${n_factura}`);
				$('#datosProductosDet').html(array[1]);
				$('#ModalDetalle').modal({
					show:true,
					backdrop:'static',
				});

			}else{

			}
		}
	});
}



function cancelaVenta(){
	$('.dropdown').removeClass('open');

	alertify.confirm('Alerta!','¿Esta seguro de cancelar esta facturacion?', function(e){
	if(e){

	   productos.splice(0);
	   $('input').val('');
	   $('#medida').html(`<option>Seleccionar</option>`);
	   $('#listaProductosA').html('');
	   $('#subTotal').html('0');
	   $('#subTotalFront').html('0.00');
	   $('#totalFactura').html('0');
	   $('#totalFacturaFront').html('0.00');
	   $('#totalProductos').html('0 Producto');
	  
	   //Desabilita algunos campos
	   $('#precio').attr({disabled:'disabled'});
	   $('#cantidad').attr({disabled:'disabled'});
	   $('#medida').attr({disabled:'disabled'});
	   $('#cancelarVenta').attr({disabled:'disabled'});

	   document.getElementById('dropdownProducto').focus();
		
	}else{
		return false;
	}

	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'});

}



function imprimirFactura(id_factura, ruta){
	alertify.confirm('Alerta!','¿Quieres imprimir la factura?', function(e){
		if(e){
			$.ajax({
				type:'post',
				url:ruta,
				data:{id_factura:id_factura},
				beforeSend: function(){
					$('#ModNotify').modal({
						show:true,
						backdrop:'static'
					});
				},
				success: function(respuesta){
					var array = eval(respuesta);
					$('#ModNotify').modal('hide');
					if (array[0]=='1') {
						
						$('#frame').attr({src:`${$('#base_url').val()+array[1]}`});
						$('#frame').on('load',function(){
								document.getElementById('frame').contentWindow.print();
								$.ajax({
										type:'post',
										url:$('#base_url').val()+'empresa/delete_pdf',
										data:{clave:1},
										success: function(respuesta){

										}
											
								});
						});

					}								
				
				}
			});
			
		}else{
			return false;
		}
	
	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'}).set('closableByDimmer',false).set('movable',false);
}

function reimprimirFactura(ruta){
	var dt = 1;
	alertify.confirm('Alerta!','¿Quieres Reimprimir la ultima factura?', function(e){
		if(e){
			$.ajax({
				type:'post',
				url:ruta,
				data:{dt:dt},
				beforeSend: function(){
					$('#ModNotify').modal({
						show:true,
						backdrop:'static'
					});
				},
				success: function(respuesta){
					var array = eval(respuesta);
					$('#ModNotify').modal('hide');
					if (array[0]=='1') {
						
						$('#frame').attr({src:`${$('#base_url').val()+array[1]}`});
						$('#frame').on('load',function(){
								document.getElementById('frame').contentWindow.print();
								$.ajax({
										type:'post',
										url:$('#base_url').val()+'empresa/delete_pdf',
										data:{clave:1},
										success: function(respuesta){

										}
											
								});
						});

					}else{
						$('#ModNotify').modal('hide');
						setTimeout(function(){
							alertify.set('notifier','position', 'top-center');
							alertify.notify('No hay factura para reimprimir', 'success', 3);
						},900);
					}								
				
				}
			});
			
		}else{
			return false;
		}
	
	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'}).set('closableByDimmer',false).set('movable',false);
}


//Cancela factura
function cancelarFactura(id_venta,id_cliente,total_venta,ruta){
	alertify.confirm('Cancelar Factura',' (Las facturas canceladas no se podrán restaurar) ¿Seguro que quieres cancelar esta factura?', function(e){
		if(e){
			$.ajax({
				type:'post',
				url:ruta,
				data:{id_venta:id_venta,id_cliente:id_cliente,total_venta:total_venta},
				beforeSend: function(){
					$('#ModNotify').modal({
						show:true,
						backdrop:'static'
					});
				},
				success: function(respuesta){
					var array = eval(respuesta);
					$('#ModNotify').modal('hide');

					if (array[0]=='0') {
						alertify.alert('Alerta!','Hubo un error').set('labels',{ok:'Aceptar', cancel:'Cancelar'});
					}

					if (array[0]=='1') {
						
						var html = ``;
						var tabla = `
								<table class="table table-striped table-condensed table-hover table-bordered">
					                <tr>
						                  <th scope="col">N° Factura</th>
						                  <th scope="col">Cliente</th>
						                  <th scope="col">Total Factura</th>
						                  <th scope="col">Fecha</th>
						                  <th scope="col">Hora</th>
						                  <th scope="col" colspan="3">Acciones</th>
					                </tr>
							`;
						for (var i = 0; i <= array[1].length-1; i++) {
							
							var detalleFactura = `<button title="Detalle Factura" onClick="javascript:detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}');" class="btn btn-warning btn-xs">Detalle</button>`;
							var cancelarFactura = `<button title="Cancelar Factura" onClick="javascript:cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}');" class="btn btn-danger btn-xs">Cancelar</button>`;
							var imprimirFactura = `<button title="Imprimir Factura" onClick="javascript:imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}');" class="btn btn-danger btn-xs">Imprimir</button>`;	
							tabla = tabla+`
									<tr>
					                    <td>${array[1][i]['n_factura']}</td>
					                    <td>${array[1][i]['nombres']}</td>
					                    <td>${formateaNumero(array[1][i]['total_venta'])}</td>
					                    <td>${formatoFecha(array[1][i]['fecha_v'])}</td>
					                    <td>${formatoHora(array[1][i]['hora'])}</td>
					                    <td>${detalleFactura}</td>
					                    <td>${cancelarFactura}</td>
					                    <td>${imprimirFactura}</td>
		    						</tr>

							`;

							html = html+`
								<div style="background:rgb(222,225,230);border-radius:10px;margin:20px auto;width:95%;">
						            <div style="background:#394146;color:#fff;margin-bottom:10px;border-top-left-radius:10px;border-top-right-radius:10px;padding:5px;text-align:center;height:35px;" class="cabecera">
						            	  <i title="Cancelar Factura" onclick="cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-remove"></i>
							              <i title="Imprimir Factura" onclick="imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-print"></i>
							              <i title="Detalle Factura" onclick="detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}')" style="font-size:17px;float:right;padding:3px;cursor:pointer;margin-right:2px;" class="fa fa-eye"></i>
						            </div>

						            <div style="padding:5px;" class="cuerpo">
									  <b>Fecha: </b>
									  <i style="margin-top:5px;">${formatoFecha(array[1][i]['fecha_v'])}</i>
						              <i style="margin-top:5px;"> - ${formatoHora(array[1][i]['hora'])}</i>
						              <hr style="margin:0;padding:0;">
						              <p><b>Factura N°:</b> ${array[1][i]['n_factura']}</p>
						              <hr style="margin:0;padding:0;">
						              <p><b>Cliente:</b> ${array[1][i]['nombres']}</p>
						              <hr style="margin:0;padding:0;">
						              
						              
						            </div>
		          
		          				</div>

							`;
						}

						tabla = tabla+`</table>`;

						$('#datosVenta').html(tabla);
						$('#datosVenta2').html(html);
						$('#paginacion').html(array[2]);
						alertify.set('notifier','position', 'top-center');
						alertify.notify('Factura Cancelada', 'success', 3);
					}	
					
				}
			});
			
		}else{
			return false;
		}
	
	},null).set('labels',{ok:'SI', cancel:'NO'}).set({transition:'zoom'}).set('closableByDimmer',false).set('movable',false);

}


function cerrarModalDetalleFactura(){
	$('#ModalDetalle').modal('hide');
}


function devolverProducto(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente){
	$('#respuestaErrDev').html('');
	var cantidadDev = '';
	var observacion = '';
	alertify.confirm('DEVOLVER PRODUCTO',`
				<div style="height:100px;text-align:center;">
			
					<label>CANTIDAD A DEVOLVER</label>
					<br>
					<input id="cantidadDev" value="${cantidad}" placeholder="Cantida a devolver" type="text" class="form-control">
					<br>
					<input class="form-control" id="observacion" type="text" placeholder="Motivo devolucion (Opcional)">
					<br>
					<label id="respuestaErrDev"></label>
					<br>
					<br>
				</div>	

			`, function(e){
			if(e){
				cantidadDev = parseFloat($('#cantidadDev').val()*1);
				observacion = $('#observacion').val();
				if ($('#cantidadDev').val()=='') {
					setTimeout(function(){
						devolverProducto(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente);
						$('#respuestaErrDev').html('ERROR: Ingrese la cantidad a devolver');
					},1);
				}else if(cantidadDev > parseFloat(cantidad)){
					setTimeout(function(){
						devolverProducto(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente);
						$('#respuestaErrDev').html('ERROR: la cantidad a devolver supera a la existente');
					},1);
				}else if(isNaN(cantidadDev)){
					setTimeout(function(){
						devolverProducto(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente);
						$('#respuestaErrDev').html('ERROR: La cantidad debe ser numerico');
					},1);
				}else if(cantidadDev== 0 || cantidadDev == 0.00){
					setTimeout(function(){
						devolverProducto(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente);
						$('#respuestaErrDev').html('ERROR: La cantidad a devolver debe ser mayor a cero (0)');
					},1);
				}else{

					$.ajax({
						type:'POST',
						url:$('#base_url').val()+'venta/devolverProducto',
						data:{id_detalle_v:id_detalle_v,cantidad:cantidad,cantidadDev:cantidadDev,equivalencia:equivalencia,precio:precio,id_venta:id_venta,id_articulo:id_articulo,id_cliente:id_cliente,observacion:observacion},
						beforeSend: function(){
							$('#ModNotify').modal({
								show:true,
								backdrop:'static'
							});
						},
						success: function(registro){
							var array = eval(registro);
							
							if (array[0]=='1') {
								$('#ModNotify').modal('hide');
								$('#datosProductosDet').html(array[4]);



								var html = ``;
								var tabla = `
										<table class="table table-striped table-condensed table-hover table-bordered">
							                <tr>
								                  <th scope="col">N° Factura</th>
								                  <th scope="col">Cliente</th>
								                  <th scope="col">Total Factura</th>
								                  <th scope="col">Fecha</th>
								                  <th scope="col">Hora</th>
								                  <th scope="col" colspan="3">Acciones</th>
							                </tr>
									`;
								for (var i = 0; i <= array[1].length-1; i++) {
									
									var detalleFactura = `<button title="Detalle Factura" onClick="javascript:detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}');" class="btn btn-warning btn-xs">Detalle</button>`;
									var cancelarFactura = `<button title="Cancelar Factura" onClick="javascript:cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}');" class="btn btn-danger btn-xs">Cancelar</button>`;
									var imprimirFactura = `<button title="Imprimir Factura" onClick="javascript:imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}');" class="btn btn-danger btn-xs">Imprimir</button>`;	
									tabla = tabla+`
											<tr>
							                    <td>${array[1][i]['n_factura']}</td>
							                    <td>${array[1][i]['nombres']}</td>
							                    <td>${formateaNumero(array[1][i]['total_venta'])}</td>
							                    <td>${formatoFecha(array[1][i]['fecha_v'])}</td>
							                    <td>${formatoHora(array[1][i]['hora'])}</td>
							                    <td>${detalleFactura}</td>
							                    <td>${cancelarFactura}</td>
							                    <td>${imprimirFactura}</td>
				    						</tr>

									`;

									html = html+`
										<div style="background:rgb(222,225,230);border-radius:10px;margin:20px auto;width:95%;">
								            <div style="background:#394146;color:#fff;margin-bottom:10px;border-top-left-radius:10px;border-top-right-radius:10px;padding:5px;text-align:center;height:35px;" class="cabecera">
								            	  <i title="Cancelar Factura" onclick="cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-remove"></i>
									              <i title="Imprimir Factura" onclick="imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-print"></i>
									              <i title="Detalle Factura" onclick="detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}')" style="font-size:17px;float:right;padding:3px;cursor:pointer;margin-right:2px;" class="fa fa-eye"></i>
								            </div>

								            <div style="padding:5px;" class="cuerpo">
											  <b>Fecha: </b>
											  <i style="margin-top:5px;">${formatoFecha(array[1][i]['fecha_v'])}</i>
								              <i style="margin-top:5px;"> - ${formatoHora(array[1][i]['hora'])}</i>
								              <hr style="margin:0;padding:0;">
								              <p><b>Factura N°:</b> ${array[1][i]['n_factura']}</p>
								              <hr style="margin:0;padding:0;">
								              <p><b>Cliente:</b> ${array[1][i]['nombres']}</p>
								              <hr style="margin:0;padding:0;">
								              
								              
								            </div>
				          
				          				</div>

									`;
								}

								tabla = tabla+`</table>`;

								$('#datosVenta').html(tabla);
								$('#datosVenta2').html(html);
								$('#frame').attr({src:`${$('#base_url').val()+array[5]}`});
								document.getElementById('frame').onload = function(){
									document.getElementById('frame').contentWindow.print();								
				
								}
								$('#paginacion').html(array[2]);

								alertify.set('notifier','position', 'top-center');
								alertify.notify('Se ha devuelto la cantidad especificada', 'success', 3);
							}else{
								alertify.set('notifier','position', 'top-center');
								alertify.notify('Ocurrio un error', 'success', 3);

							}
								
							return false;
						}
						

	    			});

				}
				
			}else{
				return false;
			}
		
		},null).set('labels',{ok:'Devolver', cancel:'Cancelar'})/*.set('maximizable',true)*/.set('closableByDimmer',false).set('movable',false).set({transition:'zoom'})/*.set('defaultFocusOff', true).set('padding',false)*/;
		
		//setTimeout(function(){document.getElementById('cantidadDev').focus();},560);
		$('#cantidadDev').val(cantidad);

}

function moverPerdida(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente,medida){
	$('#respuestaErrPerd').html('');
	var cantidadPerd = '';
	alertify.confirm('MOVER A PERDIDAS',`
				<div style="height:100px;text-align:center;">
			
					<label>CANTIDAD A MOVER</label>
					<br>
					<input id="cantidadPerd" value="${cantidad}" placeholder="Cantida a devolver" type="text" class="form-control">
					<br>
					<label id="respuestaErrPerd"></label>
					<br>
					<br>
				</div>	

			`, function(e){
			if(e){
				cantidadPerd = parseFloat($('#cantidadPerd').val()*1);

				if ($('#cantidadPerd').val()=='') {
					setTimeout(function(){
						moverPerdida(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente,medida);
						$('#respuestaErrPerd').html('ERROR: Ingrese la cantidad a mover');
					},1);
				}else if(cantidadPerd > parseFloat(cantidad)){
					setTimeout(function(){
						moverPerdida(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente,medida);
						$('#respuestaErrPerd').html('ERROR: la cantidad a mover supera a la existente');
					},1);
				}else if(isNaN(cantidadPerd)){
					setTimeout(function(){
						moverPerdida(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente,medida);
						$('#respuestaErrPerd').html('ERROR: La cantidad debe ser numerico');
					},1);
				}else if(cantidadPerd== 0 || cantidadPerd == 0.00){
					setTimeout(function(){
						moverPerdida(id_detalle_v,cantidad,equivalencia,precio,id_venta,id_articulo,id_cliente,medida);
						$('#respuestaErrPerd').html('ERROR: La cantidad a mover debe ser mayor a cero (0)');
					},1);
				}else{

					$.ajax({
						type:'POST',
						url:$('#base_url').val()+'venta/moverPerdida',
						data:{id_detalle_v:id_detalle_v,cantidad:cantidad,cantidadPerd:cantidadPerd,medida:medida,equivalencia:equivalencia,precio:precio,id_venta:id_venta,id_articulo:id_articulo,id_cliente:id_cliente},
						beforeSend: function(){
							$('#ModNotify').modal({
								show:true,
								backdrop:'static'
							});
						},
						success: function(registro){
							var array = eval(registro);
							
							if (array[0]=='1') {
								$('#ModNotify').modal('hide');
								$('#datosProductosDet').html(array[4]);


								var html = ``;
								var tabla = `
										<table class="table table-striped table-condensed table-hover table-bordered">
							                <tr>
								                  <th scope="col">N° Factura</th>
								                  <th scope="col">Cliente</th>
								                  <th scope="col">Total Factura</th>
								                  <th scope="col">Fecha</th>
								                  <th scope="col">Hora</th>
								                  <th scope="col" colspan="3">Acciones</th>
							                </tr>
									`;
								for (var i = 0; i <= array[1].length-1; i++) {
									
									var detalleFactura = `<button title="Detalle Factura" onClick="javascript:detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}');" class="btn btn-warning btn-xs">Detalle</button>`;
									var cancelarFactura = `<button title="Cancelar Factura" onClick="javascript:cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}');" class="btn btn-danger btn-xs">Cancelar</button>`;
									var imprimirFactura = `<button title="Imprimir Factura" onClick="javascript:imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}');" class="btn btn-danger btn-xs">Imprimir</button>`;	
									tabla = tabla+`
											<tr>
							                    <td>${array[1][i]['n_factura']}</td>
							                    <td>${array[1][i]['nombres']}</td>
							                    <td>${formateaNumero(array[1][i]['total_venta'])}</td>
							                    <td>${formatoFecha(array[1][i]['fecha_v'])}</td>
							                    <td>${formatoHora(array[1][i]['hora'])}</td>
							                    <td>${detalleFactura}</td>
							                    <td>${cancelarFactura}</td>
							                    <td>${imprimirFactura}</td>
				    						</tr>

									`;

									html = html+`
										<div style="background:rgb(222,225,230);border-radius:10px;margin:20px auto;width:95%;">
								            <div style="background:#394146;color:#fff;margin-bottom:10px;border-top-left-radius:10px;border-top-right-radius:10px;padding:5px;text-align:center;height:35px;" class="cabecera">
								            	  <i title="Cancelar Factura" onclick="cancelarFactura(${array[1][i]['id_venta']},${array[1][i]['id_cliente']},${array[1][i]['total_venta']},'${array[3]['cancelarFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-remove"></i>
									              <i title="Imprimir Factura" onclick="imprimirFactura(${array[1][i]['id_venta']},'${array[3]['imprimirFactura']}')" style="font-size:15px;float:right;padding:5px;cursor:pointer;margin-left:2px;" class="fa fa-print"></i>
									              <i title="Detalle Factura" onclick="detalleFactura(${array[1][i]['id_venta']},'${array[1][i]['n_factura']}','${array[3]['detalleFactura']}')" style="font-size:17px;float:right;padding:3px;cursor:pointer;margin-right:2px;" class="fa fa-eye"></i>
								            </div>

								            <div style="padding:5px;" class="cuerpo">
											  <b>Fecha: </b>
											  <i style="margin-top:5px;">${formatoFecha(array[1][i]['fecha_v'])}</i>
								              <i style="margin-top:5px;"> - ${formatoHora(array[1][i]['hora'])}</i>
								              <hr style="margin:0;padding:0;">
								              <p><b>Factura N°:</b> ${array[1][i]['n_factura']}</p>
								              <hr style="margin:0;padding:0;">
								              <p><b>Cliente:</b> ${array[1][i]['nombres']}</p>
								              <hr style="margin:0;padding:0;">
								              
								              
								            </div>
				          
				          				</div>

									`;
								}

								tabla = tabla+`</table>`;

								$('#datosVenta').html(tabla);
								$('#datosVenta2').html(html);

								$('#paginacion').html(array[2]);

								$('#frame').attr({src:`${$('#base_url').val()+array[6]}`});
								document.getElementById('frame').onload = function(){
									document.getElementById('frame').contentWindow.print();								
				
								}

								alertify.set('notifier','position', 'top-center');
								alertify.notify('Se ha movido la cantidad especificada', 'success', 3);
							}else{
								alertify.set('notifier','position', 'top-center');
								alertify.notify('Ocurrio un error', 'success', 3);

							}
								
							return false;
						}
						

	    			});

				}
				
			}else{
				return false;
			}
		
		},null).set('labels',{ok:'Mover', cancel:'Cancelar'})/*.set('maximizable',true)*/.set('closableByDimmer',false).set('movable',false).set({transition:'zoom'})/*.set('defaultFocusOff', true).set('padding',false)*/;
		
		//setTimeout(function(){document.getElementById('cantidadDev').focus();},560);
		$('#cantidadPerd').val(cantidad);

}


function ventasHoy(){
	$('#ModVentaDia').modal({
		show:true,
		backdrop:'static',
	});

	$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/ventasHoy',
		data:{clave:'1'},
		beforeSend: function(){

			$('#datosListaFactura').html(`<i class="fa fa-spinner fa-spin"></i> cargando`);
			$('#contenedorDetalle').html(``);
			$('#FactInf').html(``);
	
		},
		success: function(respuesta){
			var array = eval(respuesta);
			$('#datosListaFactura').html(array[0]);
			$('#ventaTotalDia').html(`Venta Total: C$ ${array[1]}`);
			
		}
	});
}


function detalleFacturaHoy(id_venta,cliente,t_factura){
	$('.facts').removeClass('facturaActiva');
	$(`#${id_venta}`).addClass('facturaActiva');
	$.ajax({
		type:'post',
		url:$('#base_url').val()+'venta/detalle_factura_hoy',
		data:{id_venta:id_venta,t_factura:t_factura},
		beforeSend: function(){
			$('#contenedorDetalle').html(`<i class="fa fa-spinner fa-spin"></i> cargando`);
		},
		success: function(respuesta){
			var array = eval(respuesta);
			$('#contenedorDetalle').html(array[1]);

		}
	});
}

function cerrarModalVentaDia(){
	$('#ModVentaDia').modal('hide');
}
