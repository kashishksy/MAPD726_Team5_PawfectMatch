import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const preferencePets = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Chihuahua',
    distance: '1.2 km',
    image: require('../../assets/images/mochi.png'),
  },
  {
    id: 2,
    name: 'Casper',
    breed: 'Maine Coon',
    distance: '1.2 km',
    image: require('../../assets/images/mochi.png'),
  },
  // Add more pets...
];

const PreferencePets = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Based on Your Preferences</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {preferencePets.map((pet) => (
          <TouchableOpacity key={pet.id} style={styles.petCard}>
            <Image source={pet.image} style={styles.petImage} />
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petInfo}>{pet.distance} • {pet.breed}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  viewAll: {
    fontSize: 14,
    color: '#F4A460',
  },
  scrollView: {
    flexDirection: 'row',
  },
  petCard: {
    marginRight: 16,
    width: 150,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  petName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  petInfo: {
    fontSize: 12,
    color: '#666666',
  },
});

export default PreferencePets; 