import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../redux/store';
import { setWalkthroughSeen } from '../redux/slices/walkthroughSlice';

import WalkthroughScreen from '../components/Walkthrough';
import LoginScreen from '../screens/LoginScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import PetTypeScreen from '../screens/PetTypeScreen';
import SplashScreen from '../components/SplashScreen';
import BreedTypeScreen from '../screens/BreedTypeScreen';
import PersonalInfoScreen from '../screens/PersonalInfoScreen';
import DashboardScreen from '../screens/DashboardScreen';
import DevScreenSelector from '../screens/DevScreenSelector';
import SearchScreen from '../screens/SearchScreen';
import TermsScreen from '../screens/TermsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isDevelopment = !__DEV__;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const hasSeenWalkthrough = useSelector((state: { walkthrough: { hasSeenWalkthrough: boolean } }) => state.walkthrough.hasSeenWalkthrough);

  useEffect(() => {
    const checkWalkthrough = async () => {
      try {
        const walkthroughSeen = await AsyncStorage.getItem('walkthroughSeen');
        if (walkthroughSeen === 'true') {
          dispatch(setWalkthroughSeen());
        }
      } catch (error) {
        console.warn('Error checking walkthrough status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkWalkthrough();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6F61' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isDevelopment ? "DevSelector" : "Splash"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
        <Stack.Screen name="DevSelector" component={DevScreenSelector} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="TermsConditions" component={TermsScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="PetType" component={PetTypeScreen} />
        <Stack.Screen name="BreedType" component={BreedTypeScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNav = () => (
  <Provider store={store}>
    <AppNavigator />
  </Provider>
);
// navigation/types.ts or in AppNavigator.tsx
export type RootStackParamList = {
  Splash: undefined;
  Walkthrough: undefined;
  DevSelector: undefined;
  Login: undefined;
  TermsConditions: undefined; // <-- Added this line
  UserType: undefined;
  PetType: undefined;
  BreedType: undefined;
  PersonalInfo: undefined;
  DashboardScreen: undefined;
  SearchScreen: undefined;
};

export default AppNav;
