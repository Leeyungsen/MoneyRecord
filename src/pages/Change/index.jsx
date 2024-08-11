import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SQLite from 'react-native-sqlite-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from "../../../styles";

const db = SQLite.openDatabase(
    {
        name: 'ButtonDB.db',
        location: 'default',
    },
    () => { console.log('Database opened'); },
    error => { console.error(error); }
);

const Change = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonNames, setButtonNames] = useState([]);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        // Create tables if they don't exist
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Buttons (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
            );
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount TEXT, info TEXT, userName TEXT, type TEXT, date TEXT);'
            );
        });

        // Load existing button names from the database
        loadButtonNames();
    }, []);

    const loadButtonNames = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Buttons;',
                [],
                (tx, results) => {
                    let names = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        names.push(results.rows.item(i).name);
                    }
                    setButtonNames(names);
                },
                error => {
                    console.error('Failed to load button names', error);
                }
            );
        });
    };

    const handleSave = () => {
        if (tempName.trim()) {
            // Insert the new button name into the database
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO Buttons (name) VALUES (?);',
                    [tempName],
                    (tx, results) => {
                        console.log('Inserted new button', results);
                        setButtonNames([...buttonNames, tempName]);
                        setModalVisible(false);
                    },
                    error => {
                        console.error('Failed to insert button name', error);
                        Alert.alert('Error', 'Failed to save button name.');
                    }
                );
            });
        }
    };

    const handleDelete = (userName) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete "${userName}" and all related data?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => deleteUserAndEntries(userName), style: "destructive" },
            ],
            { cancelable: false }
        );
    };

    const deleteUserAndEntries = (userName) => {
        db.transaction(tx => {
            // Delete the user from the Buttons table
            tx.executeSql(
                'DELETE FROM Buttons WHERE name = ?;',
                [userName],
                (tx, results) => {
                    console.log('Deleted button', userName);

                    // Delete all related entries from the entries table
                    tx.executeSql(
                        'DELETE FROM entries WHERE userName = ?;',
                        [userName],
                        (tx, results) => {
                            console.log('Deleted all entries for', userName);
                            // Reload the button names after deletion
                            loadButtonNames();
                        },
                        error => {
                            console.error('Failed to delete entries', error);
                        }
                    );
                },
                error => {
                    console.error('Failed to delete button', error);
                }
            );
        });
    };

    const showPrompt = () => {
        setTempName('');
        setModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <Button 
                title="Calender"
                onPress={() => navigation.navigate('Detail')}
            />
            <Button 
                title="Total"
                onPress={() => navigation.navigate('Main')}
            />
            <Button 
                title="NEW" 
                onPress={showPrompt} 
            />
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Button Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={tempName}
                            onChangeText={setTempName}
                            placeholder="Enter button name"
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList 
                data={buttonNames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItemContainer}>
                        <TouchableOpacity 
                            style={styles.button1}
                            onPress={() => navigation.navigate('Display', { userName: item })}
                        >
                            <Text style={styles.buttonText}>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

export default Change;
