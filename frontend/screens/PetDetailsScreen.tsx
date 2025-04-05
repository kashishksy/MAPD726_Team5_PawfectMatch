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
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import CatPawLoader from '../components/CatPawLoader';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { useTheme } from '../context/ThemeContext';
import { startPetChat } from '../services/chatService';

const { width } = Dimensions.get('window');

const stripHtmlTags = (html: string) => {
  return html?.replace(/<[^>]*>/g, '') || '';
};

const PetDetailsScreen = ({ route, navigation }: any) => {
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChatStarting, setIsChatStarting] = useState(false);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const favorites = useSelector((state) => state.favorites.items);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    fetchPetDetails();
  }, []);
  
  // Check if pet is in favorites when favorites or pet change
  useEffect(() => {
    if (pet && favorites) {
      const isFav = favorites.some(fav => fav.id === pet._id);
      setIsFavorite(isFav);
    }
  }, [favorites, pet]);

  const fetchPetDetails = async () => {
    try {
      const token = await getToken();
      const response = await api.get(`/animals/${route.params.petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Pet details response:', response.data.data);
      setPet(response.data.data);
      setIsFavorite(response.data.data.isFavorite || false);
    } catch (error) {
      console.error('Error fetching pet details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavoriteHandler = () => {
    if (pet) {
      dispatch(toggleFavorite({
        id: pet._id,
        title: pet.name,
        description: pet.breedType?.name || 'Unknown breed',
        images: pet.images,
        name: pet.name,
        breedType: pet.breedType,
        kms: pet.kms
      }));
      setIsFavorite(!isFavorite);
    }
  };

  const handleStartChat = async () => {
    if (!userData || !userData.userId) {
      Alert.alert('Login Required', 'Please login to message the shelter');
      return;
    }

    try {
      setIsChatStarting(true);
      
      // Create or get chat ID using pet and owner data
      const chatId = await startPetChat(
        userData.userId,
        pet.owner._id,
        userData,
        {
          id: pet._id,
          name: pet.name,
          images: pet.images,
          ownerName: pet.owner.fullName
        }
      );
      
      // Navigate to chat detail screen
      navigation.navigate('ChatDetail', {
        chatId,
        shelterName: pet.owner.fullName,
        chatData: {
          petInfo: {
            id: pet._id,
            name: pet.name,
            image: pet.images[0],
          },
          ownerId: pet.owner._id
        }
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat. Please try again.');
    } finally {
      setIsChatStarting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <CatPawLoader />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pet Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          {pet?.images && (
            <Image
              source={{ uri: `${pet.images[0]}` }}
              style={styles.petImage}
            />
          )}
          <Text style={styles.imageCounter}>{`${currentImageIndex + 1}/${pet?.images?.length || 1}`}</Text>
        </View>

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={[styles.petName, { color: colors.text }]}>
              {pet?.name} <Text style={[styles.breedName, { color: colors.secondaryText }]}>({pet?.breedType?.name})</Text>
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#FF9D42" />
              <Text style={[styles.distance, { color: colors.secondaryText }]}>{pet?.kms?.toFixed(1) || '1.2'} km</Text>
            </View>
          </View>

          {/* Characteristics */}
          <View style={styles.characteristicsContainer}>
            <View style={[styles.characteristicBox, { backgroundColor: colors.cardLight }]}>
              <Text style={[styles.characteristicLabel, { color: colors.secondaryText }]}>Gender</Text>
              <Text style={[styles.characteristicValue, { color: colors.text }]}>{pet?.gender}</Text>
            </View>
            <View style={[styles.characteristicBox, { backgroundColor: colors.cardLight }]}>
              <Text style={[styles.characteristicLabel, { color: colors.secondaryText }]}>Age</Text>
              <Text style={[styles.characteristicValue, { color: colors.text }]}>{pet?.age}</Text>
            </View>
            <View style={[styles.characteristicBox, { backgroundColor: colors.cardLight }]}>
              <Text style={[styles.characteristicLabel, { color: colors.secondaryText }]}>Size</Text>
              <Text style={[styles.characteristicValue, { color: colors.text }]}>{pet?.size}</Text>
            </View>
          </View>

          {/* Shelter Info */}
          <TouchableOpacity 
            style={[styles.shelterContainer, { backgroundColor: colors.cardLight }]}
            onPress={() => navigation.navigate('OwnerOrganizationDetails', { 
              ownerData: pet?.owner,
              petId: pet?._id,
              address: pet?.address,
              city: pet?.city,
              state: pet?.state,
              country: pet?.country 
            })}
          >
            <View style={[styles.shelterIconContainer, { backgroundColor: colors.cardLight }]}>
              <Ionicons name="home-outline" size={24} color="#FF9D42" />
            </View>
            <View style={styles.shelterInfo}>
              <Text style={[styles.shelterName, { color: colors.text }]}>{pet?.owner.fullName || 'Happy Tails Animal Rescue'}</Text>
              <Text style={[styles.shelterAddress, { color: colors.secondaryText }]}>{pet?.city}, {pet?.state}</Text>
            </View>
            <TouchableOpacity style={styles.directionButton}>
              <Ionicons name="navigate-outline" size={24} color="#FF9D42" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About {pet?.name}</Text>
            <Text style={[styles.description, { color: colors.secondaryText }]}>{stripHtmlTags(pet?.description)}</Text>
          </View>

          {/* Personality Traits */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personality Traits</Text>
            <Text style={[styles.description, { color: colors.secondaryText }]}>
              {pet?.name} is a loving and playful companion who enjoys cuddles and playtime.
              They are well-behaved and get along great with other pets.
            </Text>
          </View>

          {/* Adoption Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Adoption Information</Text>
            <Text style={[styles.description, { color: colors.secondaryText }]}>
              To inquire about adopting {pet?.name}, please contact {pet?.owner.fullName || 'the owner'}.
              The adoption process includes a meet-and-greet to ensure a perfect fit.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.favoriteButton, { borderColor: colors.border }]}
          onPress={toggleFavoriteHandler}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF9D42" : colors.text}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={handleStartChat}
          disabled={isChatStarting}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
          <Text style={styles.messageButtonText}>
            {isChatStarting ? 'Starting...' : 'Message'}
          </Text>
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
    borderBottomWidth: 1,
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
    fontWeight: '400',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  characteristicBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  characteristicLabel: {
    marginBottom: 4,
  },
  characteristicValue: {
    fontWeight: '600',
  },
  shelterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  shelterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    flexDirection: 'row',
    marginRight: 12,
  },
  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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