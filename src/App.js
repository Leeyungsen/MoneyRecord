import React, { useEffect } from 'react';
import {createTables} from '../database';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Detail from './pages/Detail';
import Change from './pages/Change';
import Display from './pages/Display';

const Stack = createStackNavigator();

const App = () => {
    useEffect(() => {
        createTables();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Change">
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Detail" component={Detail} />
                <Stack.Screen name="Display" component={Display} />
                <Stack.Screen name="Change" component={Change} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
