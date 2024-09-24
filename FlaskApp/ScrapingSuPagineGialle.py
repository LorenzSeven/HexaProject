import bs4, requests, os

#definizione funzione: verifica la connessione al sito
def verificaConnessioneSito(link):
    try:                                                        #prova a eseguire il codice seguente
        response = requests.get(link)                           #fa la richiesta di prendere l'html dal link
        response.raise_for_status()                             #verifica se il sito risponde correttamente con stato 200
        print("Tutto okay, il sito risponde correttamente")     #stampa tutto okay
        return True                                             #ritorna True
    except requests.exceptions.RequestException as e:           #altrimenti c'è un eccezione e
        if "HTTPSConnection" in str(e):                         #se trovi la stringa "HTTPSConnection" nell'eccezione e
            print("La connessione a Internet è assente")        #stampa la connessione a Internet è assente
        else:                                                   #altrimenti
            print("Si è verificato un errore durante la richiesta:", e) #stampa l'eccezione
    return False                                                #ritorna False

#definizione funzione: prende i dati dal link della pagina
def prendiDati(link, nomeFile):
    response = requests.get(link)                                         #fa la richiesta di prendere l'html dal link
    response_content_decoded = response.content.decode('UTF-8')           #codifica il testo in UTF-8
    soup = bs4.BeautifulSoup(response_content_decoded, 'html.parser')     #prende tutto l'html della pagina web
    div_colonna_risultati_tag = soup.find('div', 'search__cnt')           #Trova l'elemento div con classe search__cnt
    classe_div_completo = []
    classe_div_completo.append('search-itm')                                    #classe div completo che contiene tutte le info per uno studio_com 
    classe_div_completo.append('search-itm search-itm--mypt')
    div_completo_tag = div_colonna_risultati_tag.find_all('div', classe_div_completo)  #prende tutti i tag div completi con la classe specificata

    #recupero link
    classe_a_link = []
    classe_a_link.append('remove_blank_for_app')                                 #classe del link studio_com
    classe_a_link.append('shinystat_ssxl google_analytics_tracked')
    a_link_tag = div_colonna_risultati_tag.find_all('a', classe_a_link)    #prende tutti i tag a con la classe specificata
    href_studi_com = []                                                    #dichiara la lista href_studi_com

    for href_studio_com in a_link_tag:                                     #per ogni href_studio_com nella lista a_link_tag
        link_studio_com = str(href_studio_com.get('href'))                 #prende l'href
        if link_studio_com  not in href_studi_com:                         #se il link_studio_com non è nella lista href_studi_com
            href_studi_com.append(link_studio_com)                         #aggiungi alla lista href_studi_com

    #recupero nome studio_com
    classe_h2_titolo = []
    classe_h2_titolo.append('search-itm__rag google_analytics_tracked')                          #classe del nome studio_com
    classe_h2_titolo.append('search-itm__rag')
    h2_nome_studio_com_tag = div_colonna_risultati_tag.find_all('h2', classe_h2_titolo) #prende tutti i tag h2 con la classe specificata
    nomi_studi_com = []                                                                 #dichiara la lista nomi_studi_com
    for nome_studio_com in h2_nome_studio_com_tag:                                      #per ogni nome_studio_com nella lista h2_nome_studio_com_tag
        testo_nome_studio_com = nome_studio_com.text                                    #prende il testo del nome_studio_com
        
        #pulisce il testo dai caratteri ('\n'), ('\t'), ('\r'), ('                  ')
        testo_pulito = testo_nome_studio_com.replace('\n', '').replace('\t', '').replace('\r', '').replace('                  ', '').replace("'", "").replace("      ", "").replace("  ", "")
        
        if testo_pulito.isupper():                                                          # Controlla se la frase è tutta in maiuscolo
            testo_pulito = testo_pulito.lower() # Converti la frase tutta in minuscolo
            testo_formattato = testo_pulito.title()# Metti in maiuscolo le iniziali di ogni parola
            nomi_studi_com.append(testo_formattato)       
        else:
            nomi_studi_com.append(testo_pulito)                                             #aggiungi alla lista nomi_studi_com

    #recupero categoria studio_com
    classe_div_categoria = 'search-itm__category'                                                  #classe della categoria studio_com
    # a_categoria_studio_com_tag = div_colonna_risultati_tag.find_all('div', classe_a_link)   #prende tutti i tag a con la classe specificata
    categorie_studi_com = []                                                                #dichiara la lista categorie_studi_com

    for indice in range(len(div_completo_tag)):                                             #per indice che va da 0 alla lunghezza della lista div_completo_tag
        elemento_div_completo_tag = div_completo_tag[indice]                                #seleziona il div completo corrente
        if elemento_div_completo_tag.find('div', classe_div_categoria):          #se dentro il div completo esiste l'elemento div con classe specificata
            categoria_studio_com = elemento_div_completo_tag.find('div', classe_div_categoria) #prende l'elemento div con classe specificata
            testo_categoria_studio_com = categoria_studio_com.text                              #prende il testo di categoria_studio_com
            if (len(testo_categoria_studio_com) > 0):
                categorie_studi_com.append(testo_categoria_studio_com)                              #aggiungi alla lista categorie_studi_com
            else:
                categorie_studi_com.append("Studi commercialisti")
        else:
            categorie_studi_com.append("Studi commercialisti")   

    # print(categorie_studi_com)

    #recupero indirizzo studio_com
    classe_div_indirizzo_studio_com = 'search-itm__adr'                                     #classe del div indirizzo_studio_com     
    indirizzi_studi_com = []

    for indice in range(len(div_completo_tag)):                                             #per indice che va da 0 alla lunghezza della lista div_completo_tag
        elemento_div_completo_tag = div_completo_tag[indice]                                #seleziona il div completo corrente
        if elemento_div_completo_tag.find('div', classe_div_indirizzo_studio_com):          #se dentro il div completo esiste l'elemento div con classe specificata
            indirizzo_studio_com = elemento_div_completo_tag.find('div', classe_div_indirizzo_studio_com) #prende l'elemento div con classe specificata
            testo_indirizzo_studio_com = indirizzo_studio_com.text                          #prende il testo dell'elemento indirizzo_studio_com
            #pulisce il testo dai caratteri '\n', '\t', '\r' e sostituisce la stringa 'Lombardia' con ''
            testo_pulito = testo_indirizzo_studio_com.replace('\n', '').replace('\t', '').replace('\r', '').replace('Lombardia', '')

            ultimo_numero_indice = 0                                                        #dichiaro la variabile ultimo_numero_indice
            for carattere in reversed(testo_pulito):                                        #scorre la stringa al contrario, cioè dalla fine all'inizio
                if carattere.isdigit():                                                     #se un carattere è un numero
                    ultimo_numero_indice = testo_pulito.rindex(carattere)                   #prende l'indice del primo numero che incontra partendo dalla fine
                    break                                                                   #stop
            #prende la stringa da 0 fino all'indice del numero + 1, aggiunge la stringa ' - ' + prende la stringa dall'indice del numero + 1 fino alla fine della stringa
            testo_separato = testo_pulito[0:ultimo_numero_indice + 1] + ' - ' + testo_pulito[ultimo_numero_indice + 1: len(testo_pulito)]
            indirizzi_studi_com.append(testo_separato)                            #aggiungi alla lista indirizzi_studi_com
        else:
            indirizzi_studi_com.append("Indirizzo non disponibile")   


    #recupero descrizione studio_com
    classe_p_descrizione_studio_com = 'search-itm__dsc'                                   #classe p descrizione studio_com
    descrizioni_studi_com = []                                                            #dichiaro la lista descrizioni_studi_com

    for indice in range(len(div_completo_tag)):                                           #per indice che va da 0 alla lunghezza della lista div_completo_tag
        elemento_div_completo_tag = div_completo_tag[indice]                              #seleziona il div completo corrente
        if elemento_div_completo_tag.find('div', classe_p_descrizione_studio_com):        #se dentro il div completo esiste l'elemento div con classe specificata
            elemento_div_descrizione_studio_com_tag = elemento_div_completo_tag.find('div', classe_p_descrizione_studio_com) #prende l'elemento div con classe specificata
            testo_descrizione_studio_com = elemento_div_descrizione_studio_com_tag.text   #prende il testo della div 
            #pulisce il testo dai caratteri ('\n'), ('\t'), ('\r'), ('                  '), ('.  ') e sostituisce (';') con (',')
            testo_pulito = testo_descrizione_studio_com.replace('\n', '').replace('\t', '').replace('\r', '').replace(';',',').replace('                  ', '').replace('.  ', '').replace('  ', '') 
            if (len(testo_descrizione_studio_com) > 1):
                descrizioni_studi_com.append(testo_pulito)                                    #aggiungi alla lista descrizioni_studi_com
            elif (len(testo_descrizione_studio_com) == 1):
                descrizioni_studi_com.append("Studio Commercialista")
        else:                                                                             #altrimenti
            descrizioni_studi_com.append("Studio Commercialista")                         #aggiungi Descrizione Commercialista


    #recupero numero di telefono studio_com
    classe_li_numero_telefono_studio_com = 'search-itm__ballonIcons'                      #classe del numero studio_com
    numeri_telefono_studi_com = []                                                        #dichiaro la lista numeri_telefono_studi_com

    for indice in range(len(div_completo_tag)):                                           #per indice che va da 0 alla lunghezza della lista div_completo_tag
        elemento_div_completo_tag = div_completo_tag[indice]                              #seleziona il div completo corrente
        if elemento_div_completo_tag.find('ul', classe_li_numero_telefono_studio_com):        #se dentro il div completo esiste l'elemento div con classe specificata
            ul_numero_telefono_studio_com_tag = div_colonna_risultati_tag.find_all('ul', classe_li_numero_telefono_studio_com) #prende l'elemento div con classe specificata
        
                                                      
            for numero_telefono_studio_com in ul_numero_telefono_studio_com_tag:                  #per ogni numero_telefono_studio_com nella lista ul_numero_telefono_studio_com_tag
                testo_numero_telefono_studio_com = numero_telefono_studio_com.text                #prende il testo del numero_telefono_studio_com
                numero_telefono_senza_primi_n = testo_numero_telefono_studio_com[3:]              #prende dal 4°carattere in poi

                numero_telefono = []                                                              #dichiaro la lista numero_telefono
                for carattere in numero_telefono_senza_primi_n:                                   #per ogni carattere nella stringa numero_telefono_senza_primi_n
                    if carattere.isdigit() or carattere == ' ':                                   #se il carattere è un numero o uno spazio vuoto
                        numero_telefono.append(carattere)                                         #aggiungi il carattere alla lista numero_telefono
                    else:                                                                         #altrimenti 
                        break                                                                     #stop

                numero_telefono_compresso = ''.join(numero_telefono)                              #unisci la lista
                numeri_telefono_studi_com.append(numero_telefono_compresso)                       #aggiungi alla lista numeri_telefono_studi_com la stringa numero_telefono_compresso     
        else:                                                                             #altrimenti
            numeri_telefono_studi_com.append("Numero non disponibile")                         #aggiungi Descrizione Commercialista

    #recupero immagini studio_com
    immagini_studi_com = []

    for indice in range(len(div_completo_tag)):                                           #per indice che va da 0 alla lunghezza della lista div_completo_tag
        elemento_div_completo_tag = div_completo_tag[indice]                              #seleziona il div completo corrente
        if elemento_div_completo_tag.find('img'):                                         #se dentro il div completo esiste l'elemento img
            img_studio_com_tag = elemento_div_completo_tag.find('img')                #prende l'elemento img
            
            # for immagine in img_studio_com_tag:
            testo_immagine = img_studio_com_tag.prettify() #
            soup2 = bs4.BeautifulSoup(testo_immagine, 'html.parser')                   # Analizza l'HTML

            # Trova tutti gli elementi <img>
            img_tag = soup2.find('img')
            data_src = img_tag.get('data-src')
            src = img_tag.get('src')

            # Se data-src non è vuoto, usa data-src, altrimenti usa src
            if data_src:
                immagini_studi_com.append(data_src)
            else:
                immagini_studi_com.append(src)
        else:                                                                             #altrimenti
            immagini_studi_com.append("https://lh3.googleusercontent.com/pw/AP1GczOAGMImIwXuM91ucIKCCK_OEZKVxyM9pHmV_PCxRxf4HrrPAD3v8e4r6hJ3fzq49piFOGMX9XmI3DdAsCj9upLYI544vq1pjgatKMJFj8RTBSqzenI=w2400")                         #aggiungi Descrizione Commercialista


    #creo la lista di righe con l'intestazione e i dati dal sito
    lista_studi_com = []
    lista_studi_com.append("categoria;nome;indirizzo;descrizione;numero;immagine;link") #aggiunge intestazione colonne in lista_studi_com
    for i in range(len(href_studi_com)):                               #per i che va 0 fino alla lunghezza della lista href_studi_com
        riga_elementi_liste = categorie_studi_com[i], nomi_studi_com[i], indirizzi_studi_com[i], descrizioni_studi_com[i], numeri_telefono_studi_com[i], immagini_studi_com[i], href_studi_com[i] #aggiunge i dati nelle colonne in lista_studi_com
        annuncio_riga_completa = ';'.join(riga_elementi_liste)         #unisci gli elementi i-esimi in una stringa con delimitatore ";"
        lista_studi_com.append(annuncio_riga_completa)                 #aggiungi la stringa in lista_studi_com 

    #leggo i dati dal file 'risultati_salvati.csv' e creo una lista di righe del file
    nomeFileCSV = nomeFile + '.csv'
    fileCSV = open(nomeFileCSV, 'a')
    os.chmod(nomeFileCSV, 0o644)  # Assegna i permessi di lettura e scrittura del file
    #crea una lista chiamata lista_annunci_fileCSV di righe dal file 'risultati_salvati.csv' senza il carattere '\n'
    lista_studi_com_fileCSV = [riga.rstrip('\n') for riga in open(nomeFileCSV)] 

    #scrivo i dati che ho trovato nel sito solo se non sono contenuti nel file 'risultati_salvati.csv'
    new_link_studi_com = []                                            #dichiaro la lista new_link_studi_com
    for riga_studio_com in lista_studi_com:                               #per ogni elemento riga_studio_com della lista lista_studi_com
        if riga_studio_com not in lista_studi_com_fileCSV:                #se riga_ID_annuncio non è contenuta nella lista_ID_annunci
            if 'S - ede' not in riga_studio_com:                          #se non c'è la stringa 'S - ede'
                new_link_studi_com.append(riga_studio_com)                    #allora aggiungo riga_studio_com alla lista new_link_studi_com
                fileCSV.write('%s\n' %riga_studio_com)                      #e scrivo riga_studio_com nel file fileCSV
    fileCSV.close()                                                  #chiudi il fileCSV
    #fileCSV.write('%s\n' % riga_studio_com): significa che scrive all'interno del fileCSV, 
    #%s è un termine che sta per stringa e viene sostituito con il valore di riga_studio_com 
    #%s\n perciò indica una stringa e subito dopo aggiunge il carattere va a capo
    if len(new_link_studi_com) > 0:                                   #se la lunghezza della lista new_link_studi_com è maggiore di 0
        print('Ci sono nuovi studi commercialisti!')                             #stampa 'Ci sono nuovi studi_com!'
        return True                                                 #ritorna True
    print('Nessun nuovo studio commercialista.')                                 #altrimenti stampa 'Nessuna nuova studio_com.'
    return False                                                    #ritorna False

#definizione funzione: verifica la connessione al sito
def verifica_presenza_dati(link, nuoviDati):
    try:                                                        #prova a eseguire il codice seguente
        response = requests.get(link)                           #fa la richiesta di prendere l'html dal link
        response.raise_for_status()                             #verifica se il sito risponde correttamente con stato 200
        return True                                             #ritorna True
    except requests.exceptions.HTTPError as e:           #altrimenti c'è un eccezione e                                            #altrimenti
        if e.response.status_code == 404 and nuoviDati == True:
            print("Finito di copiare i dati")
    return False  


#-----------------------------------Prendi i risultati di ricerca di tutte le pagine---------------------------------------------------------                                                      
Lista_link_pagina = [
"https://www.paginegialle.it/ricerca/studio%20commercialista/Bergamo/p-"
"https://www.paginegialle.it/ricerca/studio%20commercialista/Brescia/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Pavia/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Como/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Varese/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Milano/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Cremona/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Lecco/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Sondrio/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Mantova/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Lodi/p-",
"https://www.paginegialle.it/ricerca/studio%20commercialista/Monza/p-"
]

for i in range(len(Lista_link_pagina)):
    numeroPagina = 1
    linkPaginaUno = Lista_link_pagina[i] + str(numeroPagina)
    controlloStatoSito = verificaConnessioneSito(linkPaginaUno)                   #controllo stato del sito
    nomeFile = 'File_csv_json_database/elenco_studi_commercialisti_Lombardia_pagine_gialle'          #nome del file che conterrà i dati
    controllo_presenza_dati = True
    nuoviDati = True

    if (controlloStatoSito == True): 
        while(controllo_presenza_dati == True):  
            linkPaginaSuccessiva = Lista_link_pagina[i] + str(numeroPagina)  #link altre pagine successive alla 1°                                            #se il sito risponde correttamente                                                                 #dichiara la variabile numeroPagina                                              
            controllo_presenza_dati = verifica_presenza_dati(linkPaginaSuccessiva, nuoviDati)
            if (controllo_presenza_dati == True):
                nuoviDati = prendiDati(linkPaginaSuccessiva, nomeFile)                           #parte la funzione prendi_dati per LINKMULTIPAGINE
                if (nuoviDati == True):
                    print("Ho finito di copiare i dati dalla pagina " + str(numeroPagina))
                numeroPagina += 1                                                               #aumenta numeroPagina di 1












