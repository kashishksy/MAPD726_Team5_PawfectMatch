import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/dashboard/Header';
import AdoptionBanner from '../components/dashboard/AdoptionBanner';
import PetCategories from '../components/dashboard/PetCategories';
import NearbyPets from '../components/dashboard/NearbyPets';
import PreferencePets from '../components/dashboard/PreferencePets';
import BottomNavigation from '../components/common/BottomNavigation';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import CatPawLoader from '../components/CatPawLoader';

const DashboardScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <CatPawLoader />;
  }

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default DashboardScreen;
