from flask import Flask, request, jsonify, render_template, url_for, session, redirect, send_from_directory
import sqlite3
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import os
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash
import requests
import logging


# Inizializzazione dell'app Flask
app = Flask(__name__)
bcrypt = Bcrypt(app)  # Inizializzazione di Flask-Bcrypt per la gestione delle password
app.secret_key = 'your_secret_key'  # Chiave segreta per la gestione delle sessioni

load_dotenv(override=True)  # Caricamento delle variabili d'ambiente dal file .env

# Configurazione di Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Lettura del nome utente dalla variabile d'ambiente
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Lettura della password dalla variabile d'ambiente
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

logging.basicConfig(level=logging.DEBUG)

mail = Mail(app)  # Inizializzazione di Flask-Mail

# Configurazione di URLSafeTimedSerializer per la generazione dei token
s = URLSafeTimedSerializer('Thisisasecret!')

# Funzione per connettersi al database SQLite
def get_db_connection():
    conn = sqlite3.connect('database/users.sqlite')  # Connessione al database users.db
    conn.row_factory = sqlite3.Row  # Permette di accedere alle colonne del risultato per nome
    return conn

def get_db_connection2():
    conn = sqlite3.connect('database/database.sqlite')  # Connessione al database users.db
    conn.row_factory = sqlite3.Row  # Permette di accedere alle colonne del risultato per nome
    return conn

# Creazione della tabella "users" se non esiste
def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    confirmed BOOLEAN NOT NULL DEFAULT 0
                    )''')
    conn.commit()
    conn.close()

# Creazione della tabella "preferiti" se non esiste
def create_preferiti_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS preferiti (
            id INTEGER PRIMARY KEY,
            id_user INTEGER,
            id_azienda INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# Funzione per registrare un nuovo utente
def register(username, password, email):
    conn = get_db_connection()
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')  # Hashing della password
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", (username, hashed_password, email))
        conn.commit()
    except sqlite3.IntegrityError:
        return False  # Username o email già esistenti
    finally:
        conn.close()
    return True

# Funzione per verificare le credenziali di login
def check_login(username, password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    if user and bcrypt.check_password_hash(user['password'], password):  # Verifica dell'hash della password
        return True
    return False

# Funzione per inserire dati nella tabella "preferiti"
def add_to_preferiti(id_user, id_azienda):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO preferiti (id_user, id_azienda) VALUES (?, ?)', (id_user, id_azienda))
    conn.commit()
    conn.close()

def delete_user_account(username, email, password, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    if user and bcrypt.check_password_hash(user['password'], password) and user['email'] == email:
        cursor.execute("DELETE FROM users WHERE username = ?", (username,))
        cursor.execute("DELETE FROM preferiti WHERE id_user = ?", (user_id,))
        conn.commit()
        conn.close()
        return True
    else:
        conn.close()
        return False

# Funzione per recuperare i dati dalla tabella "studi_commercialisti"
def dati_tabella_studi():
    conn = sqlite3.connect('studi_commercialisti.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM studi_com')
    studi = cursor.fetchall()
    conn.close()
    return studi

# Creazione delle tabelle all'avvio dell'app
create_users_table()
create_preferiti_table()

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/Immagini/<path:filename>')
def immagini_files(filename):
    return send_from_directory('Immagini', filename)

@app.route('/database/<path:filename>')
def database_files(filename):
    return send_from_directory('database', filename)

@app.route('/')
def index():
    return render_template('indexHome.html')  # Rende la pagina principale

@app.route('/hexaProject')
def hexaProject():
    return render_template('hexaProject.html')  

@app.route('/paginaLogin')
def paginaLogin():
    return render_template('paginaLogin.html')  

@app.route('/paginaRegistrazione')
def paginaRegistrazione():
    return render_template('paginaRegistrazione.html') 

@app.route('/paginaLoggato')
def paginaLoggato():
    # Controlla se l'utente è loggato
    if 'user_id' not in session:
        return redirect(url_for('paginaLogin.html'))

    user_id = session['user_id']
    return render_template('paginaLoggato.html', user_id=user_id)

@app.route('/paginaPreferiti')
def paginaPreferiti():
    # Controlla se l'utente è loggato
    if 'user_id' not in session:
        return redirect(url_for('paginaLogin.html'))

    user_id = session['user_id']
    return render_template('paginaPreferiti.html', user_id=user_id)

@app.route('/paginaResettaPassword')
def paginaResettaPassword():
    # Controlla se l'utente è loggato
    if 'user_id' not in session:
        return redirect(url_for('paginaLoggato.html'))

    user_id = session['user_id']
    return render_template('paginaResettaPassword.html', user_id=user_id)

@app.route('/paginaEliminaAccount')
def paginaEliminaAccount():
    # Controlla se l'utente è loggato
    if 'user_id' not in session:
        return redirect(url_for('paginaLogin.html'))

    user_id = session['user_id']
    return render_template('paginaEliminaAccount.html', user_id=user_id) 

@app.route('/register', methods=['POST'])
def register_route():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    if not username or not password or not email:
        return jsonify(message='Username, password and email are required'), 400
    
    if len(password) < 6:
        return jsonify(message='Password must be at least 6 characters long'), 400
    
    if not register(username, password, email):
        return jsonify(message='Username or email already exists'), 400

    # Generazione del token per la conferma dell'email
    token = s.dumps(email, salt='email-confirm')
    with app.app_context():  # Assicurarsi di essere nel contesto dell'app
        link = url_for('confirm_email', token=token, _external=True)

    # Invio dell'email di conferma
    msg = Message('Confirm your email', sender=app.config['MAIL_USERNAME'], recipients=[email])
    msg.body = f'Your link is {link}'
    mail.send(msg)
    
    return jsonify(message='User registered successfully. Please check your email to confirm your account.'), 201

@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)  # Decodifica del token
    except SignatureExpired:
        return jsonify(message='The confirmation link has expired.'), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET confirmed = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    return jsonify(message='Email confirmed successfully.'), 200

@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        if not user['confirmed']:
            return jsonify(success=False, message='Please confirm your email to login.'), 400
        session['user_id'] = user['id']
        return jsonify(success=True, message='Login successful'), 200
    return jsonify(success=False, message='Invalid credentials'), 401

@app.route('/add_preferito', methods=['POST'])
def add_preferito():
    data = request.get_json()
    user_id = data['id_user']
    azienda_id = data['id_azienda']

    if not user_id or not azienda_id:
        return jsonify(message='User ID and Azienda ID are required'), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Controlla se l'associazione esiste già
    cursor.execute('SELECT * FROM preferiti WHERE id_user = ? AND id_azienda = ?', (user_id, azienda_id))
    existing_preferito = cursor.fetchone()

    if existing_preferito:
        conn.close()
        return jsonify(message='Preferito already exists'), 409

    # Aggiungi il preferito se non esiste già
    cursor.execute('INSERT INTO preferiti (id_user, id_azienda) VALUES (?, ?)', (user_id, azienda_id))
    conn.commit()
    conn.close()

    return jsonify(message='Preferito added successfully'), 201



@app.route('/check_preferito', methods=['GET'])
def check_preferito():
    user_id = request.args.get('id_user')
    azienda_id = request.args.get('id_azienda')

    if not user_id or not azienda_id:
        return jsonify(message='User ID and Azienda ID are required'), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Controlla se l'associazione esiste già
    cursor.execute('SELECT * FROM preferiti WHERE id_user = ? AND id_azienda = ?', (user_id, azienda_id))
    existing_preferito = cursor.fetchone()
    conn.close()

    if existing_preferito:
        return jsonify(is_preferito=True), 200
    else:
        return jsonify(is_preferito=False), 200




@app.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    user_id = data['id_user']

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required."}), 400

    if delete_user_account(username, email, password, user_id):
        return jsonify(message='Account deleted successfully.'), 200
    else:
        return jsonify({"message": "Failed to delete account. Please check your credentials."}), 400

@app.route('/remove_preferito', methods=['POST'])
def remove_preferito():
    data = request.get_json()
    user_id = data['id_user']
    azienda_id = data['id_azienda']

    if not user_id or not azienda_id:
        return jsonify(message='User ID and Azienda ID are required'), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Controlla se l'associazione esiste già
    cursor.execute('SELECT * FROM preferiti WHERE id_user = ? AND id_azienda = ?', (user_id, azienda_id))
    existing_preferito = cursor.fetchone()

    if not existing_preferito:
        conn.close()
        return jsonify(message='Preferito not found'), 404

    # Rimuovi il preferito se esiste
    cursor.execute('DELETE FROM preferiti WHERE id_user = ? AND id_azienda = ?', (user_id, azienda_id))
    conn.commit()
    conn.close()

    return jsonify(message='Preferito removed successfully'), 200


#funzione per ottenere solo l'username dell'utente dal database in base al suo id
def get_user_username_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return user[0]  # Restituisce solo l'username
    return None

@app.route('/get_username/<int:user_id>', methods=['GET'])
def get_username(user_id):
    username = get_user_username_by_id(user_id)
    if username:
        return jsonify({'username': username})
    return jsonify({'error': 'User not found'}), 404

# Funzione per ottenere l'utente dal database
def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

# Funzione per aggiornare la password dell'utente
def update_user_password(user_id, new_password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password = ? WHERE id = ?", (new_password, user_id))
    conn.commit()
    conn.close()

@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    user_id = data['id_user']
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    if not old_password or not new_password:
        return jsonify({"message": "Old and new passwords are required"}), 400

    user = get_user_by_id(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404

    stored_password_hash = user['password']

    if not stored_password_hash:
        return jsonify({"message": "Stored password is invalid"}), 500

    try:
        if not bcrypt.check_password_hash(stored_password_hash, old_password):
            return jsonify({"message": "Old password is incorrect"}), 403
    except ValueError as e:
        return jsonify({"message": f"Error checking password hash: {str(e)}"}), 500

    new_password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    update_user_password(user_id, new_password_hash)

    return jsonify({"message": "Password changed successfully"}), 200

def geocode_address(address):
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
    headers = {
        'User-Agent': 'YourAppName/1.0 (your.email@example.com)'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if data:
            return data[0]['lat'], data[0]['lon']
    elif response.status_code == 403:
        raise Exception("Access forbidden by the server.")
    else:
        raise Exception(f"Failed to fetch geocoding data, status code: {response.status_code}")
    return None, None

@app.route('/api/mappa/<int:id>', methods=['GET'])
def api_mappa(id):
    conn = get_db_connection2()
    studio = conn.execute('SELECT * FROM studi_com WHERE id = ?', (id,)).fetchone()
    conn.close()
    if studio is None:
        return jsonify({"error": "Studio commerciale non trovato!"}), 404

    try:
        lat, lon = geocode_address(studio['indirizzo_studi_com'])
        if lat and lon:
            return jsonify({
                "nome": studio['nome_studi_com'],
                "indirizzo": studio['indirizzo_studi_com'],
                "lat": lat,
                "lng": lon
            })
        else:
            return jsonify({"error": "Geocoding fallito!"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/paginaMappa')
def pagina_mappa():
    return render_template('paginaMappa.html')
    
@app.route('/api/get_link/<int:id>', methods=['GET'])
def get_link(id):
    conn = get_db_connection2()
    studio = conn.execute('SELECT link_studi_com FROM studi_com WHERE id = ?', (id,)).fetchone()
    conn.close()
    if studio is None:
        return jsonify({"error": "Link non trovato!"}), 404

    return jsonify({"link": studio['link_studi_com']})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)  # Avvio dell'applicazione Flask
