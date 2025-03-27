import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import store from '../redux/store';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { RootState } from '../redux/types';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNavigation from '../components/common/BottomNavigation';

const Favorites = ({ navigation }: any) => {
  const favorites = useSelector((store: RootState) => store.favorites.items);
  const dispatch = useDispatch();

  const handleRemoveFromFavorites = (item: any) => {
    dispatch(toggleFavorite(item));
  };

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.petCard}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: `${item.images?.[0]}` }} 
          style={styles.petImage} 
        />
        <TouchableOpacity 
          style={styles.favoriteIcon} 
          onPress={() => handleRemoveFromFavorites(item)}
        >
          <Ionicons name="heart" size={24} color="#FF6F61" />
        </TouchableOpacity>
      </View>
      <Text style={styles.petName}>{item.name}</Text>
      <View style={styles.infoContainer}>
        <FontAwesome6 name="location-dot" size={12} color="#F4A460" />
        <Text style={styles.petInfo}>{item.breedType?.name} • {item.kms?.toFixed(1) || '?'} km</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Image 
              source={require('../assets/images/back_icon.png')} 
              style={styles.inputIcon} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>Favorites</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorites yet</Text>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  listContainer: {
    padding: 8,
  },
  petCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  petInfo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default Favorites;