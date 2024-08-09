import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from '../../../styles';

const formatAmount = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Detail = ({ route }) => {
    const { entries = [] } = route.params;
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
                            Date: {item.date}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default Detail;
