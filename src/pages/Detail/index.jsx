import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Alert, Modal, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from '../../../styles';
import { fetchEntriesByDate, fetchAllEntries, deleteEntry, updateEntry } from '../../../database'; // Adjust the path as needed
import { useFocusEffect } from '@react-navigation/native';

const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Detail = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newAmount, setNewAmount] = useState('');
    const [newInfo, setNewInfo] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            if (selectedDate) {
                fetchEntriesByDate(selectedDate, (data) => {
                    setFilteredEntries(data);
                });
            } else {
                fetchAllEntries((data) => {
                    setFilteredEntries(data);
                });
            }
        }, [selectedDate])
    );

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const handleEditPress = (entry) => {
        setEditingEntry(entry);
        setNewAmount(entry.amount); // Pre-fill with current amount
        setNewInfo(entry.info); // Pre-fill with current info
        setModalVisible(true);
    };

    const handleUpdate = () => {
        // Check if editingEntry is not null and has an id
        if (editingEntry && editingEntry.id) {
            if (newAmount !== '' && newInfo !== '') {
                // Update only amount and info
                updateEntry(editingEntry.id, newAmount, newInfo, () => {
                    Alert.alert('Success', 'Entry updated successfully');
                    setModalVisible(false);
                    setEditingEntry(null);
                    setNewAmount('');
                    setNewInfo('');
                    // Refresh the entries after update
                    if (selectedDate) {
                        fetchEntriesByDate(selectedDate, setFilteredEntries);
                    } else {
                        fetchAllEntries(setFilteredEntries);
                    }
                });
            } else {
                Alert.alert('Error', 'Please fill all fields.');
            }
        } else {
            console.log('Editing entry is null or invalid:', editingEntry); // Debugging line
            Alert.alert('Error', 'Entry not found.');
        }
    };

    const handleDelete = (id) => {
        Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    deleteEntry(id, () => {
                        Alert.alert('Success', 'Entry deleted successfully');
                        // Refresh the entries after deletion
                        if (selectedDate) {
                            fetchEntriesByDate(selectedDate, setFilteredEntries);
                        } else {
                            fetchAllEntries(setFilteredEntries);
                        }
                    });
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginBottom: 10 }}>
                <Calendar
                    onDayPress={handleDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, selectedColor: 'blue' },
                    }}
                />
            </View>

            <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : item.type === 'rugi' ? styles.itemTextRed : styles.itemTextYellow]}>
                            User: {item.userName}
                        </Text>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : item.type === 'rugi' ? styles.itemTextRed : styles.itemTextYellow]}>
                            Rp. {formatAmount(parseFloat(item.amount))}
                        </Text>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : item.type === 'rugi' ? styles.itemTextRed : styles.itemTextYellow]}>
                            Info: {item.info}
                        </Text>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : item.type === 'rugi' ? styles.itemTextRed : styles.itemTextYellow]}>
                            Tanggal: {item.date}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Button title="Edit" onPress={() => handleEditPress(item)} />
                            <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
                        </View>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
            />
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text>Edit Entry</Text>
                        <TextInput
                            value={newAmount}
                            onChangeText={setNewAmount}
                            placeholder="Rp"
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            value={newInfo}
                            onChangeText={setNewInfo}
                            placeholder='Keterangan'
                            style={styles.input}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Button title="Save" onPress={handleUpdate} />
                            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Detail;
