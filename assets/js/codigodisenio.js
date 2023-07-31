$(document).ready(function(){

	$('#mostrar-menu').on('click', function(){

		$('#menu-lateral2').removeClass('mostrarMenu2');
		if (!$('aside').hasClass('mostrar-menu')) {
			$('body').css({overflow:'hidden'});
			$('aside').addClass('mostrar-menu');
			$('#mostrar-menu').removeClass('glyphicon glyphicon-menu-hamburger');
			$('#mostrar-menu').addClass('glyphicon glyphicon-remove');
			setTimeout(function(){
				$('aside').css({background:'rgba(0,0,0,0.5)'});
			},200);

		}else{

			$('body').css({overflow:'scroll'});

			$('aside').css({background:'rgba(0,0,0,0)'});

			$('aside').removeClass('mostrar-menu');$('#mostrar-menu').removeClass('glyphicon glyphicon-remove');

			$('#mostrar-menu').addClass('glyphicon glyphicon-menu-hamburger');

		}
	});

});