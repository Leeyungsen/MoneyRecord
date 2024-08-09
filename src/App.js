import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './pages/Main';
import Display from './pages/Display';
import Change from './pages/Change';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Display" component={Display} />
        <Stack.Screen name="Change" component={Change} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
