//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../components/common/BottomNavigation';
import CatPawLoader from '../components/CatPawLoader';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import { fetchAnimalsStart, fetchAnimalsSuccess, fetchAnimalsFailure } from '../redux/slices/animalsSlice';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { RootState } from '../redux/types';
import { useTheme } from '../context/ThemeContext';

const PetListScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.petType || 'Dogs');
  const dispatch = useDispatch();
  const { colors } = useTheme();

  // Get data from Redux store
  const petTypesState = useSelector((state: RootState) => state.petTypes);
  const animalsState = useSelector((state: RootState) => state.animals);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  // Add a state to store all animals
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectedPetType, setSelectedPetType] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await fetchAnimals();
    };

    loadData();
  }, []);

  const fetchAnimals = async () => {
    dispatch(fetchAnimalsStart());
    setIsLoading(true);
    try {
      const token = await getToken();
      
      const response = await api.post('/animals/search', 
        {
          search: searchQuery,
          size: "",
          age: "",
          gender: "",
          page: 1,
          limit: 100,
          breedType: "",
          petType: ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.data) {
        throw new Error('Empty response received');
      }
      
      const data = response.data;
      console.log('Response data:', data);
      
      dispatch(fetchAnimalsSuccess({
        data: data.data || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 100
      }));
      
      filterAnimalsByPetType(route.params?.petType || selectedCategory);
    } catch (error) {
      console.error('Error fetching animals:', error);
      dispatch(fetchAnimalsFailure('Failed to fetch animals'));
    } finally {
      setIsLoading(false);
    }
  };

  const filterAnimalsByPetType = (petTypeName) => {
    setSelectedPetType(petTypeName);
    
    if (!petTypeName || petTypeName === '') {
      setFilteredAnimals(animalsState.animals);
      return;
    }
    
    const selectedPetTypeObj = petTypesState.petTypes.find(
      (pt) => pt.name === petTypeName
    );
    
    if (!selectedPetTypeObj) {
      setFilteredAnimals([]);
      return;
    }
    
    const filtered = animalsState.animals.filter(
      (animal) => animal.petType && animal.petType._id === selectedPetTypeObj._id
    );
    
    setFilteredAnimals(filtered);
  };

  useEffect(() => {
    filterAnimalsByPetType(selectedPetType);
  }, [animalsState.animals, selectedPetType]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedPetType(category);
    filterAnimalsByPetType(category);
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetchAnimals();
  };

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

  const renderPetCard = ({ item }: any) => {
    const isFavorited = favorites.some(fav => fav.id === item._id);
    return (
      <TouchableOpacity 
        style={[styles.petCard, { backgroundColor: colors.card, shadowColor: colors.text }]}
        onPress={() => navigation.navigate('PetDetails', { petId: item._id })}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: `${item.images?.[0]}`}} 
            style={styles.petImage} 
          />
          <TouchableOpacity 
            style={[styles.favoriteIcon, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
            onPress={() => handleToggleFavorite(item)}
          >
            <Ionicons 
              name={isFavorited ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorited ? "#FF6F61" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.petInfoRow}>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={16} color="#FF6F61" />
            <Text style={[styles.distanceText, { color: colors.secondaryText }]}>{item.kms?.toFixed(1) || '1.2'} km</Text>
          </View>
          <Text style={[styles.breedText, { color: colors.secondaryText }]}>{item.breedType?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.searchHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.searchTitle, { color: colors.text }]}>Search Results</Text>
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={petTypesState.petTypes.length > 0 ? petTypesState.petTypes : ['Dogs', 'Cats', 'Rabbits', 'Birds']}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === (item.name || item) && [styles.selectedCategory, { backgroundColor: colors.primary }]
              ]}
              onPress={() => handleCategorySelect(item.name || item)}
            >
              {item.icon && <Image source={{ uri: item.icon }} style={styles.categoryIcon} />}
              <Text 
                style={[
                  styles.categoryText, 
                  selectedCategory === (item.name || item) && styles.selectedCategoryText
                ]}
              >
                {item.name || item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Pet List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <CatPawLoader />
        </View>
      ) : (
        <FlatList
          data={filteredAnimals}
          keyExtractor={(item) => item._id?.toString() || `pet-${Math.random()}`}
          renderItem={renderPetCard}
          numColumns={2}
          contentContainerStyle={styles.petListContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>No pets found</Text>
            </View>
          }
        />
      )}

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryContainer: {
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FF6F61',
  },
  selectedCategory: {
    backgroundColor: '#FF6F61',
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  petListContainer: {
    padding: 8,
  },
  petCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    padding: 6,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 12,
  },
  petInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  breedText: {
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PetListScreen;
