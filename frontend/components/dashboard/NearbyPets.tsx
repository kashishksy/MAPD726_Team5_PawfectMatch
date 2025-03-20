import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { RootState } from '../../redux/types';

const NearbyPets = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { animals, loading, error } = useSelector((state: RootState) => state.animals);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  // Sort and filter animals by distance
  const nearbyAnimals = [...animals]
    .filter(animal => animal.kms !== null && animal.kms !== undefined)
    .sort((a, b) => (a.kms || 0) - (b.kms || 0))
    .slice(0, 5);

  const handleToggleFavorite = (pet: any) => {
    dispatch(toggleFavorite({
      id: pet._id,
      title: pet.name,
      description: pet.breedType?.name || 'Unknown breed',
      images: pet.images,
      name: pet.name,
      breedType: pet.breedType,
      kms: pet.kms
    }));
  };

  const handleViewAll = () => {
    //navigation.navigate('NearbyPets');
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
          renderItem={({ item }) => {
            const isFavorited = favorites.some(fav => fav.id === item._id);
            return (
              <TouchableOpacity 
                style={styles.petCard}
                onPress={() => handlePetPress(item._id)}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={{uri:`https://res.cloudinary.com/dkcerk04u/image/upload/v1741239639/${item.images?.[0]}`}} 
                    style={styles.petImage} 
                  />
                  <TouchableOpacity 
                    style={styles.favoriteIcon} 
                    onPress={() => handleToggleFavorite(item)}
                  >
                    <Ionicons 
                      name={isFavorited ? 'heart' : 'heart-outline'} 
                      size={24} 
                      color={isFavorited ? '#FF6F61' : '#fff'} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text style={styles.petBreed}>{item.breedType?.name || 'Unknown breed'}</Text>
                  <Text style={styles.petDistance}>{item.kms?.toFixed(1) || '?'} km away</Text>
                </View>
              </TouchableOpacity>
            );
          }}
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
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
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