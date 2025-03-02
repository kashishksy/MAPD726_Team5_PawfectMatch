import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/dashboard/Header';
import AdoptionBanner from '../components/dashboard/AdoptionBanner';
import PetCategories from '../components/dashboard/PetCategories';
import NearbyPets from '../components/dashboard/NearbyPets';
import PreferencePets from '../components/dashboard/PreferencePets';
import BottomNavigation from '../components/common/BottomNavigation';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import { RootStackParamList } from '../navigation/AppNavigator'; // Ensure this is correctly defined

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Correctly typed navigation object

  return (
    <View style={styles.container}>
      <Header navigation={navigation} /> {/* Pass the navigation object */}
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
