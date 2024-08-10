import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SQLite from 'react-native-sqlite-storage';
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
        // Create table if it doesn't exist
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Buttons (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);'
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

    const showPrompt = () => {
        setTempName('');
        setModalVisible(true);
    }

    return (
        <View style={styles.container}>
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
                    <TouchableOpacity 
                        style={styles.button1}
                        onPress={() => navigation.navigate('Display', { userName: item })}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Change;
