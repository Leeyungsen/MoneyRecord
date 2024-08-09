import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, FlatList } from 'react-native';
import styles from '../../../styles';
import { Calendar } from 'react-native-calendars';

// Utility function for formatting amounts
const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Utility function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const Main = ({ navigation, route }) => {
    const { totalUntung = '0', totalRugi = '0', totalBon = '0', entries = [] } = route.params || {};
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState(entries);

    useEffect(() => {
        if (selectedDate) {
            const filteredData = entries.filter(entry => entry.date === selectedDate);
            setFilteredEntries(filteredData);
        } else {
            setFilteredEntries(entries);
        }
    }, [selectedDate, entries]);

    const totalDifference = parseFloat(totalUntung) - parseFloat(totalRugi);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                <Text style={[styles.text, styles.textGreen]}>{formatAmount(totalUntung)}</Text>
                <Text style={[styles.text, styles.textRed]}>{formatAmount(totalRugi)}</Text>
                <Text style={[styles.text, styles.textYellow]}>{formatAmount(totalBon)}</Text>
            </View>

            <View style={[
                styles.box,
                totalDifference >= 0 ? styles.boxGreen : styles.boxRed,
                { marginBottom: 10 }
            ]}>
                <Text style={totalDifference >= 0 ? styles.textGreen : styles.textRed}>
                    {totalDifference >= 0 
                        ? `Profit: ${formatAmount(totalDifference.toString())}` 
                        : `Loss: ${formatAmount(Math.abs(totalDifference).toString())}`}
                </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Button title="Add" onPress={() => navigation.navigate("Change")} />
            </View>

            <FlatList 
                data={filteredEntries}
                keyExtractor={(item, index) => `${item.type}-${index}`}
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
                            Amount: {formatAmount(item.amount.toString())}
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
                            Date: {formatDate(item.date)}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default Main;
