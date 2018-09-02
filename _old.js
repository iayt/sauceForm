$.fn.sauceForm=function(config){
    var errNull,errNotName,errNotMail,trueSend,errSend,errContract,errPass,errRadio;
    
        // configs
        var config=$.extend({
            id: 		this[0].id, 				// Id'si
            method: 	'post',						// post/selfPage 	(default: post)
            //lang: 		'tr',						// lang 			(default: tr)
            afteract:	'clear',					// clear/hide
            url:		$('meta[name=web-url]').attr("content"),
            alertpos: 	''							// Alert Position 	(default: NULL)
        }, config);
    
        var txtID="#"+config.id;
        var domID=$(txtID);
        var alertPosition = (config.alertpos != '') ? $('#'+config.alertpos) : domID;
    
    
        // globals
        domID.append('<input type="hidden" name="form" value="'+config.id+'" />');
    
    
        // formPost
        function formPost(id){ 
    
            alertPosition.sauceNtfy({type:'loading',text:'Form gÃ¶nderiliyor... LÃ¼tfen bekleyiniz.'});
            domID.find('button').hide();	// button hide
    
            // Change data before send
            //console.log(domID.serialize());
    
            $.ajax({
                type: 		'POST',
                //url: 		$('meta[name=web-url]').attr("content")+domID.attr("action"),
                url: 		domID.attr("action"),
                data: 		domID.serialize()+ "&_token="+$('meta[name=token]').attr("content"),		//serializeArray()
                beforeSend: function(){},
                error: 		function(res){
                    var response = res.responseJSON
                    //console.log(response);
                    if(response.message && response.message != "")	{ errSend = response.message; }
                    alertPosition.sauceNtfy({type:'error',text:errSend});
                    domID.find('button').show();
                },
                success: 	function(response){	
                    switch (response.status){
                        case true: 	// true
                            if(response.message && response.message != "")	{
                                trueSend = response.message;
                            }
                            alertPosition.sauceNtfy({type:'true',text:trueSend});
                                                    
    
                            if(config.afteract == 'clear'){
                                $('#'+config.id+' input, #'+config.id+' textarea, #'+config.id+' select').not("input[type=hidden]").val('');		// form baÅŸarÄ±lÄ± gÃ¶nderildikten sonra input,textarea,select alanlarÄ±nÄ± boÅŸaltÄ±yor.
                            }
                            else if(config.afteract == 'hide'){
                                domID.hide();					// Form gÃ¶nderildikten sonra form alanÄ± siliniyor.
                            }
    
                            break;
                        case false: 	// false
                            if(response.message && response.message != "")	{
                                errSend = response.message;
                            }
                            alertPosition.sauceNtfy({type:'error',text:errSend});
                            domID.find('button').show();
                            break;
                        case 'refresh':	// refresh
                            var msg='Sayfa yÃ¶nleniyor...';
                            if(response.message){ msg=response.message;}							// refresh yaparken php den gelen mesaj varsa
                            if(response.url){ 
                                window.location=response.url;
                                alertPosition.sauceNtfy({type:'loading',text:msg});
                            }				// refresh yaparken php den gelen adres varsa
                            else {
                                alertPosition.sauceNtfy({type:'loading',text:msg});
                                domID.hide(); 											// Form gÃ¶nderildikten sonra form alanÄ± siliniyor.
                                location.reload();
                            }
                            break;
                        default:
                            alertPosition.sauceNtfy({text:response});
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
            if( $(txtID+' input[name=lang]').val() == 'en' ){
                    trueSend		= 'The form has been sent successfully.<br />Thank you...';
                    errSend			= 'The form could not be sent.<br>Please try again later.';	
                    errNull 		= '- Please Fill in all fields.<br>';
                    errRadio		= '- Please select one of the options.<br>';
                    errNotName 		= '- Please enter a valid name.<br>';
                    errNotMail		= '- Please enter a valid email.<br>';
                    errContract		= '- Please read and agree to the contract.<br>';
                    errPass			= '- Password and password recovery fields must be the same.<br>';
            }
            else {
                    trueSend		= 'Form baÅŸarÄ±yla gÃ¶nderilmiÅŸtir.<br>TeÅŸekkÃ¼r ederiz...';
                    errSend			= 'Form gÃ¶nderilemedi.<br> LÃ¼tfen daha sonra tekrar deneyin...';
                    errNull 		= '- LÃ¼tfen tÃ¼m alanlarÄ± doldurunuz.<br>';
                    errRadio		= '- LÃ¼tfen ÅŸÄ±klardan birini seÃ§iniz.<br>';
                    errNotName 		= '- LÃ¼tfen doÄŸru bir isim giriniz.<br>';
                    errNotMail		= '- LÃ¼tfen geÃ§erli bir E-Mail adresi yazÄ±nÄ±z.<br>';
                    errContract		= '- LÃ¼tfen sÃ¶zleÅŸmeyi okuyup, onaylayÄ±nÄ±z.<br>';
                    errPass			= '- Åifre ve ÅŸifre tekrarÄ± alanlarÄ± aynÄ± olmalÄ±dÄ±r.<br>';
            }
    
    
            /* VALIDATIONS */
    
            // empty area control
            var zbos=0;
            $(txtID+' .must').not(":hidden").each(function(){if (!$(this).val()){$(this).addClass("err"); zbos++;}}); 
            if(zbos != 0 ){hata=hata+errNull;}
            // + yerine concat() ekle
    
    
            // fullname
            /*
            var domFname = $(txtID+' input[name=fullname]');
            if(domFname.length > 0){
    
                //if(domFname.split(' ').length == 2 && domFname.split(' ')[0].length < 2 ){domFname.addClass("err"); hata=hata+errNotName;}
                //if(domFname.split(' ').length < 2 ){domFname.addClass("err"); hata=hata+errName;}
                
            }*/
    
    
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
            var domContract = $(txtID+' input[name^="contract_"]');
            if(domContract.length > 0 ){
                var ebos=0;
                
                domContract.each(function(){ 
                    if(!$(this).is(":checked") == true){$(this).parent().addClass("err"); ebos++;}
                })
                
                if(ebos != 0 ){ hata=hata+errContract;}
            }
    
    
            // pass1 & pass2 validate
            var domPass1 = $(txtID+' input[name=pass1]');
            var domPass2 = $(txtID+' input[name=pass2]');
            if(domPass1.length > 0 && domPass2.length > 0){
                var ebos=0;
                if(!domPass1.val() == '' && !domPass2.val() == '' && domPass1.val() == domPass2.val()){ebos++;}
                if(ebos == 0 ){ hata=hata+errPass; domPass1.addClass("err"); domPass2.addClass("err");}
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
            if(zbos != 0 ){hata=hata+errRadio;}
    
    
            // parent Tab ID
    
    
            // ERROR
            if (hata){
                alertPosition.sauceNtfy({text:hata});
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
                    } // hata Ã§Ä±ktÄ±ÄŸÄ±nda captcha yenileniyor.
                }
            }
    
        }
    
    
    
        // startForm
        $(txtID+" button[type=submit]").click(function(e){
            e.preventDefault();
            validateForm(config.id,config.method);
    
            $("html,body").animate({scrollTop:($(txtID).offset().top-30)},1000);
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