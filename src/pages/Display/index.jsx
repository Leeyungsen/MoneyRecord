import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View, Button, FlatList, TextInput, TouchableOpacity, Alert , Modal} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from "../../../styles";
import SQLlite from "react-native-sqlite-storage";
// Open SQLite database
const db = SQLlite.openDatabase({ name: 'app.db', location: 'default' });
// Function to format amount with thousands separator
const formatAmount = (amount) => {
    if (typeof amount !== 'string') {
        amount = String(amount); // Convert to string if not already
    }
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
// Function to format date as YYYY-MM-DD
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};
// Display component
const Display = ({ navigation, route }) => {
    const [entries, setEntries] = useState([]);
    const [amount, setAmount] = useState('');
    const [info, setInfo] = useState('');
    const [totalUntung, setTotalUntung] = useState(0);
    const [totalRugi, setTotalRugi] = useState(0);
    const [totalBon, setTotalBon] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEntry, setSelectEntry] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const userName = route.params?.userName || '';
    // Load entries from the database
    const loadEntries = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM entries WHERE userName = ?',
                [userName],
                (tx, results) => {
                    let data = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        data.push(results.rows.item(i));
                    }
                    setEntries(data); // Update entries state
                },
                (tx, error) => {
                    console.error('Error loading entries:', error);
                    setEntries([]); // Clear entries on error
                }
            );
        });
    };
    // Create table and load entries when component mounts
    useEffect(() => {
        // Create table if not exists
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
                (tx, result) => console.log('Table created successfully'),
                (tx, error) => console.log('Error creating table:', error)
            );
        });
        loadEntries(); // Initial load of entries
    }, []);
    // Calculate totals whenever entries change
    useEffect(() => {
        const untungTotal = entries
            .filter(entry => entry.type === 'untung')
            .reduce((total, entry) => {
                const amount = typeof entry.amount === 'string' ? entry.amount.replace(/\./g, '') : String(entry.amount).replace(/\./g, '');
                return total + parseFloat(amount);
            }, 0);
        setTotalUntung(untungTotal);
        const rugiTotal = entries
            .filter(entry => entry.type === 'rugi')
            .reduce((total, entry) => {
                const amount = typeof entry.amount === 'string' ? entry.amount.replace(/\./g, '') : String(entry.amount).replace(/\./g, '');
                return total + parseFloat(amount);
            }, 0);
        setTotalRugi(rugiTotal);
        const bonTotal = entries
            .filter(entry => entry.type === 'bon')
            .reduce((total, entry) => {
                const amount = typeof entry.amount === 'string' ? entry.amount.replace(/\./g, '') : String(entry.amount).replace(/\./g, '');
                return total + parseFloat(amount);
            }, 0);
        setTotalBon(bonTotal);
    }, [entries]);
    // Add new entry to the database
    const addEntry = (type) => {
        if (amount.trim() === '' || info.trim() === '' || userName.trim() === '') {
            console.error('Validation failed: One or more fields are empty.');
            return;
        }
        const formattedDate = formatDate(date);
        const rawAmount = amount.replace(/\./g ,'')
        console.log('Inserting entry with data:', { amount: rawAmount, info, userName, type, date: formattedDate });
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO entries (amount, info, userName, type, date) VALUES (?, ?, ?, ?, ?)',
                [rawAmount, info, userName, type, formattedDate],
                (tx, result) => {
                    console.log('Entry added successfully');
                    loadEntries(); // Refresh the list after insertion
                },
                (tx, error) => {
                    console.error('Error adding entry:', error);
                }
            );
        });
        setAmount('');
        setInfo('');
    };
    // Confirm deletion of an entry
    const confirmDeleteEntry = (id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this entry?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => deleteEntryById(id), style: "destructive" },
            ],
            { cancelable: false }
        );
    };
    // Delete entry by ID
    const deleteEntryById = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM entries WHERE id = ?',
                [id],
                (tx, result) => {
                    console.log('Entry deleted successfully');
                    loadEntries(); // Refresh the list after deletion
                },
                (tx, error) => {
                    console.error('Error deleting entry:', error);
                }
            );
        });
    };

    // Open modal to edit entry
    const openEditModal = (entry) => {
        setSelectEntry(entry);
        setAmount(entry.amount);
        setInfo(entry.info);
        setDate(new Date(entry.date));
        setEditingItem(entry);
        setModalVisible(true);
    }

    // Update entry in database
    const updateEntry = () => {
        if (editingItem) {
            const formattedDate = formatDate(date);
            const rawAmount = amount.replace(/\./g, '');

            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE entries SET amount = ?, info = ?, date = ? WHERE id = ?',
                    [rawAmount, info, formattedDate, editingItem.id],
                    (tx, result) => {
                        console.log('Entry updated successfully');
                        loadEntries(); // Refresh the list after update
                        setEditingItem(null); // Reset editingItem
                        setAmount(''); // Clear input fields
                        setInfo('');
                        setModalVisible(false); // Close the modal
                    },
                    (tx, error) => {
                        console.error('Error updating entry:', error);
                    }
                );
            });
        }
    };

    const handleClearData = () => {
        Alert.alert(
            "Confirm Clear Data",
            "Are you sure you want to delete all data for this user?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    onPress: () => {
                        db.transaction(tx => {
                            tx.executeSql(
                                'DELETE FROM entries WHERE userName = ?',
                                [userName],
                                (tx, result) => {
                                    console.log('All data deleted for', userName);
                                    // Clear entries state and reload entries
                                    setEntries([]); // Clear state
                                    loadEntries(); // Reload to ensure FlatList is updated
                                },
                                (tx, error) => {
                                    console.error('Error deleting data:', error);
                                }
                            );
                        });
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    };

    const saveEntry = (type) => {
        if (amount.trim() === '' || info.trim() === '' || userName.trim() === '') {
            console.error('Validation failed: One or more fields are empty.');
            return;
        }

        const formattedDate = formatDate(date);
        const rawAmount = amount.replace(/\./g, '');

        if (editingItem) {
            // Update existing entry
            updateEntry();
        } else {
            // Add new entry
            addEntry(type);
        }

        setModalVisible(false); // Close the modal after saving
    };

    // Calculate difference between totalUntung and totalRugi
    const difference = totalUntung - totalRugi;
    const differenceTextStyle = difference >= 0 ? styles.textGreen : styles.textRed;
    const differenceBoxStyle = difference >= 0 ? styles.boxGreen : styles.boxRed;

    // Handling Date picker
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button
                    title="Go to Main"
                    onPress={() => navigation.navigate('Main')}
                />
            </View>
            <View style={styles.row}>
                <Text style={[styles.box, styles.textGreen]}>{formatAmount(totalUntung)}</Text>
                <Text style={[styles.box, styles.textRed]}>{formatAmount(totalRugi)}</Text>
                <Text style={[styles.box, styles.textYellow]}>{formatAmount(totalBon)}</Text>
            </View>
            <View style={[styles.box, differenceBoxStyle]}>
                <Text style={differenceTextStyle}>
                    {difference >= 0 ? `Profit: ${formatAmount(difference)}` : `Loss: ${formatAmount(Math.abs(difference))}`}
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Nominal"
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={info}
                    onChangeText={setInfo}
                    placeholder="Keterangan"
                />
            
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.Date}>Pilih Tanggal: {formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => addEntry('rugi')}>
                    <Text style={styles.buttonText}>Pengeluaran</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => addEntry('untung')}>
                    <Text style={styles.buttonText}>Penghasilan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => addEntry('bon')}>
                    <Text style={styles.buttonText}>Bon</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.deleteButton, styles.clearButton]} onPress={handleClearData}>
                <Text style={styles.deleteButtonText}>Clear All Data</Text>
            </TouchableOpacity>
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={[
                            styles.itemText,
                            item.type === 'untung' ? styles.itemTextGreen :
                            item.type === 'rugi' ? styles.itemTextRed :
                            styles.itemTextYellow
                        ]}>
                            Rp. {formatAmount(parseFloat(item.amount))}
                        </Text>
                        <Text style={[
                            styles.itemText,
                            item.type === 'untung' ? styles.itemTextGreen :
                            item.type === 'rugi' ? styles.itemTextRed :
                            styles.itemTextYellow
                        ]}>
                            Info: {item.info}
                        </Text>
                        <Text style={[
                            styles.itemText,
                            item.type === 'untung' ? styles.itemTextGreen :
                            item.type === 'rugi' ? styles.itemTextRed :
                            styles.itemTextYellow
                        ]}>
                            Tanggal: {item.date}
                        </Text>
                        <TouchableOpacity onPress={() => confirmDeleteEntry(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                )}
                inverted
                contentContainerStyle={{ flexGrow: 1 }}
            />

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Info"
                        value={info}
                        onChangeText={setInfo}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.Date}>Pilih Tanggal: {formatDate(date)}</Text>
                    </TouchableOpacity>
                    <Button title="Save Entry" onPress={() => saveEntry(editingItem?.type)} />
                    <Button title="Cancel" onPress={() => {
                        setModalVisible(false);
                        setEditingItem(null); // Clear editing state on cancel
                    }} />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Display;