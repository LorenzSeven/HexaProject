import csv, json, sqlite3

def csv_to_json(csv_file, json_file):
    with open(csv_file, 'r') as file:
        csv_reader = csv.DictReader(file, delimiter=';')
        data = []
        for row in csv_reader:
            data.append(row)
    
    with open(json_file, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

csv_to_json('File_csv_json_database/elenco_studi_commercialisti_Lombardia_pagine_gialle.csv', 'File_csv_json_database/elenco_studi_commercialisti_Lombardia_pagine_gialle.json')

def insert_json_to_table(json_file, table_name):
    with open(json_file, 'r') as file:
        data = json.load(file)
    
    conn = sqlite3.connect('File_csv_json_database/database.sqlite')
    cursor = conn.cursor()
    cursor.execute(f'''CREATE TABLE IF NOT EXISTS {table_name} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria_studi_com TEXT,       
            nome_studi_com TEXT,
            indirizzo_studi_com TEXT,
            descrizione_studi_com TEXT,       
            numero_studi_com TEXT,
            immagine_studi_com TEXT,
            link_studi_com TEXT)''')
    
    for row in data:
        cursor.execute(f'''
            SELECT 1 FROM {table_name} WHERE
            categoria_studi_com = ? AND nome_studi_com = ? AND indirizzo_studi_com = ? AND descrizione_studi_com = ? AND numero_studi_com = ? AND immagine_studi_com = ? AND link_studi_com = ?
            ''', (row['categoria'], row['nome'], row['indirizzo'], row['descrizione'], row['numero'], row['immagine'], row['link']))
        
        if not cursor.fetchone():
            cursor.execute(f'''
                INSERT INTO {table_name} (categoria_studi_com, nome_studi_com, indirizzo_studi_com, descrizione_studi_com, numero_studi_com, immagine_studi_com, link_studi_com)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (row['categoria'], row['nome'], row['indirizzo'], row['descrizione'], row['numero'], row['immagine'], row['link']))
    
    conn.commit()
    conn.close()

insert_json_to_table('File_csv_json_database/elenco_studi_commercialisti_Lombardia_pagine_gialle.json', 'studi_com')
