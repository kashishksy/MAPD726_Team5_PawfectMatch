import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const CatPawLoader = () => {
//   if (!visible) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/images/paw-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  animation: {
    width: 200,
    height: 200,
    color: 'red',
  },
});

export default CatPawLoader;
