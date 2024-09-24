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

    $("#registrazione").text("Registrazione");
    $('input.input100[type="email"]').attr('placeholder', 'Scrivi la tua email');    
    $('input.input100[type="text"]').attr('placeholder', 'Scrivi il tuo username');
    $('input.input100[type="password"]').attr('placeholder', 'Scrivi la tua password');
    $('#validazioneEmail').attr('data-validate', "L'Email è necessaria");    
    $('#validazioneUsername').attr('data-validate', "L'username è necessaria");
    $('#validazionePassword').attr('data-validate', 'La password è necessaria');
    $('button.login100-form-btn').text("Registrati");

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

    $("#registrazione").text("Sign Up");
    $('input.input100[type="email"]').attr('placeholder', 'Type your email');
    $('input.input100[type="text"]').attr('placeholder', 'Type your username');
    $('input.input100[type="password"]').attr('placeholder', 'Type your password');
    $('#validazioneEmail').attr('data-validate', "Email is required");    
    $('#validazioneUsername').attr('data-validate', "Username is required");
    $('#validazionePassword').attr('data-validate', 'Password is required');
    $('button.login100-form-btn').text("Sign Up");

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