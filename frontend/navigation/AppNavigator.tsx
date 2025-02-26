import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import PetTypeScreen from '../screens/PetTypeScreen';
import SplashScreen from '../components/SplashScreen';
import BreedTypeScreen from '../screens/BreedTypeScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DevScreenSelector from '../screens/DevScreenSelector';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isDevelopment = __DEV__;
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isDevelopment ? "DevSelector" : "Splash"}
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="DevSelector" component={DevScreenSelector} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="PetType" component={PetTypeScreen} />
        <Stack.Screen name="BreedType" component={BreedTypeScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
