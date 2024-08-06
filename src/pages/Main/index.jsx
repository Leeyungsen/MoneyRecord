import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import styles from '../../../styles';

const Main = ({ navigation , route }) => {
    const {totalUntung = '0', totalRugi = '0', totalBon = '0' } = route.params || {};
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={[styles.text, styles.textGreen]}>{totalUntung}</Text>
                <Text style={[styles.text, styles.textRed]}>{totalRugi}</Text>
                <Text style={[styles.text, styles.textYellow]}>{totalBon}</Text>
            </View>
            <View>
            <Button title="See Other" onPress={() => navigation.navigate("Change")} />
            </View>
        </SafeAreaView>
    );
};

export default Main;