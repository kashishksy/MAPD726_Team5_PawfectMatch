import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const screens = [
  'Login',
  'UserType',
  'PetType',
  'BreedType',
  'PersonalInfo',
  'Dashboard'
];

const DevScreenSelector = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Development Screen Selector</Text>
      <View style={styles.buttonContainer}>
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen}
            style={styles.button}
            onPress={() => navigation.navigate(screen)}
          >
            <Text style={styles.buttonText}>{screen}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DevScreenSelector; 