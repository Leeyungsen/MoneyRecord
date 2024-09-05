import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff ',
    padding: 10,
  },
  row: {
    backgroundColor: 'white',
    margin: '10',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  textYellow: {
    color: '#e88974',
  },
  Date: {
    color: 'black',
  },
  Box: {
    borderWidth: 1,
    borderColor: '#ddd', 
    borderRadius: 5,
    paddingVertical: 5, 
    paddingHorizontal: 10,
    marginBottom: 10,
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
  itemTextYellow: {
    color: '#e88974',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
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
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button1: {
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default styles;
