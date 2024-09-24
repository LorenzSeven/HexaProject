$(document).ready(function () {

    // Event listeners for navbar links
    $('#HomeNavbar').click(function (event) {
        event.preventDefault();
        window.location.href = '/';
    });
    $('#logout').click(function (event) {
        event.preventDefault();
        window.location.href = '/';
    });

    $('#HexaProject').click(function (event) {
        event.preventDefault();
        window.location.href = '/hexaProject';
    });

    $('#HexaprojectLoggato').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaLoggato';
    });

    $('#Login').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaLogin';
    });

    $('#Registrati').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaRegistrazione';
    });

    $('#Preferiti').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaPreferiti';
    });

    $('#resettaPassword').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaResettaPassword';
    });

    $('#resettaPasswordTesto').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaResettaPassword';
    });

    $('#eliminaAccount').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginaEliminaAccount';
    });

    $('#vediSuMappa').click(function (event) {
        event.preventDefault();
        window.location.href = '/paginavediSuMappa';
    });

    // script per la registrazione
    $('#register-form').on('submit', function (e) {
        e.preventDefault();  // Previene il comportamento predefinito del form di inviare una richiesta HTTP
        const email = $('#register-email').val();  // Ottiene il valore del campo 'email' dal form di registrazione
        const username = $('#register-username').val();  // Ottiene il valore del campo 'username' dal form di registrazione
        const password = $('#register-password').val();  // Ottiene il valore del campo 'password' dal form di registrazione

        // Effettua una richiesta AJAX per registrare un nuovo account
        $.ajax({
            url: '/register',  // URL dell'endpoint di registrazione
            method: 'POST',  // Metodo HTTP da usare
            contentType: 'application/json',  // Tipo di contenuto della richiesta
            data: JSON.stringify({ username: username, password: password, email: email }),  // Dati da inviare al server in formato JSON
            success: function (response) {  // Callback in caso di successo
                alert(response.message);  // Mostra un messaggio di successo all'utente
                window.location.href = '/paginaLogin';
            },
            error: function (xhr) {  // Callback in caso di errore
                alert(xhr.responseJSON.message);  // Mostra un messaggio di errore all'utente
            }
        });
    });

    // Eliminazione di un account
    $('#delete-account-form').on('submit', function (e) {
        e.preventDefault();  // Previene il comportamento predefinito del form
        const username = $('#delete-username').val();  // Ottiene il valore del campo 'username' dal form di eliminazione account
        const email = $('#delete-email').val();  // Ottiene il valore del campo 'email' dal form di eliminazione account
        const password = $('#delete-password').val();  // Ottiene il valore del campo 'password' dal form di eliminazione account

        const userId = $("#user-id").val();

        // Verifica se tutti i campi sono riempiti
        if (!username || !email || !password) {
            alert('Please fill in all fields.');  // Mostra un avviso se mancano campi
            return;
        }

        // Effettua una richiesta AJAX per eliminare l'account
        $.ajax({
            url: '/delete_account',  // URL dell'endpoint di eliminazione account
            method: 'POST',  // Metodo HTTP da usare
            contentType: 'application/json',  // Tipo di contenuto della richiesta
            data: JSON.stringify({ username: username, email: email, password: password, id_user: userId }),  // Dati da inviare al server in formato JSON
            success: function (response) {  // Callback in caso di successo
                alert(response.message);  // Mostra un messaggio di successo all'utente
                window.location.href = '/';
            },
            error: function (xhr) {  // Callback in caso di errore
                alert(xhr.responseJSON.message);  // Mostra un messaggio di errore all'utente
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');  // Log per confermare che il DOM è completamente caricato

    // Gestione del login tramite Fetch API
    const loginForm = document.querySelector('.login100-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();  // Previene il comportamento predefinito del form di inviare una richiesta HTTP
            console.log('Form submitted');

            const username = document.querySelector('input[name="username"]').value;  // Ottiene il valore del campo 'username'
            const password = document.querySelector('input[name="pass"]').value;  // Ottiene il valore del campo 'password'
            console.log('Username:', username);
            console.log('Password:', password);

            try {
                const response = await fetch('/login', {
                    method: 'POST',  // Metodo HTTP da usare
                    headers: {
                        'Content-Type': 'application/json',  // Tipo di contenuto della richiesta
                    },
                    body: JSON.stringify({ username, password }),  // Dati da inviare al server in formato JSON
                });

                const result = await response.json();  // Converte la risposta JSON in un oggetto JavaScript
                console.log('Response:', result);

                if (result.success) {
                    console.log('Login successful, redirecting...');
                    window.location.href = '/paginaLoggato';  // Reindirizza l'utente alla pagina loggata in caso di successo
                } else {
                    alert(result.message);  // Mostra un messaggio di errore in caso di credenziali non valide
                }
            } catch (error) {
                console.error('Error:', error);  // Log in caso di errore nella richiesta
            }
        });
    } else {
        console.log('Login form not found');  // Log in caso di mancato ritrovamento del form di login
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login100-form");

    if (form)
    {
        form.addEventListener("submit", async function (event) {
           event.preventDefault();

            var userId = $("#user-id").val();
           const oldPassword = form.querySelector("input[name='old']").value;
           const newPassword = form.querySelector("input[name='new']").value;

           // Basic validation
            if (!oldPassword || !newPassword) {
                alert("Please fill in all fields.");
             return;
         }

            try {
                const response = await fetch("/change_password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        old_password: oldPassword,
                        new_password: newPassword,
                        id_user: userId
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Password changed successfully!");
                } else {
                    alert(`Error: ${result.message}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while changing the password.");
            }
        });        
    }

});


document.addEventListener("DOMContentLoaded", function () {
    $(document).on('click', '#commercialisti-table .vediSuMappa', function () {
        const container = $(this).closest('.contenitore-generale')[0];
        const id = $(this).data('id');  // Assumi che l'elemento abbia l'attributo data-id

        // Redirect alla nuova pagina passando l'id come parametro nella query string
        window.location.href = '/paginaMappa?id=' + encodeURIComponent(id);
    });
});


$(document).on('click', '#commercialisti-table .condividi', async function () {
    // Ottieni l'ID del commercialista dal pulsante cliccato
    const id = $(this).data('id');

    // Funzione per condividere il link
    function shareLink(id) {
        fetch(`/api/get_link/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                const link = data.link;
                const encodedLink = encodeURIComponent(link);
                const shareOptions = `
                    <div class="share-links">
                        <a href="https://wa.me/?text=${encodedLink}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a><br>
                        <a href="https://t.me/share/url?url=${encodedLink}" target="_blank"><i class="fab fa-telegram"></i> Telegram</a><br>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedLink}" target="_blank"><i class="fab fa-facebook"></i> Facebook</a><br>
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a><br>
                        <a href="https://twitter.com/intent/tweet?url=${encodedLink}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a><br>
                        <a href="mailto:?subject=Condividi questo link&body=${encodedLink}" target="_blank"><i class="fas fa-envelope"></i> Email</a>
                    </div>
                `;
                const lingua = localStorage.getItem('language');
                var titolo = "";
                var chiudi = "";
                if (lingua == "it") 
                {
                    titolo = 'Condividi';
                    chiudi = 'Chiudi';
                }
                else if (lingua == "en")
                {
                    titolo = 'Share';
                    chiudi = 'Close';
                }

                // Usa SweetAlert2 per mostrare le opzioni di condivisione come popup
                Swal.fire({
                    title: titolo,
                    html: shareOptions,
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText: chiudi
                });
            })
            .catch(error => {
                console.error('Errore durante la condivisione del link:', error);
                alert('Errore durante la condivisione del link.');
            });
    }

    // Chiama la funzione di condivisione con l'ID del commercialista
    shareLink(id);
});
