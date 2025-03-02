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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from '../redux/slices/authSlice';
import ProgressBar from '../components/ProgressBar';
import api from '../services/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { storeToken } from '../utils/authStorage';

interface Avatar {
  id: number;
  url: string;
}

const PersonalInfoScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState<Avatar | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const { petType, selectedBreeds, userType } = useSelector((state: any) => state.registration);
  const { phoneNumber, countryCode } = useSelector((state: any) => state.auth);

  // Define specific IDs you want to use
  const avatarIds = [1, 2, 3, 4, 5, 65, 74, 87, 98];
  
  // Generate array of avatar URLs with specific IDs
  const avatars = avatarIds.map(id => ({
    id,
    url: `https://avatar.iran.liara.run/public/${id}`
  }));

  // Preload images
  useEffect(() => {
    avatars.forEach(avatar => {
      Image.prefetch(avatar.url);
    });
  }, []);

  const handleAvatarSelect = (avatar: Avatar) => {
    setProfileImage(avatar);
    setShowAvatarModal(false);
  };

  const handleRegistration = async () => {
    if (!fullName || !gender || !profileImage) {
      Alert.alert('Error', 'Please fill in all fields and select an avatar');
      return;
    }

    try {
      const formData = {
        fullName,
        countryCode,
        mobileNumber: phoneNumber,
        gender,
        userType,
        pet_ids: JSON.stringify([petType]),
        breed_ids: JSON.stringify(selectedBreeds.map((b: any) => b._id)),
        profileImage: profileImage.url // Send URL directly
      };
      console.log(formData);
      const response = await api.post('/auth/register', formData);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      await storeToken(response.data.data.token);
      dispatch(setLoggedIn(true));
      navigation.navigate('Dashboard');

    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error',
        error.response?.data?.message || 'Failed to register. Please try again.'
      );
    }
  };

  const renderAvatarItem = ({ item }: { item: { id: number, url: string } }) => (
    <TouchableOpacity
      style={styles.avatarOption}
      onPress={() => handleAvatarSelect({ id: item.id, url: item.url })}
    >
      <Image 
        source={{ uri: item.url }} 
        style={styles.avatarImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../assets/images/back_icon.png')} style={styles.inputIcon} />
        </TouchableOpacity>
        <ProgressBar currentStep={4} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Final Steps!</Text>
        <Text style={styles.subtitle}>
          We're almost there! Fill in your personal details to create a profile and start your journey towards a furry friendship.
        </Text>

        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image 
              source={profileImage ? { uri: profileImage.url } : require('../assets/images/default_avatar.jpg')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.editImageButton}
              onPress={() => setShowAvatarModal(true)}
            >
              <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#666"
            value={fullName}
            onChangeText={setFullName}
          />
          
          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[
                styles.genderOption,
                gender === 'Male' && styles.selectedGender
              ]}
              onPress={() => setGender('Male')}
            >
              <Text style={[
                styles.genderText,
                gender === 'Male' && styles.selectedGenderText
              ]}>Male</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.genderOption,
                gender === 'Female' && styles.selectedGender
              ]}
              onPress={() => setGender('Female')}
            >
              <Text style={[
                styles.genderText,
                gender === 'Female' && styles.selectedGenderText
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your avatar</Text>
            <FlatList
              data={avatars}
              renderItem={renderAvatarItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.avatarGrid}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={[
          styles.registerButton,
          (!fullName || !gender || !profileImage) && styles.registerButtonDisabled
        ]}
        disabled={!fullName || !gender || !profileImage}
        onPress={handleRegistration}
      >
        <Text style={styles.registerButtonText}>Complete Registration</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: 20,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  selectedGender: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF8F0',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  selectedGenderText: {
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    margin: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
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
    backgroundColor: '#FF6F61',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
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
    borderColor: '#ddd',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalInfoScreen;
