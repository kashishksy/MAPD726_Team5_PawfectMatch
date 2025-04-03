import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const PetCategories = ({ navigation }: any) => {
  const { petTypes, loading, error } = useSelector((state: any) => state.petTypes);
  const { colors } = useTheme();

  const handleCategoryPress = (petType: string) => {
    // Navigate to pet type specific screen
    navigation.navigate('PetList', { petType });
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

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {petTypes.map((category: any) => (
          <TouchableOpacity 
            key={category._id} 
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category._id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
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