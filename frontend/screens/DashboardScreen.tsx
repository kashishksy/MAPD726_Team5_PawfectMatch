import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/dashboard/Header';
import AdoptionBanner from '../components/dashboard/AdoptionBanner';
import PetCategories from '../components/dashboard/PetCategories';
import NearbyPets from '../components/dashboard/NearbyPets';
import PreferencePets from '../components/dashboard/PreferencePets';
import BottomNavigation from '../components/common/BottomNavigation';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import CatPawLoader from '../components/CatPawLoader';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import { fetchPetTypesStart, fetchPetTypesSuccess, fetchPetTypesFailure } from '../redux/slices/petTypesSlice';
import { fetchAnimalsStart, fetchAnimalsSuccess, fetchAnimalsFailure } from '../redux/slices/animalsSlice';

const DashboardScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Accessing the Redux store
  const auth = useSelector((state: any) => state.auth);
  const registration = useSelector((state: any) => state.registration);
  const walkthrough = useSelector((state: any) => state.walkthrough);
  const petTypesState = useSelector((state: any) => state.petTypes);
  const animalsState = useSelector((state: any) => state.animals);

  useEffect(() => {
    // Log the Redux store data
    console.log('Auth State:', auth);
    console.log('Registration State:', registration);
    console.log('Walkthrough State:', walkthrough);
    console.log('Pet Types State:', petTypesState);
    console.log('Animals State:', animalsState);

    const loadData = async () => {
      // Fetch pet types if not already loaded
      if (petTypesState.petTypes.length === 0 && !petTypesState.loading) {
        await fetchPetTypes();
      }

      // Fetch all animals for nearby section
      // if (animalsState.animals.length === 0 && !animalsState.loading) {
      //   await fetchAnimals();
      // }
      await fetchAnimals();

      setIsLoading(false);
    };

    loadData();
  }, []);

  const fetchPetTypes = async () => {
    dispatch(fetchPetTypesStart());
    try {
      const token = await getToken();
      const response = await api.get('/pets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      dispatch(fetchPetTypesSuccess(data.data));
    } catch (error) {
      console.error('Error fetching pet types:', error);
      dispatch(fetchPetTypesFailure('Failed to fetch pet types'));
    }
  };

  const fetchAnimals = async () => {
    dispatch(fetchAnimalsStart());
    try {
      const token = await getToken();
      const response = await api.post('/animals/search', 
        {
          search: "",
          size: "",
          age: "",
          gender: "",
          page: 1,
          limit: 20,
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
      const data = response.data;
      dispatch(fetchAnimalsSuccess({
        data: data.data,
        total: data.total,
        page: data.page,
        limit: data.limit
      }));
      console.log('Animals data received:', data);
    } catch (error) {
      console.error('Error fetching animals:', error);
      dispatch(fetchAnimalsFailure('Failed to fetch animals'));
    }
  };


  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AdoptionBanner />
        <PetCategories />
        <NearbyPets />
        <PreferencePets />
      </ScrollView>
      <BottomNavigation />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <CatPawLoader />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
  },
});

export default DashboardScreen;
