//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import CatPawLoader from '../components/CatPawLoader';

const { width } = Dimensions.get('window');

const PetDetailsScreen = ({ route, navigation }) => {
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPetDetails();
  }, []);

  const fetchPetDetails = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/animals/${route.params.petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPet(response.data.data);
      setIsFavorite(response.data.data.isFavorite || false);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically make an API call to update the favorite status
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <CatPawLoader />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          {pet?.images && (
            <Image
              source={{ uri: `https://res.cloudinary.com/dkcerk04u/image/upload/v1741239639/${pet.images[currentImageIndex]}` }}
              style={styles.petImage}
            />
          )}
          <Text style={styles.imageCounter}>{`${currentImageIndex + 1}/${pet?.images?.length || 1}`}</Text>
        </View>

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.petName}>
              {pet?.name} <Text style={styles.breedName}>({pet?.breedType?.name})</Text>
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#FF9D42" />
              <Text style={styles.distance}>{pet?.kms?.toFixed(1) || '1.2'} km</Text>
            </View>
          </View>

          {/* Characteristics */}
          <View style={styles.characteristicsContainer}>
            <View style={styles.characteristicBox}>
              <Text style={styles.characteristicLabel}>Gender</Text>
              <Text style={styles.characteristicValue}>{pet?.gender}</Text>
            </View>
            <View style={styles.characteristicBox}>
              <Text style={styles.characteristicLabel}>Age</Text>
              <Text style={styles.characteristicValue}>{pet?.age}</Text>
            </View>
            <View style={styles.characteristicBox}>
              <Text style={styles.characteristicLabel}>Size</Text>
              <Text style={styles.characteristicValue}>{pet?.size}</Text>
            </View>
          </View>

          {/* Shelter Info */}
          <TouchableOpacity 
            style={styles.shelterContainer}
            onPress={() => navigation.navigate('OwnerOrganizationDetails', { 
              organizationId: pet?.organizationId 
            })}
          >
            <View style={styles.shelterIconContainer}>
              <Ionicons name="home-outline" size={24} color="#FF9D42" />
            </View>
            <View style={styles.shelterInfo}>
              <Text style={styles.shelterName}>{pet?.organizationName || 'Happy Tails Animal Rescue'}</Text>
              <Text style={styles.shelterAddress}>{pet?.city}, {pet?.state}</Text>
            </View>
            <TouchableOpacity style={styles.directionButton}>
              <Ionicons name="navigate-outline" size={24} color="#FF9D42" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {pet?.name}</Text>
            <Text style={styles.description}>{pet?.description}</Text>
          </View>

          {/* Personality Traits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personality Traits</Text>
            <Text style={styles.description}>
              {pet?.name} is a loving and playful companion who enjoys cuddles and playtime.
              They are well-behaved and get along great with other pets.
            </Text>
          </View>

          {/* Adoption Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adoption Information</Text>
            <Text style={styles.description}>
              To inquire about adopting {pet?.name}, please contact Happy Tails Animal Rescue.
              The adoption process includes a meet-and-greet to ensure a perfect fit.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF9D42" : "#000"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.adoptButton}>
          <Text style={styles.adoptButtonText}>Adopt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 16,
  },
  imageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    color: '#FFFFFF',
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  petName: {
    fontSize: 24,
    fontWeight: '600',
  },
  breedName: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
    color: '#666',
  },
  characteristicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  characteristicBox: {
    flex: 1,
    backgroundColor: '#FFF5F0',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  characteristicLabel: {
    color: '#666',
    marginBottom: 4,
  },
  characteristicValue: {
    fontWeight: '600',
  },
  shelterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  shelterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shelterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  shelterName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  shelterAddress: {
    color: '#666',
    fontSize: 12,
  },
  directionButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  adoptButton: {
    flex: 1,
    backgroundColor: '#FF6F61',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  adoptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetDetailsScreen; 