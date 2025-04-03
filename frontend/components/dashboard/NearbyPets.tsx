//@ts-check
import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { toggleFavorite, setFavorites, loadFavoritesFromStorage } from '../../redux/slices/favoritesSlice';
import { RootState } from '../../redux/types';
import type { Animal } from '../../redux/slices/animalsSlice';
import { useTheme } from '../../context/ThemeContext';

// Define types for navigation
type RootStackParamList = {
  NearbyPets: undefined;
  PetDetails: { petId: string };
};

const NearbyPets = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const { animals, loading, error } = useSelector((state: RootState) => state.animals);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { colors } = useTheme();

  // Load favorites from AsyncStorage when component mounts
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await loadFavoritesFromStorage();
      dispatch(setFavorites(storedFavorites));
    };
    loadFavorites();
  }, [dispatch]);

  // Sort and filter animals by distance
  const nearbyAnimals = animals
    .filter((animal: Animal) => animal.kms !== null && animal.kms !== undefined)
    .sort((a: Animal, b: Animal) => (a.kms || 0) - (b.kms || 0))
    .slice(0, 5);

  console.log('Nearby Animals:', nearbyAnimals.map(animal => ({
    id: animal._id,
    name: animal.name,
    imageUrl: animal.images?.[0] ? `${animal.images[0]}` : 'No image'
  })));

  const handleToggleFavorite = (pet: Animal) => {
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
    navigation.navigate('NearbyPets');
  };

  const handlePetPress = (petId: string) => {
    navigation.navigate('PetDetails', { petId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Loading nearby pets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Error loading nearby pets: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Pets Near You</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      {nearbyAnimals.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No nearby pets found</Text>
      ) : (
        <FlatList
          data={nearbyAnimals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: Animal) => item._id}
          renderItem={({ item }) => {
            const isFavorited = favorites.some(fav => fav.id === item._id);
            return (
              <TouchableOpacity 
                style={[styles.petCard, { 
                  backgroundColor: colors.card,
                  shadowColor: colors.text 
                }]}
                onPress={() => handlePetPress(item._id)}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={{
                      uri: `${item.images[0]}`,
                      cache: 'force-cache'
                    }} 
                    style={styles.petImage}
                    onError={(error) => {
                      console.error('Image loading error for:', item.name);
                      // console.error('Image URL:', `${item.images[0]}`);
                      // console.error('Error details:', error.nativeEvent);
                    }}
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
                  <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.petBreed, { color: colors.secondaryText }]}>
                    {item.breedType?.name || 'Unknown breed'}
                  </Text>
                  <Text style={[styles.petDistance, { color: colors.primary }]}>
                    {item.kms?.toFixed(1) || '?'} km away
                  </Text>
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
  },
  viewAll: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  petCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 8,
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
  },
  petBreed: {
    fontSize: 14,
    marginTop: 4,
  },
  petDistance: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default NearbyPets;