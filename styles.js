import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    text: {
        backgroundColor: 'white',
        fontWeight: 'bold',
        flex: 1,
        height: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    textGreen: {
        color: 'green',
    },
    textRed: {
        color: 'red',
    },
    inputContainer: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 8,
        paddingLeft: 8,
        height: 40,
    },
    item: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    itemTextGreen: {
        color: 'green',
    },
    itemTextRed: {
        color: 'red',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        marginLeft: 4,
        marginRight: 4,
    },
    listContainer: {
        flex: 1,
        marginTop: 20,
    },
    deleteButton: {
        marginLeft: 10,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: "bold",
    }
});

export default styles;