import React, { useEffect, useState } from 'react';
import { Text,
    SafeAreaView,
    View,
    Button,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert } from 'react-native';
import styles from '../../../styles';

const formatAmount = (amount) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Display = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [amount, setAmount] = useState('');
    const [info, setInfo] = useState('');
    const [totalUntung, setTotalUntung] = useState(0);
    const [totalRugi, setTotalRugi] = useState(0);
    const [totalBon, setTotalBon] = useState(0);

    useEffect(() => {
        const untungTotal = entries
            .filter(entry => entry.type === 'untung')
            .reduce((total, entry) => total + parseFloat(entry.amount.replace(/\./g, '')), 0);
        setTotalUntung(untungTotal);

        const rugiTotal = entries
            .filter(entry => entry.type === 'rugi')
            .reduce((total, entry) => total + parseFloat(entry.amount.replace(/\./g, '')), 0);
        setTotalRugi(rugiTotal);

        const bonTotal = entries
            .filter(entry => entry.type === 'bon')
            .reduce((total, entry) => total + parseFloat(entry.amount.replace(/\./g, '')), 0);
        setTotalBon(bonTotal);
    }, [entries]);

    const addEntry = (type) => {
        if (amount.trim() !== '' && info.trim() !== '') {
            const date = new Date().toLocaleDateString();
            const newEntry = { amount: formatAmount(amount), info, type, date };
            const newList = [...entries, newEntry];
            setEntries(newList);
            console.log('Updated entries:', newList);
            setAmount('');
            setInfo('');
        }
    };

    const confirmDeleteEntry = (index) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteEntry(index),
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    };

    const deleteEntry = (index) => {
        const newList = entries.filter((_, i) => i !== index);
        setEntries(newList);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Button title="Go to Other Screen" onPress={() => navigation.navigate('Main')} />
            <View style={styles.row}>
                <Text style={[styles.text, styles.textGreen]}>{formatAmount(totalUntung.toString())}</Text>
                <Text style={[styles.text, styles.textRed]}>{formatAmount(totalRugi.toString())}</Text>
                <Text style={[styles.text, styles.textYellow]}>{formatAmount(totalBon.toString())}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    value={info}
                    onChangeText={setInfo}
                    placeholder="Enter info"
                />
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button title="Add Untung" onPress={() => addEntry('untung')} />
                </View>
                <View style={styles.button}>
                    <Button title="Add Rugi" onPress={() => addEntry('rugi')} />
                </View>
                <View style={styles.button}>
                    <Button title="Add Bon" onPress={() => addEntry('bon')} />
                </View>
            </View>
            <FlatList
                data={entries}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Text style={[
                            styles.itemText,
                            item.type === 'untung' ? styles.itemTextGreen :
                            item.type === 'rugi' ? styles.itemTextRed :
                            styles.itemTextYellow
                        ]}>
                            Amount: {item.amount}
                        </Text>
                        <Text style={[
                            styles.itemText,
                            item.type === 'untung' ? styles.itemTextGreen :
                            item.type === 'rugi' ? styles.itemTextRed :
                            styles.itemTextYellow
                        ]}>
                            Info: {item.info}
                        </Text>
                        <Text 
                            style={[
                                item.type === 'untung' ? styles.itemTextGreen :
                                item.type === 'rugi' ? styles.itemTextRed :
                                styles.itemTextYellow
                            ]}
                        >
                            Date: {item.date}
                        </Text>
                        <TouchableOpacity onPress={() => confirmDeleteEntry(index)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default Display;
