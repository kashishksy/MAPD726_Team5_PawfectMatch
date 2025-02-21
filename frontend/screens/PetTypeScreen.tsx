import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from '../components/ProgressBar';

const petTypes = [
  { id: 'dogs', name: 'Dogs', emoji: '🐕' },
  { id: 'cats', name: 'Cats', emoji: '🐈' },
  { id: 'rabbits', name: 'Rabbits', emoji: '🐰' },
  { id: 'birds', name: 'Birds', emoji: '🦜' },
  { id: 'reptiles', name: 'Reptiles', emoji: '🦎' },
  { id: 'fish', name: 'Fish', emoji: '🐠' },
  { id: 'primates', name: 'Primates', emoji: '🐒' },
  { id: 'horses', name: 'Horses', emoji: '🐎' },
  { id: 'other', name: 'Other', emoji: '🐾' },
];

const PetTypeScreen = ({ navigation }:any) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <ProgressBar currentStep={2} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Let's Find Your Match!</Text>
        <Text style={styles.subtitle}>
          What type of animal are you looking to adopt?{'\n'}
          Don't worry, you can always change this later.
        </Text>

        <View style={styles.grid}>
          {petTypes.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petOption,
                selectedType === pet.id && styles.selectedPetOption
              ]}
              onPress={() => setSelectedType(pet.id)}
            >
              <Text style={styles.emoji}>{pet.emoji}</Text>
              <Text style={styles.petName}>{pet.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !selectedType && styles.continueButtonDisabled
        ]}
        disabled={!selectedType}
        onPress={() => navigation.navigate('NextScreen')}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  petOption: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPetOption: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF8F0',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  petName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    margin: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PetTypeScreen; 