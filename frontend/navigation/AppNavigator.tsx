import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import PetTypeScreen from '../screens/PetTypeScreen';
import SplashScreen from '../components/SplashScreen';
import BreedTypeScreen from '../screens/BreedTypeScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="PetType" component={PetTypeScreen} />
        <Stack.Screen name="BreedType" component={BreedTypeScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
