import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import api from '../services/api';


const SearchScreen = ({ navigation }: any) => {
  const [location, setLocation] = useState('New York, NY, US');
  const [petType, setPetType] = useState('');
  const [gender, setGender] = useState('');
  const [size, setSize] = useState('');
  const [age, setAge] = useState('');
  const [petTypes, setPetTypes] = useState<Array<{_id: string, name: string, emoji: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const response = await api.get('/pets');
        const data = response.data;
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

  const handleSearch = () => {
    console.log({ location, petType, gender, size, age });
    navigation.navigate('PetListScreen', { location, petType, gender, size, age });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/back_icon.png')} style={styles.inputIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Pet Search</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.label}>Location</Text>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <Text style={styles.label}>Pet Types</Text>
      <View style={styles.grid}>
        {isLoading ? (
          <Text>Loading pet types...</Text>
        ) : (
          petTypes.map((pet) => (
            <TouchableOpacity
              key={pet._id}
              style={[
                styles.petOption,
                petType === pet._id && styles.selectedPetOption
              ]}
              onPress={() => setPetType(pet._id)}
            >
              <Text style={[styles.emoji, petType === pet._id && styles.selectedText]}>{pet.emoji}</Text>
              <Text style={[styles.petName, petType === pet._id && styles.selectedText]}>{pet.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Text style={styles.label}>Gender (Optional)</Text>
      <View style={styles.optionContainer}>
        {['Any', 'Male', 'Female'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              gender === option && styles.selectedOption
            ]}
            onPress={() => setGender(option)}
          >
            <Text style={[styles.optionText, gender === option && styles.selectedText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Size (Optional)</Text>
      <View style={styles.optionContainer}>
        {['Small', 'Medium', 'Large'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              size === option && styles.selectedOption
            ]}
            onPress={() => setSize(option)}
          >
            <Text style={[styles.optionText, size === option && styles.selectedText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Age (Optional)</Text>
      <View style={styles.optionContainer}>
        {['Baby', 'Young', 'Adult', 'Senior'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              age === option && styles.selectedOption
            ]}
            onPress={() => setAge(option)}
          >
            <Text style={[styles.optionText, age === option && styles.selectedText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  inputIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 28,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  locationContainer: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  selectedPetOption: {
    borderColor: '#FF6F61',
    backgroundColor: '#FF6F61',
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
    color: '#333',
  },
  petName: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedOption: {
    borderColor: '#FF6F61',
    backgroundColor: '#FF6F61',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
