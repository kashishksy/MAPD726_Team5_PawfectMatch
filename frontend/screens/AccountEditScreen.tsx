import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import { setUserData } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

interface Avatar {
  id: number;
  url: string;
}

const AccountEditScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth.userData);
  const { colors } = useTheme();
  
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<Avatar | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  // Define specific IDs you want to use
  const avatarIds = [1, 2, 3, 4, 5, 65, 74, 87, 98];
  
  // Generate array of avatar URLs with specific IDs
  const avatars = avatarIds.map(id => ({
    id,
    url: `https://avatar.iran.liara.run/public/${id}`
  }));

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsFetchingProfile(true);
    try {
      const token = await getToken();
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      const profileData = response.data.data;
      setFullName(profileData.fullName);
      setGender(profileData.gender);
      
      if (profileData.profile_pic_url) {
        // If the profile image is from the avatar service
        if (profileData.profile_pic_url.includes('avatar.iran.liara.run')) {
          const id = parseInt(profileData.profile_pic_url.split('/').pop() || '1');
          setProfileImage({ id, url: profileData.profile_pic_url });
        } else {
          // For custom uploaded images
          setProfileImage({ id: 0, url: profileData.profile_pic_url });
        }
      }
      
      // Update Redux store with the profile data
      dispatch(setUserData(profileData));
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setProfileImage(avatar);
    setShowAvatarModal(false);
  };

  const handleSaveProfile = async () => {
    if (!fullName || !gender || !profileImage) {
      Alert.alert('Error', 'Please fill in all fields and select an avatar');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      
      const formData = {
        fullName,
        gender,
        profileImage: profileImage.url // Send URL directly
      };
      
      const response = await api.post('/auth/profile/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      // Update Redux store with the updated profile data
      dispatch(setUserData(response.data.data));
      
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert(
        'Update Error',
        error.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderAvatarItem = ({ item }: { item: Avatar }) => (
    <TouchableOpacity
      style={[styles.avatarOption, { borderColor: colors.border }]}
      onPress={() => handleAvatarSelect(item)}
    >
      <Image 
        source={{ uri: item.url }} 
        style={styles.avatarImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (isFetchingProfile) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image 
              source={profileImage ? { uri: profileImage.url } : require('../assets/images/default_avatar.jpg')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={[styles.editImageButton, { 
                backgroundColor: colors.primary, 
                borderColor: colors.background 
              }]}
              onPress={() => setShowAvatarModal(true)}
            >
              <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { 
              borderColor: colors.border, 
              color: colors.text, 
              backgroundColor: colors.inputBackground 
            }]}
            placeholder="Full Name"
            placeholderTextColor={colors.placeholder}
            value={fullName}
            onChangeText={setFullName}
          />
          
          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[
                styles.genderOption,
                { borderColor: colors.border, backgroundColor: colors.inputBackground },
                gender === 'Male' && [styles.selectedGender, { 
                  borderColor: colors.primary, 
                  backgroundColor: colors.selectedBackground 
                }]
              ]}
              onPress={() => setGender('Male')}
            >
              <Text style={[
                styles.genderText,
                { color: colors.secondaryText },
                gender === 'Male' && [styles.selectedGenderText, { color: colors.primary }]
              ]}>Male</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.genderOption,
                { borderColor: colors.border, backgroundColor: colors.inputBackground },
                gender === 'Female' && [styles.selectedGender, { 
                  borderColor: colors.primary, 
                  backgroundColor: colors.selectedBackground 
                }]
              ]}
              onPress={() => setGender('Female')}
            >
              <Text style={[
                styles.genderText,
                { color: colors.secondaryText },
                gender === 'Female' && [styles.selectedGenderText, { color: colors.primary }]
              ]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalContent }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose your avatar</Text>
            <FlatList
              data={avatars}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.avatarGrid}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={[
          styles.saveButton,
          { backgroundColor: colors.primary },
          (isLoading || !fullName || !gender || !profileImage) && 
            [styles.saveButtonDisabled, { backgroundColor: colors.disabledButton }]
        ]}
        disabled={isLoading || !fullName || !gender || !profileImage}
        onPress={handleSaveProfile}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40, // To center the title
  },
  content: {
    padding: 24,
    flex: 1,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  selectedGender: {
    borderWidth: 1,
  },
  genderText: {
    fontSize: 16,
  },
  selectedGenderText: {
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    margin: 24,
    alignItems: 'center',
  },
  saveButtonDisabled: {},
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    paddingVertical: 10,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountEditScreen; 