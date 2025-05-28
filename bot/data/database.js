
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'shop.db');
const db = new sqlite3.Database(dbPath);

async function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Tabela de produtos
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT,
                stock INTEGER DEFAULT 0,
                role_id TEXT,
                thumbnail TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Tabela de vendas
            db.run(`CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                products TEXT NOT NULL,
                total_price REAL NOT NULL,
                payment_status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            // Tabela de carrinhos
            db.run(`CREATE TABLE IF NOT EXISTS carts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                channel_id TEXT NOT NULL,
                products TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            resolve();
        });
    });
}

// Funções para produtos
const productDB = {
    create: (product) => {
        return new Promise((resolve, reject) => {
            const { name, price, description, stock, role_id, thumbnail } = product;
            db.run(
                'INSERT INTO products (name, price, description, stock, role_id, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
                [name, price, description, stock, role_id, thumbnail],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products ORDER BY created_at DESC', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    
    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    
    update: (id, product) => {
        return new Promise((resolve, reject) => {
            const { name, price, description, stock, role_id, thumbnail } = product;
            db.run(
                'UPDATE products SET name = ?, price = ?, description = ?, stock = ?, role_id = ?, thumbnail = ? WHERE id = ?',
                [name, price, description, stock, role_id, thumbnail, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    },
    
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
};

// Funções para carrinho
const cartDB = {
    create: (userId, channelId, products) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO carts (user_id, channel_id, products) VALUES (?, ?, ?)',
                [userId, channelId, JSON.stringify(products)],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    
    getByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM carts WHERE user_id = ?', [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    
    delete: (userId) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM carts WHERE user_id = ?', [userId], function(err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    }
};

// Funções para vendas
const saleDB = {
    create: (userId, products, totalPrice) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO sales (user_id, products, total_price) VALUES (?, ?, ?)',
                [userId, JSON.stringify(products), totalPrice],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    },
    
    updateStatus: (id, status) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE sales SET payment_status = ? WHERE id = ?',
                [status, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }
};

module.exports = { initDatabase, productDB, cartDB, saleDB };
