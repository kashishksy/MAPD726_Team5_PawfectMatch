import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import MapView, { Circle, Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../components/common/BottomNavigation';
import { useDispatch, useSelector } from 'react-redux';
 
interface MapScreenProps {
  navigation: NavigationProp<any>;
}

const MapScreen = ({ navigation }: MapScreenProps) => {
  const [radius, setRadius] = useState(5);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const dispatch = useDispatch();
  const { animals } = useSelector((state: any) => state.animals);
  const initialRegion = {
    latitude: 43.6426, // CN Tower latitude
    longitude: -79.3871, // CN Tower longitude
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
 
  // Available radius options in kilometers
  const radiusOptions = [1, 2, 5, 10, 20, 50];
 
  const handleRadiusSelect = (selectedRadius: number) => {
    setRadius(selectedRadius);
    setShowRadiusModal(false);
  };
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="paw" size={24} color="#FF6F61" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maps</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
 
      {/* Radius Selector */}
      <TouchableOpacity 
        style={styles.radiusSelector}
        onPress={() => setShowRadiusModal(true)}
      >
        <Ionicons name="location" size={20} color="#000" />
        <Text style={styles.radiusText}>{radius} km</Text>
        <Ionicons name="chevron-down" size={20} color="#000" />
      </TouchableOpacity>
 
      {/* Radius Selection Modal */}
      <Modal
        visible={showRadiusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRadiusModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRadiusModal(false)}
        >
          <View style={styles.modalContent}>
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.radiusOption,
                  radius === option && styles.selectedRadius
                ]}
                onPress={() => handleRadiusSelect(option)}
              >
                <Text style={[
                  styles.radiusOptionText,
                  radius === option && styles.selectedRadiusText
                ]}>
                  {option} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
 
      {/* Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Circle
          center={initialRegion}
          radius={radius * 1000} // Convert km to meters
          fillColor="rgba(235, 49, 12, 0.2)"
          strokeColor="#FF6F61"
          strokeWidth={1}
        />
        {animals.map((pet: any) => (
          <Marker
            key={pet._id}
            coordinate={{ latitude: pet.location.lat, longitude: pet.location.lng }}
            title={pet.name}  
            onCalloutPress={() => navigation.navigate('PetDetails', { petId: pet._id })}
            style={{ width: 40, height: 40, borderRadius: 25}}
          >
            <Image
              source={{ uri: pet.images[0] }}
              style={{ width: 40, height: 40, borderRadius: 25, borderColor: '#FF6F61', borderWidth: 2 }}
            />
    
          </Marker>
        ))}
      </MapView>
        
      {/* Bottom Navigation */}
      <BottomNavigation/>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  radiusSelector: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  radiusText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#FF6F61',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  radiusOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedRadius: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
  },
  radiusOptionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  selectedRadiusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
 
export default MapScreen; 