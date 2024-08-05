import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import styles from '../../../styles';

const Display = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>This is another screen</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} />
            </View>
        </SafeAreaView>
    );
};

export default Display;
