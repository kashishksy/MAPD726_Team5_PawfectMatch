import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define the navigation param list type
type RootStackParamList = {
  PetList: { petType: string };
  // Add other screens as needed
};

const petTypes = [
  { id: 'dogs', name: 'Dogs', emoji: '🐕' },
  { id: 'cats', name: 'Cats', emoji: '🐈' },
  { id: 'rabbits', name: 'Rabbits', emoji: '🐰' },
  { id: 'birds', name: 'Birds', emoji: '🦜' },
  { id: 'reptiles', name: 'Reptiles', emoji: '🦎' },
  { id: 'fish', name: 'Fish', emoji: '🐠' },
  { id: 'primates', name: 'Primates', emoji: '🐒' },
  { id: 'other', name: 'Other', emoji: '🐾' },
];

const PetCategories = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleCategoryPress = (petType: string) => {
    // Navigate to pet type specific screen
    navigation.navigate('PetList', { petType });
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {petTypes.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{category.emoji}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryItem: {
    width: '20%', // Slightly adjusted to fit 4 items per row with gap
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emoji: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default PetCategories; 