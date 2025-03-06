import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const NearbyPets = () => {
  const navigation = useNavigation();
  const { animals, loading, error } = useSelector((state: any) => state.animals);

  // Sort animals by distance (kms)
  const nearbyAnimals = [...animals]
    .filter(animal => animal.kms !== null && animal.kms !== undefined) // Filter out animals without distance
    .sort((a, b) => (a.kms || 0) - (b.kms || 0)) // Sort by distance
    .slice(0, 5); // Take only the first 5

  const handleViewAll = () => {
    // navigation.navigate('PetList', { filter: 'nearby' });
  };

  const handlePetPress = (petId: string) => {
    // navigation.navigate('PetDetails', { id: petId });
  };

  
  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading nearby pets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error loading nearby pets: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pets Near You</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {nearbyAnimals.length === 0 ? (
        <Text style={styles.emptyText}>No nearby pets found</Text>
      ) : (
        <FlatList
          data={nearbyAnimals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.petCard}
              onPress={() => handlePetPress(item._id)}
            >
              <Image 
                     source={{uri:`https://res.cloudinary.com/dkcerk04u/image/upload/v1741239639/${item.images?.[0]}`}} 
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
    padding: 18,
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
    resizeMode: 'cover',
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

export default NearbyPets; 