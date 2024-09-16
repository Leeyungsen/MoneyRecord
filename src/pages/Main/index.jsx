import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../../../styles';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

const formatAmount = (amount) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0';
};

// Function to calculate totals
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
        const dateA = new Date(a.date.split('/').reverse().join('-')); // Handle date format
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA; // Descending order
    });
};

const Main = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [totalUntung, setTotalUntung] = useState(0);
    const [totalRugi, setTotalRugi] = useState(0);
    const [totalBon, setTotalBon] = useState(0);
    const [filter, setFilter] = useState('all');

    const loadEntries = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM entries',
                [],
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

        loadEntries(); // Initial load of entries
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadEntries(); // Load entries every time the screen is focused
        }, [])
    );

    useEffect(() => {
        setTotalUntung(calculateTotals(entries, 'untung'));
        setTotalRugi(calculateTotals(entries, 'rugi'));
        setTotalBon(calculateTotals(entries, 'bon'));

        // Filter entries based on selected filter and sort by date
        let filtered = entries;
        if (filter !== 'all') {
            filtered = entries.filter((entry) => entry.type === filter);
        }
        setFilteredEntries(sortEntriesByDate(filtered));

    }, [entries, filter]);

    const difference = totalUntung - totalRugi;
    const differenceTextStyle = difference >= 0 ? styles.textGreen : styles.textRed;

    return (
        <SafeAreaView style={styles.container}>
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

            <View style={styles.row}>
                <Text style={[styles.box, styles.textGreen]}>{formatAmount(totalUntung)}</Text>
                <Text style={[styles.box, styles.textRed]}>{formatAmount(totalRugi)}</Text>
                <Text style={[styles.box, styles.textYellow]}>{formatAmount(totalBon)}</Text>
            </View>

            <Text style={differenceTextStyle}>Profit: {formatAmount(difference)}</Text>

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
