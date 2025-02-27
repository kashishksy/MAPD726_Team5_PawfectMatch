import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedBreeds } from '../redux/slices/registrationSlice';
import { setLoggedIn } from '../redux/slices/authSlice';
import ProgressBar from '../components/ProgressBar';
import api from '../services/api';

interface Breed {
  _id: string;
  name: string;
}


const BreedTypeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [selectedBreeds, setLocalSelectedBreeds] = useState<Breed[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { petType } = useSelector((state: any) => state.registration);
  const { phoneNumber, countryCode } = useSelector((state: any) => state.auth);

  // Fetch breeds for the selected pet type
  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching breeds for pet:', petType);
        const response = await api.post('/breeds', {
          pet_id: petType
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        console.log('Breeds received:', data);
        setBreeds(data.data || []);
      } catch (error) {
        console.error('Error fetching breeds:', error);
        Alert.alert('Error', 'Failed to fetch breeds. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (petType) {
      fetchBreeds();
    }
  }, [petType]);

  const toggleBreedSelection = (breed: Breed) => {
    if (selectedBreeds.find(b => b._id === breed._id)) {
      setLocalSelectedBreeds(selectedBreeds.filter(b => b._id !== breed._id));
    } else {
      setLocalSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  const handleContinue = () => {
    if (selectedBreeds.length > 0) {
      // Store selected breeds in Redux
      dispatch(setSelectedBreeds(selectedBreeds));
      // Navigate to PersonalInfo screen
      navigation.navigate('PersonalInfo');
    }
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading breeds...</Text>
          </View>
        ) : (
          <FlatList
            data={breeds}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.breedList}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No breeds available</Text>
              </View>
            )}
            renderItem={({ item: breed }) => (
              <TouchableOpacity
                key={breed._id}
                style={[
                  styles.breedItem,
                  selectedBreeds.find(b => b._id === breed._id) && styles.selectedBreedItem,
                ]}
                onPress={() => toggleBreedSelection(breed)}
              >
                <Text style={styles.breedText}>{breed.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
});

export default BreedTypeScreen;