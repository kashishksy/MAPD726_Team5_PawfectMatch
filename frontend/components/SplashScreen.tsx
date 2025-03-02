import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import { setLoggedIn, setUserData } from '../redux/slices/authSlice';

const SplashScreen = ({ navigation }:any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const dispatch = useDispatch();
  const hasSeenWalkthrough = useSelector((state: any) => state.walkthrough.hasSeenWalkthrough);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if we have a token
        const token = await getToken();
        
        if (!token) {
          throw new Error('No token found');
        }

        // Verify token by calling profile endpoint
        const response = await api.get('/auth/profile');
        
        // If successful, update Redux with user data
        dispatch(setUserData(response.data.data));
        dispatch(setLoggedIn(true));
        
        // Navigate to Dashboard
        navigation.replace('Dashboard');
      } catch (error) {
        console.log('Auth check failed:', error);
        // Token is invalid or expired
        if (hasSeenWalkthrough) {
          navigation.replace('Login');
        } else {
          navigation.replace('Walkthrough');
        }
      }
    };

    // Fade in the text over 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 1, // Final opacity: 1
      duration: 3000, // 3 seconds
      useNativeDriver: true, // Enable native driver for better performance
    }).start();

    // Check auth status after animation
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, hasSeenWalkthrough, dispatch]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/images/Animation_loading.json')} // Path to your animation
        autoPlay
        loop
        style={styles.animation}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        PawfectMatch
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6F61', // Light mode background
  },
  animation: {
    width: 400, // Adjust size as needed
    height: 400,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold', // Use your primary font
    color: '#333333', // Light mode text color
    marginTop: 16,
  },
});

export default SplashScreen;