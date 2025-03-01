import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';

const SplashScreen = ({ navigation }:any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const hasSeenWalkthrough = useSelector((state: any) => state.walkthrough.hasSeenWalkthrough);

  useEffect(() => {
    // Fade in the text over 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 1, // Final opacity: 1
      duration: 3000, // 3 seconds
      useNativeDriver: true, // Enable native driver for better performance
    }).start();

    // Navigate to appropriate screen after 3 seconds
    const timer = setTimeout(() => {
      if (hasSeenWalkthrough) {
        // User has seen walkthrough, go directly to Login
        navigation.replace('Login');
      } else {
        // New user, go to Walkthrough
        navigation.replace('Walkthrough');
      }
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, hasSeenWalkthrough]);

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