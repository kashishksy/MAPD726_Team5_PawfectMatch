//@ts-check
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import api from '../../services/api';
import { getToken } from '../../utils/authStorage';

// Define the navigation param list type
type RootStackParamList = {
  PetDetails: { petId: string };
  PetList: { filter: string };
};

const PreferencePets = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [preferenceAnimals, setPreferenceAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useSelector((state: any) => state.auth);

  useEffect(() => {
    fetchPreferenceAnimals();
  }, []);

  const fetchPreferenceAnimals = async () => {
    try {
      const token = await getToken();
      const response = await api.post('/animals/search', 
        {
          search: "",
          size: "",
          age: "",
          gender: "",
          page: 1,
          limit: 5,
          breedType: userData?.breed_ids[0], // Taking first breed preference
          petType: ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Preference Animals:', response.data.data);
      
      setPreferenceAnimals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching preference animals:', error);
      // setError(error as string);
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigation.navigate('PetList', { filter: 'preference' });
  };

  const handlePetPress = (petId: string) => {
    navigation.navigate('PetDetails', { petId: petId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading recommended pets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading recommended pets: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Based on Your Preferences</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {preferenceAnimals.length === 0 ? (
        <Text style={styles.emptyText}>No matching pets found based on your preferences</Text>
      ) : (
        <FlatList
          data={preferenceAnimals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.petCard}
                onPress={() => handlePetPress(item._id)}
            >
              <Image 
                source={{ uri: `https://res.cloudinary.com/dkcerk04u/image/upload/v1741239639/${item.images?.[0]}` }} 
                style={styles.petImage} 
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petBreed}>{item.breedType?.name || 'Unknown breed'}</Text>
                <Text style={styles.petDistance}>{item.kms?.toFixed(1) || '?'} km away</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#FF6F61',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  petCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  petImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  petDistance: {
    fontSize: 12,
    color: '#FF6F61',
    marginTop: 4,
  },
});

export default PreferencePets; 