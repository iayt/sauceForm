$.fn.sauceForm=function(config){

	// configs
	var config=$.extend({
		id: 	this[0].id, 				// Id'si
		method: 'post',						// post/selfPage 	(default: post)
		lang: 	'tr'						// lang 			(default: tr)
	}, config);

	var txtID="#"+config.id;
	var domID=$(txtID);


	// globals
	domID.append('<input type="hidden" name="form" value="'+config.id+'" />');



	// formPost
	function formPost(id){ 

		domID.sauceNtfy({type:'loading',text:'Form gönderiliyor... Lütfen bekleyiniz.'});
		domID.find('button').hide();	// button hide

		$.ajax({
			type: 		'POST',
			url: 		domID.attr("action"),
			data: 		domID.serialize(),
			beforeSend: function(){},
			error: 		function(){domID.sauceNtfy({type:'error',text:gonderilemedi});},
			success: 	function(response){	response=response.split("|");
				switch (response[0]){
					case 'true': 	// true
						if(response[1])	{
							domID.sauceNtfy({type:'true',text:response[1]});
							domID.hide(); 											// Form gönderildikten sonra form alanı siliniyor.
						}
						else		{ domID.sauceNtfy({type:'true',text:gonderildi}); }
						$('.'+id+' input, .'+id+' textarea, .'+id+' select').not("input[type=hidden]").val('');		// form başarılı gönderildikten sonra input,textarea,select alanlarını boşaltıyor.
						break;
					case 'false': 	// false
						if(response[1])	{ domID.sauceNtfy({type:'error',text:response[1]});}
						break;
					case 'refresh':	// refresh
						var msj='Sayfa yönleniyor...';
						if(response[2]){ msj=response[2];}									// refresh yaparken php den gelen mesaj varsa
						if(response[1]){ window.location=response[1];}							// refresh yaparken php den gelen adres varsa
						else {
							domID.sauceNtfy({type:'true',text:msj});
							domID.hide(); 											// Form gönderildikten sonra form alanı siliniyor.
							location.reload();
						}
						break;
					default:
						domID.sauceNtfy({type:'error',text:response});
				}
				
				domID.find('button').show(); // button show
			}
		});
		return false;

	};




	// validateForm
	function validateForm(formCls,method){
		$('*').removeClass("err");
		var hata='';

		// lang 
		if( config.lang !== 'tr' ){
				var doldurun 		= '- Please Fill in all fields.<br>';
				var epostadegil		= '- Please Enter a valid email address.<br>';
				var gonderildi		= '- Form has been sent successfully.<br />Thank you...';
				var gonderilemedi	= '- ';
				var errContract		= '- <br>';
				var errPass			= '- Şifre ve şifre tekrarı alanları aynı olmalıdır.<br>';
		}
		else {
				var doldurun 		= '- Lütfen tüm alanları doldurunuz.<br>';
				var epostadegil		= '- Lütfen geçerli bir E-Mail adresi yazınız.<br>';
				var gonderildi		= '- Form başarıyla gönderilmiştir.<br />Teşekkür ederiz...';
				var gonderilemedi	= '- Form gönderilemedi.<br> Lütfen daha sonra tekrar deneyin...';
				var errContract		= '- Lütfen sözleşmeyi okuyup, onaylayınız.<br>';
				var errPass			= '- Şifre ve şifre tekrarı alanları aynı olmalıdır.<br>';
		}


		/* VALIDATIONS */

		// empty area control
		var zbos=0;
		$(txtID+' .must').each(function(){if (!$(this).val()){$(this).addClass("err"); zbos++;}}); 
		if(zbos != 0 ){hata=hata+doldurun;}


		// email check
		if($(txtID+' input[name=email]').length > 0 ){
			$(this).addClass("err");
			var ebos=0;
			function validateEmail(email){var e=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return e.test(email);} /* " */
			if(!validateEmail($(txtID+' input[name=email]').val())){ $(txtID+' input[name=email]').addClass("err"); ebos++;}
			if(ebos != 0 ){ hata=hata+epostadegil;}
		}


		// contract check
		if($(txtID+' input[name=contract]').length > 0 ){
			var ebos=0;			
			if(!$(txtID+' input[name=contract]').is(":checked") == true){$(txtID+' input[name=contract]').parent().addClass("err"); ebos++;}
			if(ebos != 0 ){ hata=hata+errContract;}
		}


		//pass1 ve pass2 doğruluk kontrolu
		if($(txtID+' input[name=pass1]').length > 0 && $(txtID+' input[name=pass2]').length > 0){
			var ebos=0;
			if(!$(txtID+' input[name=pass1]').val() == '' && !$(txtID+' input[name=pass2]').val() == '' && $(txtID+' input[name=pass1]').val() == $(txtID+' input[name=pass2]').val()){ebos++;}
			if(ebos == 0 ){ hata=hata+errPass; $(txtID+' input[name=pass1]').addClass("err"); $(txtID+' input[name=pass2]').addClass("err");}
		}





		// HATA
		if (hata){
			domID.sauceNtfy({type:'error',text:hata});
		}
		else {
			domID.sauceNtfy({type:'hide'});

			if(method == 'selfPage'){
				domID.submit();
			}
			else {
				formPost(formCls);
				if($(txtID+' input[name=captcha]').length > 0 ){
					//captchaYenile();
				} // hata çıktığında captcha yenileniyor.
			}
		}

	}



	// startForm
	$(txtID+" button[type=submit]").click(function(e){
		e.preventDefault();
		validateForm(config.id,config.method);

		$("html,body").animate({scrollTop:0},1000);
	});


}





/* captcha
function captchaYenile(){
	tarih=new Date();
	document.getElementById('captcha_img').src=url_site + 'captcha.php?t=' + tarih.getTime();
	document.getElementById('captcha').value='';
}
*/








/* dataPost
function dataPost(veri){
		$.ajax({
			type: 'POST',
			url: 'ajax.php',
			data: veri,
			success: function(cvp){
				cvp=cvp.split("|");
				if (cvp[0] == 'yenile'){location.reload();}
				else if (cvp[0] == 'ajaxTggl'){}
			}
		});
		return false;
};
*/




//READY
$(document).ready(function(){

	$("#uyelikForm").sauceForm({method:'post'});
	$("#girisForm").sauceForm({method:'post'});


	/*
		$("#form_iletisim button[type=submit]").click(function(e){e.preventDefault();validateForm('form_iletisim')}); 
		$("#frmEbulten button[type=submit]").click(function(e){e.preventDefault();validateForm('frmEbulten')}); 
		
		$("form").each(function(index){
			console.log(index);
			console.log( $(this).attr("data-ia") );
		});

		$("#otelProfili button[type=submit]").click(function(e){e.preventDefault();validateForm('otelProfili')}); 		// Otel Profili
		$("#iletisimForm button[type=submit]").click(function(e){e.preventDefault();validateForm('iletisimForm');}); 	// iletisim

		$(".sorunBildir").click(function(){dataPost('form=sorunbildir&id='+$(this).attr("rel"))}); //Katalog Ekle Form

		jQuery(function($){
			$("input[name=tel]").mask("(999)-999-99-99");
		});
	*/
	
	
});