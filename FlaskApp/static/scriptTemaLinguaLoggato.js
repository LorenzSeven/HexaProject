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

    $('input[type="search"]').attr('placeholder', 'Cerca...'); // Imposta il placeholder a una stringa vuota
    $('#StudiCommercialistiTitolo').text("Studi Commercialisti");
    $('#preferitiTesto').text("Preferiti");
    $('#preferitiTesto2').text("Preferiti");
    $('#temaChiaro').text("Chiaro");
    $('#temaScuro').text("Scuro");
    $('#linguaIT').text("Italiano");
    $('#linguaEN').text("Inglese");
    $('#resettaPasswordTesto').text("Resetta Password");
    $('#eliminaAccountTesto').text("Elimina Account");
    $('#preferiti').text("Preferiti");
    $('#mappa').text("Vedi su Mappa");
    $('#contatti').text("Contatti");
    $('#indirizzo').text("Indirizzo");
    $('#telefono').text("Telefono");
    $('#social').text("Seguici sui Social");
    $('#preferiti2').text("Preferiti");
    $('#dirittiRiservati').text("2024 Hexa-group S.P.A. Tutti i diritti riservati.");
    $("#simulazioneAzienda").text("Simulazione d'azienda, esercizio scolastico");
}

function linguaInglese()
{
    document.documentElement.setAttribute('lang', "en"); // Imposta la lingua del documento su "en"
    localStorage.setItem('language', "en"); // Salva la nuova lingua "en" nel localStorage
    $('#languageIcon').removeClass('flag-icon-it').addClass('flag-icon-gb'); // Cambia l'icona della lingua da italiana a inglese
    $("#englishLanguage").addClass('selected'); // Aggiunge la classe "selected" all'opzione lingua inglese
    $("#italianLanguage").removeClass('selected'); // Rimuove la classe "selected" dall'opzione lingua italiana

    $('input[type="search"]').attr('placeholder', 'Search...'); // Imposta il placeholder a una stringa vuota
    $('#StudiCommercialistiTitolo').text("Accounting Firms");
    $('#preferitiTesto').text("Favorities");
    $('#preferitiTesto2').text("Favorities");
    $('#temaChiaro').text("Light");
    $('#temaScuro').text("Dark");
    $('#linguaIT').text("Italian");
    $('#linguaEN').text("English");
    $('#resettaPasswordTesto').text("Reset Password");
    $('#eliminaAccountTesto').text("Remove Account");
    $('#preferiti').text("Favorities");
    $('#mappa').text("See on map");
    $('#contatti').text("Contacts");
    $('#indirizzo').text("Address");
    $('#telefono').text("Telephone");
    $('#social').text("Follow us on Social");
    $('#preferiti2').text("Favorities");
    $('#dirittiRiservati').text("2024 Hexa-group S.P.A. All rights reserved.");
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

    //Impaginazione
    // Usa MutationObserver per rilevare l'aggiunta di nuovi elementi
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('.tabulator-page[data-page="first"]')) 
                {
                    node.textContent = '';
                }
                if (node.nodeType === 1 && node.matches('.tabulator-page[data-page="prev"]')) 
                {
                    node.textContent = '';
                }
                if (node.nodeType === 1 && node.matches('.tabulator-page[data-page="next"]')) 
                {
                    node.textContent = '';
                }
                if (node.nodeType === 1 && node.matches('.tabulator-page[data-page="last"]')) 
                {
                    node.textContent = '';
                }
            });
        });
    }).observe(document.body, { childList: true, subtree: true });

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

// Funzione per gestire la chiusura del menu in modalità mobile e cambiare il colore della voce di menu attiva
$('.nav-link').click(function () {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    if ($('.navbar-toggler').is(':visible')) {
        $('.navbar-collapse').collapse('hide');
    }
});

//cambio testo dropdown
document.addEventListener("DOMContentLoaded", function() {
    function cambiaTestoDropdown(language) 
    {
        const dropdownTitle = (language === "it") ? "Tutte le città" : "All cities";
        const tutteLeCittaOption = document.querySelector('.dropdown-menu.cities .dropdown-item[data-value = ""]');
        if (tutteLeCittaOption) tutteLeCittaOption.innerText = dropdownTitle;
        document.getElementById('citiesDropdown').innerText = dropdownTitle;
    }

    // Event handler per cambiare lingua
    document.querySelector('.lingua #italianLanguage').addEventListener('click', function () {
        localStorage.setItem('language', 'it');
        cambiaTestoDropdown('it');
    });

    document.querySelector('.lingua #englishLanguage').addEventListener('click', function () {
        localStorage.setItem('language', 'en');
        cambiaTestoDropdown('en');
    });

    // Imposta il testo del dropdown in base alla lingua corrente al momento del caricamento della pagina
    const currentLanguage = localStorage.getItem('language') || 'it';
    cambiaTestoDropdown(currentLanguage);
});


//Schermata di caricamento
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    setTimeout(function () { loader.style.display = "none"; }, 200); // ritardo in millisecondi
    //1000 millisecondi = 1 secondo
});