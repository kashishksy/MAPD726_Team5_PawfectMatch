import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setPetType } from '../redux/slices/registrationSlice';
import api from '../services/api';

const PetTypeScreen = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [petTypes, setPetTypes] = useState<Array<{_id: string, name: string, emoji: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        console.log('Fetching pet types...');
        const response = await api.get('/pets');
        const data = response.data;
        console.log('Pet types received:', data.data);
        setPetTypes(data.data);
      } catch (error) {
        console.error('Error fetching pet types:', error);
        setPetTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetTypes();
  }, []);

  const handleContinue = () => {
    if (selectedType) {
      dispatch(setPetType(selectedType));
      navigation.navigate('BreedType', { petTypes: selectedType });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../assets/images/back_icon.png')}
                style={styles.inputIcon}
          />
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
          {isLoading ? (
            <Text>Loading pet types...</Text>
          ) : (
            petTypes.map((pet) => (
              <TouchableOpacity
                key={pet._id}
                style={[
                  styles.petOption,
                  selectedType === pet._id && styles.selectedPetOption
                ]}
                onPress={() => setSelectedType(pet._id)}
              >
                <Text style={styles.emoji}>{pet.emoji}</Text>
                <Text style={styles.petName}>{pet.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !selectedType && styles.continueButtonDisabled
        ]}
        disabled={!selectedType}
        onPress={handleContinue}
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
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20
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