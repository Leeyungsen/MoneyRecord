import React, { useState } from "react";
import { Button, Text, View, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import styles from "../../../styles";
import { FlatList } from "react-native-gesture-handler";

const Change = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonNames, setButtonNames] = useState([]);
    const [tempName, setTempName] = useState('');

    const handleSave = () => {
        if (tempName.trim()) {
            setButtonNames([...buttonNames, tempName]);
            setTempName(tempName);
            setModalVisible(false);
        }
    };
    const showPrompt = () => {
        setTempName('');
        setModalVisible(true);
    }

    return (
        <View style={styles.container}>
            <Button 
                title="NEW" 
                onPress={() => showPrompt()} 
            />
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Button Name</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={tempName}
                            onChangeText={setTempName}
                            placeholder="Enter button name"
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <Button title="Save" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList 
                data={buttonNames}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.button1}
                        onPress={() => navigation.navigate('Display', { userName: item})}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Change;
