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

// Fetch all entries
export const fetchAllEntries = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM entries',
            [],
            (tx, results) => {
                let data = [];
                for (let i = 0; i < results.rows.length; i++) {
                    data.push(results.rows.item(i));
                }
                callback(data);
            },
            (error) => {
                console.error('Error fetching all entries:', error);
                callback([]);
            }
        );
    });
};

// Fetch entries by date
export const fetchEntriesByDate = (date, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM entries WHERE date = ?',
            [date],
            (tx, results) => {
                let data = [];
                for (let i = 0; i < results.rows.length; i++) {
                    data.push(results.rows.item(i));
                }
                callback(data);
            },
            (error) => {
                console.error('Error fetching entries by date:', error);
                callback([]);
            }
        );
    });
};

// Update an entry by ID
export const updateEntry = (id, newAmount, newInfo, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE entries SET amount = ?, info = ? WHERE id = ?',
            [newAmount, newInfo, id],
            (tx, results) => {
                if (results.rowsAffected > 0) {
                    console.log('Entry updated successfully');
                    callback(); // Callback to refresh the data after update
                } else {
                    console.log('Failed to update entry');
                }
            },
            (error) => {
                console.error('Error updating entry: ', error);
            }
        );
    });
};

// Delete an entry by ID
export const deleteEntry = (id, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM entries WHERE id = ?',
            [id],
            (tx, results) => {
                if (results.rowsAffected > 0) {
                    console.log('Entry deleted successfully');
                    callback(); // Callback to refresh the data after deletion
                } else {
                    console.log('Failed to delete entry');
                }
            },
            (error) => {
                console.error('Error deleting entry: ', error);
            }
        );
    });
};


export default db;