import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/dashboard/Header';
import AdoptionBanner from '../components/dashboard/AdoptionBanner';
import PetCategories from '../components/dashboard/PetCategories';
import NearbyPets from '../components/dashboard/NearbyPets';
import PreferencePets from '../components/dashboard/PreferencePets';
import BottomNavigation from '../components/common/BottomNavigation';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AdoptionBanner />
        <PetCategories />
        <NearbyPets />
        <PreferencePets />
      </ScrollView>
      <BottomNavigation/>
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