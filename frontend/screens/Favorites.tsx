import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { RootState } from '../redux/types';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';

const Favorites = ({ navigation }: any) => {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const handleRemoveFromFavorites = (item: any) => {
    dispatch(toggleFavorite(item));
  };

  const handleBack = () => {
    navigation.navigate('Dashboard');
  };

  const handlePetPress = (petId: string) => {
    navigation.navigate('PetDetails', { petId });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.petCard, { backgroundColor: colors.card }]}
      onPress={() => handlePetPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: `${item.images?.[0]}` }} 
          style={styles.petImage} 
        />
        <TouchableOpacity 
          style={[styles.favoriteIcon, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onPress
            handleRemoveFromFavorites(item);
          }}
        >
          <Ionicons name="heart" size={24} color="#FF6F61" />
        </TouchableOpacity>
      </View>
      <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
      <View style={styles.infoContainer}>
        <FontAwesome6 name="location-dot" size={12} color="#F4A460" />
        <Text style={[styles.petInfo, { color: colors.secondaryText }]}>
          {item.breedType?.name} • {item.kms?.toFixed(1) || '?'} km
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mainContainer}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No favorites yet</Text>
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
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listContainer: {
    padding: 8,
  },
  petCard: {
    flex: 1,
    margin: 8,
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
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Favorites;