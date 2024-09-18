import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Add Picker from react-native-picker
import { useFocusEffect } from '@react-navigation/native';
import styles from '../../../styles';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

const formatAmount = (amount) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0';
};

const calculateTotals = (entries, type) => {
    return entries
        .filter(entry => entry.type === type)
        .reduce((total, entry) => {
            const amount = entry.amount ? parseFloat(entry.amount.toString().replace(/\./g, '')) : 0;
            return total + (isNaN(amount) ? 0 : amount);
        }, 0);
};

const sortEntriesByDate = (entries) => {
    return entries.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')); 
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
    });
};

const Main = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [totalUntung, setTotalUntung] = useState(0);
    const [totalRugi, setTotalRugi] = useState(0);
    const [totalBon, setTotalBon] = useState(0);
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState('all'); // State for selected user
    const [users, setUsers] = useState([]); // List of users for the dropdown

    const loadEntries = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM entries',
                [],
                (tx, results) => {
                    let data = [];
                    let userList = new Set(); // To collect unique user names
                    for (let i = 0; i < results.rows.length; i++) {
                        const entry = results.rows.item(i);
                        data.push(entry);
                        if (entry.userName) {
                            userList.add(entry.userName); // Add unique user to the set
                        }
                    }
                    setEntries(data);
                    setUsers([...userList]); // Set unique users to the users state
                },
                (tx, error) => {
                    console.error('Error loading entries:', error);
                    setEntries([]);
                }
            );
        });
    };

    useEffect(() => {
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

        loadEntries();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadEntries();
        }, [])
    );

    useEffect(() => {
        setTotalUntung(calculateTotals(entries, 'untung'));
        setTotalRugi(calculateTotals(entries, 'rugi'));
        setTotalBon(calculateTotals(entries, 'bon'));

        // Filter by selected user and type (untung, rugi, bon, etc.)
        let filtered = entries;
        if (filter !== 'all') {
            filtered = filtered.filter(entry => entry.type === filter);
        }
        if (selectedUser !== 'all') {
            filtered = filtered.filter(entry => entry.userName === selectedUser);
        }
        setFilteredEntries(sortEntriesByDate(filtered));

    }, [entries, filter, selectedUser]); // Recalculate totals and filter whenever entries, filter, or user changes

    const difference = totalUntung - totalRugi;
    const differenceTextStyle = difference >= 0 ? styles.textGreen : styles.textRed;

    return (
        <SafeAreaView style={styles.container}>

            {/* Dropdown */}
            <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue) => setSelectedUser(itemValue)}
                style={styles.picker}>
                <Picker.Item label="All Users" value="all" />
                {users.map((user, index) => (
                    <Picker.Item key={index} label={user} value={user} />
                ))}
            </Picker>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.buttonRugi, filter === 'rugi' && styles.buttonActive]}
                    onPress={() => setFilter('rugi')}>
                    <Text style={styles.buttonText}>Pengeluaran</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonUntung, filter === 'untung' && styles.buttonActive]}
                    onPress={() => setFilter('untung')}>
                    <Text style={styles.buttonText}>Penghasilan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonBon, filter === 'bon' && styles.buttonActive]}
                    onPress={() => setFilter('bon')}>
                    <Text style={styles.buttonText}>Bon</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, filter === 'all' && styles.buttonActive]}
                    onPress={() => setFilter('all')}>
                    <Text style={styles.buttonText}>All</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={styles.row}>
                <Text style={[styles.box, styles.textGreen]}>{formatAmount(totalUntung)}</Text>
                <Text style={[styles.box, styles.textRed]}>{formatAmount(totalRugi)}</Text>
                <Text style={[styles.box, styles.textYellow]}>{formatAmount(totalBon)}</Text>
            </View>

            <Text style={differenceTextStyle}>Profit: {formatAmount(difference)}</Text> */}

            <View style={{ flex: 1 }}>
                {filteredEntries.length === 0 ? (
                    <Text style={styles.emptyMessage}>No data available</Text>
                ) : (
                    <FlatList
                        data={filteredEntries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={[
                                    styles.itemText,
                                    item.type === 'untung' ? styles.itemTextGreen :
                                    item.type === 'rugi' ? styles.itemTextRed :
                                    styles.itemTextYellow
                                ]}>
                                    User: {item.userName}
                                </Text>
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
                                    Date: {item.date}
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ flexGrow: 1 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Main;
