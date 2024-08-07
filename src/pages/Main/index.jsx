import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import styles from '../../../styles';
import { FlatList } from 'react-native-gesture-handler';

const Main = ({ navigation , route }) => {
    const {totalUntung = '0', totalRugi = '0', totalBon = '0', entries = [] } = route.params || {};
    
    return (
        <SafeAreaView style={styles.container}>

            {/* // Buat calender supaya bisa liat data per hari */}

            <View style={styles.row}>
                <Text style={[styles.text, styles.textGreen]}>{totalUntung}</Text>
                <Text style={[styles.text, styles.textRed]}>{totalRugi}</Text>
                <Text style={[styles.text, styles.textYellow]}>{totalBon}</Text>
            </View>
            <View>
            <Button title="Add" onPress={() => navigation.navigate("Change")} />
            </View>
            <FlatList 
                data={entries}
                keyExtractor={(item, index) => `${item.type}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        {/* 
                            Ini udah bener kasih liat keseluruhan tapi bisa 
                            berubah ketika tanggal dipilih secara spesifik
                        */}
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
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Main;