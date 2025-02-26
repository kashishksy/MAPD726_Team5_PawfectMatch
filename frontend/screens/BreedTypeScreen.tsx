import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

const breedsByType = {
  dogs: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Mixed Breed'],
  cats: ['Domestic Shorthair', 'Maine Coon', 'Persian', 'Siamese', 'Ragdoll', 'Bengal', 'Mixed Breed'],
  rabbits: ['Holland Lop', 'Dutch', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Jersey Wooly'],
  birds: ['Parakeet', 'Cockatiel', 'Canary', 'Finch', 'Lovebird', 'Conure', 'Macaw'],
  reptiles: ['Bearded Dragon', 'Gecko', 'Ball Python', 'Corn Snake', 'Turtle', 'Iguana'],
  fish: ['Betta', 'Goldfish', 'Guppy', 'Tetra', 'Angelfish', 'Molly', 'Platy'],
  primates: ['Capuchin', 'Marmoset', 'Tamarin', 'Squirrel Monkey', 'Lemur'],
  horses: ['Quarter Horse', 'Arabian', 'Thoroughbred', 'Morgan', 'Appaloosa', 'Mustang'],
  other: ['Hamster', 'Guinea Pig', 'Ferret', 'Hedgehog', 'Chinchilla', 'Sugar Glider'],
};

const BreedTypeScreen = ({ navigation, route }: any) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);

  const petTypes = route.params?.petTypes || 'dogs';

  useEffect(() => {
    setBreeds(breedsByType[petTypes as keyof typeof breedsByType] || []);
  }, [petTypes]);

  const toggleBreedSelection = (breed: string) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter((b) => b !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  const handleContinue = () => {
    navigation.navigate('PersonalInfo', { 
      petTypes, 
      selectedBreeds 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../assets/images/back_icon.png')} style={styles.inputIcon} />
        </TouchableOpacity>
        <ProgressBar currentStep={3} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Select Breeds</Text>
        <Text style={styles.subtitle}>
          What specific breeds are you interested in?{'\n'}
          You can select multiple options.
        </Text>

        <FlatList
          data={breeds}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.breedList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.breedItem,
                selectedBreeds.includes(item) && styles.selectedBreedItem,
              ]}
              onPress={() => toggleBreedSelection(item)}
            >
              <Text style={styles.breedText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          selectedBreeds.length === 0 && styles.continueButtonDisabled
        ]}
        disabled={selectedBreeds.length === 0}
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
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20,
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
  breedList: {
    paddingBottom: 16,
  },
  breedItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedBreedItem: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF8F0',
  },
  breedText: {
    fontSize: 16,
    color: '#333',
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

export default BreedTypeScreen;