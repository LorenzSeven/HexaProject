function temaChiaro()
{
    document.documentElement.setAttribute('data-theme', "light"); // Imposta il tema del documento a "light"
    localStorage.setItem('theme', "light"); // Salva il tema "light" nel localStorage
    $('#themeIcon').removeClass('fa-moon').addClass('fa-sun'); // Cambia l'icona del tema da luna a sole
    $("#darkTheme").removeClass('selected'); // Rimuove la classe "selected" dall'opzione tema scuro
    $("#lightTheme").addClass('selected'); // Aggiunge la classe "selected" all'opzione tema chiaro
}
function temaScuro()
{
    document.documentElement.setAttribute('data-theme', "dark"); // Imposta il tema del documento a "dark"
    localStorage.setItem('theme', "dark"); // Salva il tema "dark" nel localStorage
    $('#themeIcon').removeClass('fa-sun').addClass('fa-moon'); // Cambia l'icona del tema da sole a luna
    $("#darkTheme").addClass('selected'); // Aggiunge la classe "selected" all'opzione tema scuro
    $("#lightTheme").removeClass('selected'); // Rimuove la classe "selected" dall'opzione tema chiaro
}

function linguaItaliana()
{
    document.documentElement.setAttribute('lang', "it"); // Imposta la lingua del documento su "it"
    localStorage.setItem('language', "it"); // Salva la nuova lingua "it" nel localStorage
    $('#languageIcon').removeClass('flag-icon-gb').addClass('flag-icon-it'); // Cambia l'icona della lingua da inglese a italiana
    $("#englishLanguage").removeClass('selected'); // Rimuove la classe "selected" dall'opzione lingua inglese
    $("#italianLanguage").addClass('selected'); // Aggiunge la classe "selected" all'opzione lingua italiana

    $("#spanContatti").text("Contatti");
    $("#temaChiaro").text(" Chiaro");
    $("#temaScuro").text(" Scuro");
    $("#linguaIT").text(" Italiano");
    $("#linguaEN").text(" Inglese");

    $("#resettaPassword").text("Resetta Password");
    $('input.input100[name="old"]').attr('placeholder', 'Scrivi la tua vecchia password');
    $('input.input100[name="new"]').attr('placeholder', 'Scrivi la tua nuova password'); 
    $('#validazioneVecchiaPassword').attr('data-validate', "La vecchia password è necessaria");
    $('#validazioneNuovaPassword').attr('data-validate', 'La nuova password è necessaria');
    $('#oldPassword').text('Vecchia Password');
    $('#newPassword').text('Nuova Password');
    $('button.login100-form-btn').text("Resetta");

    $("#social").text("Seguici sui Social");
    $("#spanContattiFooterLink").text("Contatti");
    $("#contattiFooter").text("Contatti");
    $("#indirizzo").text("Indirizzo");
    $("#telefono").text("Telefono");
    $("#dirittiRiservati").text("2024 Hexa-group S.P.A. Tutti i diritti riservati.");
    $("#simulazioneAzienda").text("Simulazione d'azienda, esercizio scolastico");
}

function linguaInglese()
{
    document.documentElement.setAttribute('lang', "en"); // Imposta la lingua del documento su "en"
    localStorage.setItem('language', "en"); // Salva la nuova lingua "en" nel localStorage
    $('#languageIcon').removeClass('flag-icon-it').addClass('flag-icon-gb'); // Cambia l'icona della lingua da italiana a inglese
    $("#englishLanguage").addClass('selected'); // Aggiunge la classe "selected" all'opzione lingua inglese
    $("#italianLanguage").removeClass('selected'); // Rimuove la classe "selected" dall'opzione lingua italiana

    $("#spanContatti").text("Contacts");
    $("#temaChiaro").text(" Light");
    $("#temaScuro").text(" Dark");
    $("#linguaIT").text(" Italian");
    $("#linguaEN").text(" English");

    $("#resettaPassword").text("Reset Password");
    $('input.input100[name="old"]').attr('placeholder', 'Type your old password');
    $('input.input100[name="new"]').attr('placeholder', 'Type your new password'); 
    $('#validazioneVecchiaPassword').attr('data-validate', 'Old password is required');
    $('#validazioneNuovaPassword').attr('data-validate', 'New password is required');
    $('#oldPassword').text('Old Password');
    $('#newPassword').text('New Password');
    $('button.login100-form-btn').text("Reset");

    $("#social").text("Follow us on Social");
    $("#spanContattiFooterLink").text("Contacts");
    $("#contattiFooter").text("Contacts");
    $("#indirizzo").text("Address");
    $("#telefono").text("Telephone");
    $("#dirittiRiservati").text("2024 Hexa-group S.P.A. All rights reserved");
    $("#simulazioneAzienda").text("Simulation of enterprise, school exercise");
}


$(document).ready(function () {
    const tema = localStorage.getItem('theme');
    if (tema == null)
    {
        temaChiaro();
    }
    else if (tema != null)
    {
        if (tema == "light")
        {
            temaChiaro();
        }
        else
        {
            temaScuro();
        }
    }
    const lingua = localStorage.getItem('language');
    if (lingua == null)
    {
        linguaItaliana();
    }
    else if (lingua != null)
    {
        if (lingua == "it")
        {
            linguaItaliana();
        }
        else
        {
            linguaInglese();
        }
    }


    // Funzione per gestire la chiusura del menu in modalità mobile e cambiare il colore della voce di menu attiva
    $('.nav-link').click(function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });
    //animazione scorrimento verso navbar-link
    $('#HomeNavbar').on('click', function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
    $('#TeamNavbar').on('click', function() {
        var targetOffset = $("#team").offset().top;
        $("html, body").animate({ scrollTop: targetOffset }, 500);
    });
    $('#ContattiNavbar').on('click', function() {
        var targetOffset = $("#contatti").offset().top;
        $("html, body").animate({ scrollTop: targetOffset }, 500);
    });

    $('#HomeFooter').on('click', function() {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
    $('#TeamFooter').on('click', function() {
        var targetOffset = $("#team").offset().top;
        $("html, body").animate({ scrollTop: targetOffset }, 500);
    });
    $('#ContattiFooter').on('click', function() {
        var targetOffset = $("#contatti").offset().top;
        $("html, body").animate({ scrollTop: targetOffset }, 500);
    });

    //rimozione comportamento di default del tag a, che riporta sempre in alto la visualizzazione pagina
    $('.dropdown-menu.tema a').click(function(event) {
        event.preventDefault();
    });
    $('.dropdown-menu.lingua a').click(function(event) {
        event.preventDefault();
    });


});

// Funzione per gestire lo scroll della navbar
window.addEventListener('scroll', function () {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 30) {
        navbar.classList.add('navbar-scroll');
    } else {
        navbar.classList.remove('navbar-scroll');
    }
});

$(document).ready(function() {
    $('.input100').focus(function() {
        $(this).parent().addClass('input100-focus');
    });
    $('.input100').blur(function() {
        $(this).parent().removeClass('input100-focus');
    });
});

//Schermata di caricamento
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    setTimeout(function () { loader.style.display = "none"; }, 200); // ritardo in millisecondi
    //1000 millisecondi = 1 secondo
});