(function() {
	
	this.sauceForm1 = function(arg) {

		const config = {
			id: 		arg.id, 														// Id'si
			method: 	(!arg.method) 		? 'post' 	: arg.method,					// post/selfPage 	(default: post)
			lang: 		(!arg.lang) 		? 'tr' 		: arg.lang,						// lang 			(default: tr)
			afteract:	(!arg.afteract) 	? 'clear'	: arg.afteract,					// clear/hide
			alertpos: 	(!arg.alertpos) 	? arg.id 	: arg.alertpos,					// Alert Position 	(default: NULL)
			url:		document.querySelector('meta[name=web-url]').content
		};

		const txtID = '#'+config.id;
		const domID = document.querySelector(txtID);
		//const alertPosition = (config.alertpos != '') ? document.querySelector('#'+config.alertpos) : domID;
		const alertPosition = $('#'+ config.alertpos);
		
		// globals
		domID.insertAdjacentHTML('beforeend', '<input type="hidden" name="form" value="'+config.id+'">');
		

		// to select form elements with filter
		function formItems(filter){
			return document.querySelectorAll(txtID+filter);
		}


		// VALIDATE
		function validateForm(formCls,method){
			
			formItems(' input:not([type=hidden])').forEach(function(e){ e.classList.remove('err'); }); // remove all .err


			let hata=[];

			const errMessages = [
				{name:"trueSend", 	tr:"Form başarıyla gönderilmiştir.<br>Teşekkür ederiz...", 			en:"The form has been sent successfully.<br />Thank you..."},
				{name:"errSend", 	tr:"Form gönderilemedi.<br> Lütfen daha sonra tekrar deneyin...", 	en:"The form could not be sent.<br>Please try again later."},
				{name:"errNull", 	tr:"Lütfen tüm alanları doldurunuz.", 								en:"Please Fill in all fields."},
				{name:"errRadio", 	tr:"Lütfen şıklardan birini seçiniz.", 								en:"Please select one of the options."},
				{name:"errNotName", tr:"Lütfen doğru bir isim giriniz.", 								en:"Please enter a valid name."},
				{name:"errNotMail", tr:"Lütfen geçerli bir E-Mail adresi yazınız.", 					en:"Please enter a valid email."},
				{name:"errContract",tr:"Lütfen sözleşmeyi okuyup, onaylayınız.", 						en:"Please read and agree to the contract."},
				{name:"errPass", 	tr:"Şifre ve şifre tekrarı alanları aynı olmalıdır.", 				en:"Password and password recovery fields must be the same."}
			]


			function getError(name){
				return errMessages.filter(message => message.name == name)[0][config.lang];
			}


			
			
			// empty area control
			var itemEmpty = [];
			function emptyAreas(){
				formItems(' .must:not([type=hidden])').forEach(function(e){
					if(!e.value){
						e.classList.add('err');
						itemEmpty.push("false");
					}
				});
				return itemEmpty;
			}

			if(emptyAreas()){
				for (let item of itemEmpty) {
					if (!item.value) {
						hata.push(getError('errNull'));
						break;
					}
				}
			}


		
			// email check
			const domMail = formItems('  input[name=email]');
			if(domMail){
				function validateEmail(email){var e=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return e.test(email);} /* " */
				if(!validateEmail(domMail[0].value)){ 
					domMail[0].classList.add('err'); 
					hata.push(getError('errNotMail'));
				}
			}
	
	
			// contract check
			var domContract = $(txtID+' input[name^="contract_"]');
			if(domContract.length > 0 ){
				var ebos=0;
				
				domContract.each(function(){ 
					if(!$(this).is(":checked") == true){$(this).parent().addClass("err"); ebos++;}
				})
				
				if(ebos != 0 ){
					hata.push(getError('errContract'));
				}
			}
	
	
			// pass1 & pass2 validate
			var domPass1 = $(txtID+' input[name=pass1]');
			var domPass2 = $(txtID+' input[name=pass2]');
			if(domPass1.length > 0 && domPass2.length > 0){
				var ebos=0;
				if(!domPass1.val() == '' && !domPass2.val() == '' && domPass1.val() == domPass2.val()){ebos++;}
				if(ebos == 0 ){ 
					domPass1.addClass("err");
					domPass2.addClass("err");

					hata.push(getError('errPass'));
				}
			}
	
	
			// multi-radio
			var zbos=0;
			$(txtID+' .multi-radio').each(function(){
				var thisArea = $(this);
	
				if (!thisArea.find('input[type=radio]').is(":checked") ){
					console.log('a.b');
					thisArea.addClass("err"); zbos++;
				}
			}); 
			if(zbos != 0 ){
				hata.push(getError('errRadio'));
			}



			// ERROR
			if (hata.length > 0){
				let lastHata = '';
				hata.forEach((element,index) => {lastHata += '- '+element+'<br>';});
				alertPosition.sauceNtfy({text:lastHata});
			}
			else {
				alertPosition.sauceNtfy({type:'hide'});
	
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

		





		// START FORM
		document.querySelector(txtID +' button[type=submit]').addEventListener('click', function(e){
			e.preventDefault();

			validateForm(config.id,config.method);

			$("html,body").animate({scrollTop:($(txtID).offset().top-30)},1000);
		});
		
	}

}());