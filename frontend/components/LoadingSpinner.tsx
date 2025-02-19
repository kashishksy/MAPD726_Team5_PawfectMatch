import React from 'react';
import { ActivityIndicator, View, StyleSheet, Animated, Easing } from 'react-native';
 
export const SpinnerSimpleUsageShowcase = () => {
  const spinValue = new Animated.Value(0);
 
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration:2000, // Increased duration to 3 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
 
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
 
  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </Animated.View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
 
export default SpinnerSimpleUsageShowcase;