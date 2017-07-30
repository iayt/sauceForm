<?php

    if (isset($_POST['form']) && $_POST['form']=='uyelikForm'){

        die('true|Başarılı.');      // true
        //die('false|Başarısız.');  // false
        //die('refresh');           // refresh

    }
    if (isset($_POST['form']) && $_POST['form']=='girisForm'){

        die('true|Giriş Başarılı.');

    }
    else {

    	die('false|- Bir Hata Oluştu. [ERR:101]');

    }

?>