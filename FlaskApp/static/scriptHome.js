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
    $(".display-4").eq(0).text("CHI SIAMO");
    $(".display-4").eq(1).text("IL NOSTRO TEAM");
    $(".display-4").eq(2).text("CONTATTI");
    $("p").eq(0).text("Siamo un'azienda leader nel settore della programmazione, specializzata nell'offerta di soluzioni informatiche personalizzate per le aziende. Il nostro team di esperti si dedica alla creazione di siti web su misura per soddisfare le specifiche esigenze di ogni cliente, garantendo qualità e innovazione in ogni progetto.");
    $("p").eq(1).text("Utilizziamo tecnologie all'avanguardia per sviluppare soluzioni uniche che soddisfano le esigenze dei nostri clienti.");
    $("p").eq(2).text("Lavoriamo a stretto contatto con i nostri clienti per garantire che ogni progetto sia un successo.");
    $("p").eq(3).text("Il nostro obiettivo è sempre quello di superare le aspettative e fornire risultati tangibili e misurabili.");
    $("p").eq(4).text("Il nostro team è composto da esperti altamente qualificati pronti a trasformare le vostre idee in realtà.");
    $("p").eq(5).text("Sviluppatore Back-end");            
    $("p").eq(6).text("Sviluppatore Front-end");            
    $("p").eq(7).text("Sviluppatore Full-Stack");            
    $("p").eq(8).text("Sviluppatore Front-end");            
    $("p").eq(9).text("Sviluppatore Front-end Wordpress");            
    $("p").eq(10).text("Sviluppatore Back-end WordPress");            
    
    $("p").eq(11).text("Siamo qui per te! Non esitare a contattarci per qualsiasi informazione o richiesta di collaborazione.");
    $("h3").eq(0).text("Innovazione");
    $("h3").eq(1).text("Collaborazione");
    $("h3").eq(2).text("Risultati");

    $("#social").text("Seguici sui Social");
    $("#spanContattiFooterLink").text("Contatti");
    $('input[type="text"]').attr('placeholder', 'Il tuo Nome');
    $('input[type="email"]').attr('placeholder', 'La tua Email');
    $('textArea#message').attr('placeholder', 'Il tuo Messaggio');
    $('button[type="submit"]').attr('placeholder', 'Invia Messaggio');
    $('button[type="submit"]').text('Invia Messaggio');
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
    $(".display-4").eq(0).text("WHO WE ARE");
    $(".display-4").eq(1).text("OUR TEAM");
    $(".display-4").eq(2).text("CONTACT US");
    $("p").eq(0).text("We are a leading company in the programming sector, specialized in offering customized IT solutions for businesses. Our team of experts is dedicated to creating tailor-made websites to meet the specific needs of each client, ensuring quality and innovation in every project.");
    $("p").eq(1).text("We use cutting-edge technologies to develop unique solutions that meet our clients' needs.");
    $("p").eq(2).text("We work closely with our clients to ensure that every project is a success.");
    $("p").eq(3).text("Our goal is always to exceed expectations and provide tangible and measurable results.");
    $("p").eq(4).text("Our team consists of highly qualified experts ready to turn your ideas into reality.");
    $("p").eq(5).text("Back-end Developer");
    $("p").eq(6).text("Front-end Developer");
    $("p").eq(7).text("Full-Stack Developer");
    $("p").eq(8).text("Front-end Developer");
    $("p").eq(9).text("Front-end Wordpress Developer");
    $("p").eq(10).text("Back-end Wordpress Developer");


    $("p").eq(11).text("We are here for you! Do not hesitate to contact us for any information or collaboration request.");
    $("h3").eq(0).text("Innovation");
    $("h3").eq(1).text("Collaboration");
    $("h3").eq(2).text("Results");

    $("#social").text("Follow us on Social");
    $("#spanContattiFooterLink").text("Contacts");
    $('input[type="text"]').attr('placeholder', 'Your Name');
    $('input[type="email"]').attr('placeholder', 'Your Email');
    $('textArea#message').attr('placeholder', 'Your Message');
    $('button[type="submit"]').attr('placeholder', 'Send Message');
    $('button[type="submit"]').text('Send Message');
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
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scroll');
    } else {
        navbar.classList.remove('navbar-scroll');
    }
});

//Messaggio email
(function() {
    emailjs.init('-NpgRRBEDBNq3laxi'); // Sostituisci con il tuo User ID di EmailJS
})();
document.getElementById('contactForm').addEventListener('submit', function() {

    const serviceID = 'service_b3hsjca'; // Sostituisci con il tuo Service ID di EmailJS
    const templateID = 'template_iw5pc6p'; // Sostituisci con il tuo Template ID di EmailJS

    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(response => {
            // Mostra un popup con il messaggio di successo
            alert('Messaggio inviato con successo.');
        })
        .catch(error => {
            // Mostra un popup con il messaggio di errore
            alert('Errore nell\'invio del messaggio. Si prega di riprovare.');
        });
});


//Schermata di caricamento
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    setTimeout(function () { loader.style.display = "none"; }, 200); // ritardo in millisecondi
    //1000 millisecondi = 1 secondo
});

