document.addEventListener("DOMContentLoaded", async function () {
    // Funzione per ottenere l'username
    async function fetchUsername(userId) {
        try {
            const response = await fetch(`/get_username/${userId}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            const data = await response.json();
            document.getElementById('nomeUtente').textContent = data.username;
        } catch (error) {
            document.getElementById('nomeUtente').textContent = error.message;
        }
    }

    // Leggi l'id utente dall'input nascosto
    var userId = $("#user-id").val();

    // Esegui la funzione per ottenere l'username
    fetchUsername(userId);

    try 
    {
        const userId = $("#user-id").val();
        const config = { locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` };
        const SQL = await initSqlJs(config);

        // Carica il database degli utenti
        const response2 = await fetch('../database/users.sqlite');
        const buffer2 = await response2.arrayBuffer();
        const db2 = new SQL.Database(new Uint8Array(buffer2));

        // Esegui la query per ottenere gli ID delle aziende preferite dall'utente
        const favoritesResult = db2.exec("SELECT id_azienda FROM preferiti WHERE id_user = " + parseInt(userId));
        let favoriteAziende = [];
        if (favoritesResult.length > 0) {
            favoriteAziende = favoritesResult[0].values.map(row => row[0]);
        }

        // Funzione per tradurre il testo
        const translationCache = {};
        async function translateText(text, targetLanguage) {
            const cacheKey = `${text}-${targetLanguage}`;
            if (translationCache[cacheKey]) {
                return translationCache[cacheKey];
            }
            try {
                const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                const translatedText = data[0][0][0];
                translationCache[cacheKey] = translatedText;
                return translatedText;
            } catch (error) {
                console.error('Error translating text:', error);
                return text; // Ritorna il testo originale in caso di errore
            }
        }

        // Funzione per aggiornare il titolo della colonna
        function updateColumnTitle(table, totaleRisultati) {
            const currentLanguage = localStorage.getItem('language');
            const title = currentLanguage == "en" ? `Found ${totaleRisultati} Accounting Firms` : `Trovati ${totaleRisultati} Studi Commercialisti`;
            const col = table.getColumn('name'); // Ottieni la colonna per il titolo
            col.updateDefinition({ title }); // Imposta il nuovo titolo
        }

        // Funzione per evidenziare il testo di ricerca
        function highlightText(container, searchText) {
            const regex = new RegExp(`(${searchText})`, 'gi');
            const elements = container.querySelectorAll('.highlightable');
            elements.forEach(element => {
                element.innerHTML = element.textContent.replace(regex, '<span class="highlight">$1</span>');
            });
        }

        // Filtri ricerca, ordinamento e selezione città
        function filterAndSortTable(table, data, selectedCity, sortOrder, searchValue) 
        {
            searchValue = searchValue.trim().toLowerCase();

            const filteredData = data.filter(row => {
                const matchesCity = !selectedCity || row.address.toLowerCase().includes(selectedCity.toLowerCase());
                const matchesSearch = !searchValue || Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchValue)
                );

                if (document.getElementById('englishLanguage').classList.contains('selected')) {
                    const englishTexts = document.querySelectorAll('.highlightable.en');
                    const matchesEnglish = Array.from(englishTexts).some(element =>
                        element.textContent.toLowerCase().includes(searchValue)
                    );
                    return matchesCity && (matchesSearch || matchesEnglish);
                }

                return matchesCity && matchesSearch;
            });

            if (sortOrder === 'az') {
                filteredData.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOrder === 'za') {
                filteredData.sort((a, b) => b.name.localeCompare(a.name));
            }

            table.setData(filteredData);
            updateColumnTitle(table, filteredData.length);

            const tableContainer = document.querySelector('#commercialisti-table');
            highlightText(tableContainer, searchValue);
        }

        if (favoriteAziende.length > 0) 
        {
            const config = { locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` };
            const SQL = await initSqlJs(config);

            const response = await fetch('../database/database.sqlite');
            const buffer = await response.arrayBuffer();
            const db = new SQL.Database(new Uint8Array(buffer));

            // Query per ottenere gli studi commercialisti preferiti
            const favoriteIds = favoriteAziende.map(id => parseInt(id)).join(', ');
            const result = db.exec(`SELECT * FROM studi_com WHERE id IN (${favoriteIds})`);
            if (result.length > 0) 
            {
                const rows = result[0].values;
                const data = rows.map(row => ({
                    id: row[0],
                    category: row[1],
                    name: row[2],
                    address: row[3],
                    description: row[4],
                    phone: row[5],
                    image: row[6],
                    link: row[7]
                }));

                // Creazione della tabella
                const table = new Tabulator("#commercialisti-table", {
                    layout: "fitColumns",
                    pagination: "local",
                    paginationSize: 10,
                    paginationSizeSelector: false,
                    selectable: false,
                    columns: [
                        {
                            title: `Trovati ${rows.length} Studi Commercialisti`,
                            field: "name",
                            headerSort: false,
                            formatter: function (cell) {
                                const data = cell.getData();
                                const category = data.category;
                                const description = data.description;

                                const container = document.createElement('div');
                                container.className = 'contenitore-generale';
                                container.innerHTML = `<a href="${data.link}" target="_blank" class="commercialista-link">
                                                    <div class="commercialista-container">
                                                        <div class="image">
                                                            <img src="${data.image}" alt="Immagine dello studio">
                                                        </div>
                                                        <div class="details">
                                                            <div class="category highlightable">${category}</div>
                                                            <div class="name highlightable">${data.name}</div>
                                                            <div class="address highlightable">${data.address}</div>
                                                            <div class="description highlightable">${description}</div>
                                                            <div class="phone highlightable">${data.phone}</div>
                                                        </div>
                                                    </div>
                                                </a>
                                                <div class = "contenitore-opzioni">
                                                    <button class = "condividi" id="condividi" title = "Condividi" data-id="${data.id}"><i class="fa-solid fa-share-nodes"></i></button>
                                                    <button class = "vediSuMappa" id="vediSuMappa" title = "Vedi su Mappa" data-id="${data.id}"><i class="fas fa-map-marker-alt"></i></button>
                                                    <button class = "remove" title="Rimuovi dai Preferiti" data-id="${data.id}"><i class="fa-solid fa-x"></i></button>
                                                </div>
                                                `;


                                // Traduzione se l'opzione inglese è selezionata
                                if (document.getElementById('englishLanguage').classList.contains('selected')) {
                                    const overlay = document.createElement('div');
                                    overlay.className = 'loading-overlay';
                                    overlay.textContent = 'Traduzione in corso...';
                                    container.appendChild(overlay);

                                    const categoryPromise = translateText(category, 'en').then(translatedCategory => {
                                        container.querySelector('.category').textContent = translatedCategory;
                                    });

                                    const descriptionPromise = translateText(description, 'en').then(translatedDescription => {
                                        container.querySelector('.description').textContent = translatedDescription;
                                    });

                                    Promise.all([categoryPromise, descriptionPromise]).then(() => {
                                        container.removeChild(overlay);
                                    });
                                }
                                return container;
                            }
                        }
                    ],
                    data: data,
                    paginationElement: document.getElementById("commercialisti-paging"),
                    footerElement: document.getElementById("commercialisti-info"),
                });

                // Impostazione dei valori di default per selectedCity, sortOrder e searchValue
                let selectedCity = "";
                let sortOrder = "az";
                let searchValue = "";

                // Gestione del dropdown per le righe per pagina
                $('#dropdown-page .dropdown-item').click(function () {
                    const selectedValue = $(this).attr('data-value');
                    $('#rowsPerPageDropdown').text(selectedValue);
                    $('.rowsPerPage .dropdown-item').removeClass('selected');
                    $(this).addClass('selected');
                    table.setPageSize(parseInt(selectedValue));
                });

                // Ascolta il click sugli elementi della dropdown e imposta il valore di sortOrder
                $('#dropdown-sort .dropdown-item').on('click', function () {
                    sortOrder = $(this).attr('data-value');
                    const selectedsortOrder = $(this).text();
                    $('.sort .dropdown-item').removeClass('selected');
                    $(this).addClass('selected');
                    $('#sortDropdown').text(selectedsortOrder);
                    filterAndSortTable(table, data, selectedCity, sortOrder, searchValue);
                });

                // Ascolta l'input della barra di ricerca
                document.getElementById("dt-search-0").addEventListener("input", function () {
                    searchValue = this.value;
                    filterAndSortTable(table, data, selectedCity, sortOrder, searchValue);
                });

                // Ascolta il click sugli elementi della dropdown e imposta il valore di selectedCity
                $('#dropdown-cities .dropdown-item').on('click', function () {
                    selectedCity = $(this).attr('data-value');
                    const selectedNameCity = $(this).text();
                    $('.cities .dropdown-item').removeClass('selected');
                    $(this).addClass('selected');
                    $('#citiesDropdown').text(selectedNameCity);
                    filterAndSortTable(table, data, selectedCity, sortOrder, searchValue);
                });

                // Applica immediatamente l'ordinamento predefinito al caricamento della pagina
                table.on("tableBuilt", function () {
                    filterAndSortTable(table, data, selectedCity, sortOrder, searchValue);
                });

                // Gestione della lingua
                $('.dropdown-menu.lingua .dropdown-item').click(function () {
                    filterAndSortTable(table, data, selectedCity, sortOrder, searchValue);
                    $('#citiesDropdown').text($('.cities .dropdown-item.selected').text());
                });

                // Al click la visualizzazione va sempre giù 
                table.on("pageLoaded", function () {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    highlightText(document.querySelector('#commercialisti-table'), searchValue);
                });

                //Al click del pulsante con classe remove e che sta dentro la tabella con id commercialisti-table
                $(document).on('click', '#commercialisti-table .remove', async function () {
                    $('#popupid').addClass('show');
                    $('#overlay').addClass('show');
                    var removeButton = $(this);
                    var userId = $("#user-id").val();
                    var aziendaId = removeButton.data('id');
                    console.log('User ID:', userId);
                    console.log('Azienda ID:', aziendaId);

                    // Trova l'ID dell'elemento da rimuovere
                    var id = $(this).data('id');

                    $(document).on('click', '#siButton', async function () {
                        if (!removeButton.hasClass('disabled')) 
                        {
                            $('#popupid2').addClass('show');
                            $('#popupid').removeClass('show');
                            $('#overlay').addClass('show');

                            removeButton.addClass('disabled');

                            try {
                                const response = await fetch('/remove_preferito', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ id_user: userId, id_azienda: aziendaId }),
                                });
    
                                const result = await response.json();
                                console.log('Response:', result);
    
                                if (response.ok) {
                                    // alert('Preferito rimosso con successo');
                                } else if (response.status === 409) {
                                    alert('Questo preferito è già presente.');
                                } else {
                                    alert('Errore: ' + result.message);
                                }
                            }
                            catch (error) {
                                console.error('Error:', error);
                            }
                            
                            function rimuoviRigaAggiornaTitolo(id)
                            {
                                table.deleteRow(id) //rimuovi riga con id dell'elemento rimosso
                                table.redraw(); //aggiorna tabella
                                const totRisultati = table.getDataCount(); //prende il totale dei risultati
                                updateColumnTitle(table, totRisultati); //aggiorna titolo
                            }
                            rimuoviRigaAggiornaTitolo(id);  //quando elimino il risultato

                            $('.tabulator-page').click(function() {
                                rimuoviRigaAggiornaTitolo(id);
                            });
            
                            //Al click del pulsante cambio lingua e al click di ogni pulsante di impaginazione
                            $('#italianLanguage').click(function() {
                                rimuoviRigaAggiornaTitolo(id);
                                $('.tabulator-page').click(function() {
                                    rimuoviRigaAggiornaTitolo(id);
                                });
                            });
                            //Al click del pulsante cambio lingua e al click di ogni pulsante di impaginazione
                            $('#englishLanguage').click(function() {
                                rimuoviRigaAggiornaTitolo(id);
                                $('.tabulator-page').click(function() {
                                    rimuoviRigaAggiornaTitolo(id);
                                });
                            });
                            //Al click di un pulsante della dropdown dropdown-sort
                            $('#dropdown-sort .dropdown-item').on('click', function () {
                                rimuoviRigaAggiornaTitolo(id);
                            });
                
                            //Alla ricerca della barra di ricerca
                            document.getElementById("dt-search-0").addEventListener("input", function () {
                                rimuoviRigaAggiornaTitolo(id);
                            });

                            //Al click di un pulsante della dropdown dropdown-cities
                            $('#dropdown-cities .dropdown-item').on('click', function () {
                                rimuoviRigaAggiornaTitolo(id);
                            });
            

                        }
                    });

                });

                //quando clicco No
                $(document).on('click', '#noButton', async function () {
                    $('#popupid').removeClass('show');
                    $('#overlay').removeClass('show');
                }); 

                //quando clicco Ok
                $(document).on('click', '#okButton', async function () {
                    $('#popupid2').removeClass('show');
                    $('#overlay').removeClass('show');
                }); 

                /*Modifico qui il titles degli elementi con classe condividi, vediSuMappa e remove perchè sono generati dinamicamente con javascript*/
                function updateTitles() 
                {
                    if ($('.lingua #englishLanguage').hasClass('selected')) 
                    {
                        $('.condividi').attr('title', 'Share');
                        $('.vediSuMappa').attr('title', 'See on Map');
                        $('.remove').attr('title', 'Remove from Favorites');
                    } 
                    else if ($('.lingua #italianLanguage').hasClass('selected')) 
                    {
                        $('.condividi').attr('title', 'Condividi');
                        $('.vediSuMappa').attr('title', 'Vedi su Mappa');
                        $('.remove').attr('title', 'Rimuovi dai Preferiti');
                    }
                }

                $('.lingua #englishLanguage').click(updateTitles);
                $('.lingua #italianLanguage').click(updateTitles);

                $(document).ready(updateTitles);
            } 
            else
            {
                console.log('Nessun dato trovato nella tabella studi_com');
            }
        }
        else if (favoriteAziende.length == 0) 
        {
            const emptyMessage = '<div id = "NessunoStudio">Nessuno Studio Commercialista Salvato</div>';
            $('#commercialisti-table').append(emptyMessage);
        }
    } 
    catch (error) 
    {
        console.error('Errore durante il caricamento di SQL.js o del database:', error);

    }
});
