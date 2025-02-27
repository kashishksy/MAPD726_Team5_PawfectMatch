import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from '../redux/slices/authSlice';
import ProgressBar from '../components/ProgressBar';
import api from '../services/api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PersonalInfoScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const userType = 'Pet Adopter'; // Since this is for adoption app
  const [profileImage, setProfileImage] = useState(null);

  const { petType, selectedBreeds } = useSelector((state: any) => state.registration);
  const { phoneNumber, countryCode } = useSelector((state: any) => state.auth);

  const handleRegistration = async () => {
    if (!fullName || !gender) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Prepare registration data
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('countryCode', countryCode);
      formData.append('mobileNumber', phoneNumber);
      formData.append('gender', gender);
      formData.append('userType', userType);
      formData.append('pet_ids', JSON.stringify([petType]));
      formData.append('breed_ids', JSON.stringify(selectedBreeds.map((b: any) => b._id)));

      console.log('Submitting registration with data:', {
        fullName,
        countryCode,
        phoneNumber,
        gender,
        userType,
        pet_ids: [petType],
        breed_ids: selectedBreeds.map((b: any) => b._id)
      });

      // Make registration API call
      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      console.log('Registration successful:', response.data);

      // Set user as logged in
      dispatch(setLoggedIn(true));
      
      // Navigate to Home screen
      navigation.navigate('Dashboard');

    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Error',
        error.response?.data?.message || 'Failed to register. Please try again.'
      );
    }
  };

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
              source={profileImage ? { uri: profileImage } : require('../assets/images/default_avatar.jpg')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
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

      <TouchableOpacity 
        style={[
          styles.registerButton,
          (!fullName || !gender) && styles.registerButtonDisabled
        ]}
        disabled={!fullName || !gender}
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
});

export default PersonalInfoScreen;
