import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const AdoptionBanner = () => {
  return (
    <View style={styles.banner}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Just About to Adopt?</Text>
        <Text style={styles.subtitle}>
          See how you can find friends who are a match for you.
        </Text>
      </View>
      <Image
        source={require('../../assets/images/dog1.png')}
        style={styles.bannerImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#F4A460',
    borderRadius: 12,
    margin: 16,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 150,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    width:200
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    width:200,
  },
  bannerImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    right: 30,
    bottom: 0,
  },
});

export default AdoptionBanner; 