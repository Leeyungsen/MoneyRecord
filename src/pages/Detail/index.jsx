import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from '../../../styles';

import { fetchEntriesByDate, fetchAllEntries } from '../../../database'; // Adjust the path as needed
import { useFocusEffect } from '@react-navigation/native';

const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Detail = () => {
    const [entries, setEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState([]);

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
                            Rp. {formatAmount(parseFloat(item.amount).toFixed(2))}
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
                            Tanggal: {item.date}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
};

export default Detail;
