import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

export const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount TEXT,
                info TEXT,
                userName TEXT,
                type TEXT,
                date TEXT
            )`,
            [],
            (tx, result) => {
                console.log('Table created successfully');
            },
            (tx, error) => {
                console.log('Error creating table:', error);
            }
        );
    });
};

export const insertEntry = (db, amount, info, userName, type, date) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO entries (amount, info, userName, type, date) VALUES (?, ?, ?, ?, ?)`,
            [amount, info, userName, type, date],
            (tx, result) => {
                console.log('Entry added successfully');
            },
            (tx, error) => {
                console.log('Error adding entry:', error);
            }
        );
    });
};

export const deleteEntry = (id, successCallback) => {
    db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM entries WHERE id = ?`,
            [id],
            (_, result) => {
                successCallback(result);
            },
            (_, error) => {
                console.log("Error deleting entry:", error);
            }
        );
    });
};

export const fetchEntriesByDate = (date, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM entries WHERE date = ?;',
            [date],
            (tx, results) => {
                let data = [];
                for (let i = 0; i < results.rows.length; i++) {
                    data.push(results.rows.item(i));
                }
                callback(data);
            },
            (tx, error) => {
                console.error('Failed to fetch entries by date', error);
                callback([]);
            }
        );
    });
};

export const fetchAllEntries = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM entries;',
            [],
            (tx, results) => {
                let data = [];
                for (let i = 0; i < results.rows.length; i++) {
                    data.push(results.rows.item(i));
                }
                callback(data);
            },
            (tx, error) => {
                console.error('Failed to fetch all entries', error);
                callback([]);
            }
        );
    });
};

export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS Entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount TEXT, info TEXT, userName TEXT, type TEXT, date TEXT);',
            [],
            () => console.log('Table created successfully'),
            error => console.error('Failed to create table', error)
        );
    });
};setupDatabase();

export default db;