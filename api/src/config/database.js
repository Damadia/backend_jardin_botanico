import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

// Habilitar modo verbose para debugging
const sqlite = sqlite3.verbose();

// Ruta de la base de datos SQLite
const DB_PATH = process.env.DB_PATH || './database.sqlite';

// Crear conexión a la base de datos
const db = new sqlite.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos SQLite:', err.message);
        process.exit(1);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite');
    }
});

// Convertir métodos de callback a promesas con el contexto correcto
db.runAsync = function(...args) {
    return new Promise((resolve, reject) => {
        db.run(...args, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this); // 'this' contiene lastID, changes, etc.
            }
        });
    });
};

db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));
db.execAsync = promisify(db.exec.bind(db));

// Habilitar foreign keys en SQLite
db.run('PRAGMA foreign_keys = ON;');

export default db;
