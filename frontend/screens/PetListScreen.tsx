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

const PetListScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Cats');
  const dispatch = useDispatch();

  // Get data from Redux store
  const petTypesState = useSelector((state: any) => state.petTypes);
  const animalsState = useSelector((state: any) => state.animals);

  // Add a state to store all animals
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectedPetType, setSelectedPetType] = useState('');

  // Add favorites state at component level
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

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
      
      // Fetch all animals without filtering by pet type
      const response = await api.post('/animals/search', 
        {
          search: searchQuery,
          size: "",
          age: "",
          gender: "",
          page: 1,
          limit: 100, // Increase limit to get more animals
          breedType: "",
          petType: "" // Empty to get all pet types
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
      
      // Store all animals in Redux
      dispatch(fetchAnimalsSuccess({
        data: data.data || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 100
      }));
      
      // Apply initial filtering
      filterAnimalsByPetType('');
    } catch (error) {
      console.error('Error fetching animals:', error);
      dispatch(fetchAnimalsFailure('Failed to fetch animals'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to filter animals by pet type
  const filterAnimalsByPetType = (petTypeName) => {
    setSelectedPetType(petTypeName);
    
    if (!petTypeName || petTypeName === '') {
      // If no pet type is selected, show all animals
      setFilteredAnimals(animalsState.animals);
      return;
    }
    
    // Find the pet type ID from the Redux store
    const selectedPetTypeObj = petTypesState.petTypes.find(
      (pt) => pt.name === petTypeName
    );
    
    if (!selectedPetTypeObj) {
      setFilteredAnimals([]);
      return;
    }
    
    // Filter animals by the selected pet type ID
    const filtered = animalsState.animals.filter(
      (animal) => animal.petType && animal.petType._id === selectedPetTypeObj._id
    );
    
    setFilteredAnimals(filtered);
  };

  // Update your useEffect to call filterAnimalsByPetType when animals or selected pet type changes
  useEffect(() => {
    filterAnimalsByPetType(selectedPetType);
  }, [animalsState.animals, selectedPetType]);

  // Update your category selection handler
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedPetType(category);
    filterAnimalsByPetType(category);
  };

  const handleSearch = () => {
    setIsLoading(true);
    fetchAnimals();
  };

  const toggleFavorite = (petId: string, event: any) => {
    event.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [petId]: !prev[petId]
    }));
    console.log(`Toggling favorite for pet ID: ${petId}`);
  };

  const renderPetCard = ({ item }: any) => {
    return (
      <TouchableOpacity 
        style={styles.petCard}
        onPress={() => navigation.navigate('PetDetails', { petId: item._id })}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: `https://res.cloudinary.com/dkcerk04u/image/upload/v1741239639/${item.images?.[0]}`}} 
            style={styles.petImage} 
          />
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={(event) => toggleFavorite(item._id, event)}
          >
            <Ionicons 
              name={favorites[item._id] ? "heart" : "heart-outline"} 
              size={24} 
              color={favorites[item._id] ? "#FF9D42" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.petName}>{item.name}</Text>
        <View style={styles.petInfoRow}>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={16} color="#FF9D42" />
            <Text style={styles.distanceText}>{item.kms?.toFixed(1) || '1.2'} km</Text>
          </View>
          <Text style={styles.breedText}>{item.breedType?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.searchTitle}>Search Results</Text>
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="search" size={24} color="black" />
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
                selectedCategory === (item.name || item) && styles.selectedCategory
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
              <Text style={styles.emptyText}>No pets found</Text>
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
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    backgroundColor: '#F5F5F5',
  },
  selectedCategory: {
    backgroundColor: '#FF9D42',
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 157, 66, 0.8)',
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
    color: '#666',
    marginLeft: 4,
  },
  breedText: {
    fontSize: 12,
    color: '#666',
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
    color: '#666',
  },
});

export default PetListScreen; 