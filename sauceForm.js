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
			error: 		function(){domID.sauceNtfy({text:errSend});},
			success: 	function(response){	response=response.split("|");
				switch (response[0]){
					case 'true': 	// true
						if(response[1])	{
							domID.sauceNtfy({type:'true',text:response[1]});
							domID.hide(); 											// Form gönderildikten sonra form alanı siliniyor.
						}
						else		{ domID.sauceNtfy({type:'true',text:trueSend}); }
						$('.'+id+' input, .'+id+' textarea, .'+id+' select').not("input[type=hidden]").val('');		// form başarılı gönderildikten sonra input,textarea,select alanlarını boşaltıyor.
						break;
					case 'false': 	// false
						if(response[1])	{ domID.sauceNtfy({text:response[1]});}
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
						domID.sauceNtfy({text:response});
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
				var errNull 		= '- Please Fill in all fields.<br>';
				var errNotMail		= '- Please Enter a valid email address.<br>';
				var trueSend		= '- Form has been sent successfully.<br />Thank you...';
				var errSend			= '- ';
				var errContract		= '- <br>';
				var errPass			= '- Şifre ve şifre tekrarı alanları aynı olmalıdır.<br>';
		}
		else {
				var errNull 		= '- Lütfen tüm alanları doldurunuz.<br>';
				var errNotMail		= '- Lütfen geçerli bir E-Mail adresi yazınız.<br>';
				var trueSend		= '- Form başarıyla gönderilmiştir.<br />Teşekkür ederiz...';
				var errSend			= '- Form gönderilemedi.<br> Lütfen daha sonra tekrar deneyin...';
				var errContract		= '- Lütfen sözleşmeyi okuyup, onaylayınız.<br>';
				var errPass			= '- Şifre ve şifre tekrarı alanları aynı olmalıdır.<br>';
		}


		/* VALIDATIONS */

		// empty area control
		var zbos=0;
		$(txtID+' .must').each(function(){if (!$(this).val()){$(this).addClass("err"); zbos++;}}); 
		if(zbos != 0 ){hata=hata+errNull;}


		// email check
		var domMail = $(txtID+' input[name=email]');
		if(domMail.length > 0 ){
			$(this).addClass("err");
			var ebos=0;
			function validateEmail(email){var e=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return e.test(email);} /* " */
			if(!validateEmail(domMail.val())){ domMail.addClass("err"); ebos++;}
			if(ebos != 0 ){ hata=hata+errNotMail;}
		}


		// contract check
		var domContract = $(txtID+' input[name=contract]');
		if(domContract.length > 0 ){
			var ebos=0;			
			if(!domContract.is(":checked") == true){domContract.parent().addClass("err"); ebos++;}
			if(ebos != 0 ){ hata=hata+errContract;}
		}


		//pass1 & pass2 validate
		var domPass1 = $(txtID+' input[name=pass1]');
		var domPass2 = $(txtID+' input[name=pass2]');
		if(domPass1.length > 0 && domPass2.length > 0){
			var ebos=0;
			if(!domPass1.val() == '' && !domPass2.val() == '' && domPass1.val() == domPass2.val()){ebos++;}
			if(ebos == 0 ){ hata=hata+errPass; domPass1.addClass("err"); domPass2.addClass("err");}
		}





		// ERROR
		if (hata){
			domID.sauceNtfy({text:hata});
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