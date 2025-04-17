import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const PetCategories = ({ navigation }: any) => {
  const { petTypes, loading, error } = useSelector((state: any) => state.petTypes);
  const { colors, theme } = useTheme();

  const handleCategoryPress = (petType: string) => {
    // Navigate to pet type specific screen
    navigation.navigate('PetListScreen', {petType });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Loading pet types...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Error loading pet types: {error}</Text>
      </View>
    );
  }

  // Define background color based on theme
  const iconBackgroundColor = theme === 'dark' ? 
    colors.card : // Use existing dark mode color
    '#F0F0F0';    // Light grey for light mode

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {petTypes.map((category: any) => (
          <TouchableOpacity 
            key={category._id} 
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.name)}
          >
            <View style={[
              styles.iconContainer, 
              { backgroundColor: iconBackgroundColor }
            ]}>
              <Text style={styles.emoji}>{category.emoji}</Text>
            </View>
            <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
          </TouchableOpacity>
        )).slice(0, 8)}
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
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  emoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PetCategories; 