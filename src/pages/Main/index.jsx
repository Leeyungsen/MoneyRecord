import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import styles from '../../../styles';

const Main = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>This is another screen</Text>
                <Button title="Go To Display" onPress={() => navigation.navigate("Display")} />
            </View>
        </SafeAreaView>
    );
};

export default Main;