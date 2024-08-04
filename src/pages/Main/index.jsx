import React, { useEffect, useState } from 'react';
import { Text, 
    SafeAreaView, 
    View, 
    Button, 
    FlatList, 
    TextInput, 
    TouchableOpacity,
    Alert} from 'react-native';
import styles from '../../../styles';

const formatAmount = (amount) => {
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Main = () => {
    const [entries, setEntries] = useState([]);
    const [amount, setAmount] = useState('');
    const [info, setInfo] = useState('');
    const [totalUntung, setTotalUntung] = useState(0);
    const [totalRugi, setTotalRugi] = useState(0);

    useEffect(() => {
        const untungTotal = entries
            .filter(entry => entry.type === 'untung')
            .reduce((total, entry) => total + parseFloat(entry.amount.replace(/\./g, '')), 0);
        setTotalUntung(untungTotal);

        const rugiTotal = entries
            .filter(entry => entry.type === 'rugi')
            .reduce((total, entry) => total + parseFloat(entry.amount.replace(/\./g, '')), 0);
        setTotalRugi(rugiTotal);
    }, [entries]);

    const addEntry = (type) => {
        if (amount.trim() !== '' && info.trim() !== '') {
            const newEntry = { amount: formatAmount(amount), info, type };
            const newList = [...entries, newEntry];
            setEntries(newList);
            console.log('Updated entries:', newList);
            setAmount('');
            setInfo('');
        }
    };

    const confirmDeleteEntry = (index) => {
        Alert.alert(
            "confirm Delete",
            'are you sure?',
            [
                {
                    text: "cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteEntry(index),
                    style: "Destructive",
                },
            ],
            {cancelable: false}
        );
    }

    const deleteEntry = (index) => {
        const newList = entries.filter((_, i) => i !== index);
        setEntries(newList);
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={[styles.text, styles.textGreen]}>Profit {formatAmount(totalUntung.toString())}</Text>
                <Text style={[styles.text, styles.textRed]}>Loss {formatAmount(totalRugi.toString())}</Text>
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
            </View>
            <FlatList
                data={entries}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : styles.itemTextRed]}>
                            Amount: {item.amount}
                        </Text>
                        <Text style={[styles.itemText, item.type === 'untung' ? styles.itemTextGreen : styles.itemTextRed]}>
                            Info: {item.info}
                        </Text>
                        <TouchableOpacity onPress={() => confirmDeleteEntry(index)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                inverted
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default Main;
