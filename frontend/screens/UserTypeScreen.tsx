import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from '../components/ProgressBar';
import { useDispatch } from 'react-redux';
import { setUserType } from '../redux/slices/registrationSlice';

const UserTypeScreen = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      dispatch(setUserType(selectedType));
      navigation.navigate('PetType');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../assets/images/back_icon.png')}
             style={styles.inputIcon}
          />
                     
        </TouchableOpacity>
        <ProgressBar currentStep={1} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          Are you a Pet Owner or Organization ready to find loving homes? Or a Pet Adopter looking for your new best friend?
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[
              styles.optionButton,
              selectedType === 'owner' && styles.selectedOption
            ]}
            onPress={() => setSelectedType('owner')}
          >
            <Text style={[
              styles.optionText,
              selectedType === 'owner' && styles.selectedOptionText
            ]}>
              Pet Owner or Organization
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionButton,
              selectedType === 'adopter' && styles.selectedOption
            ]}
            onPress={() => setSelectedType('adopter')}
          >
            <Text style={[
              styles.optionText,
              selectedType === 'adopter' && styles.selectedOptionText
            ]}>
              Pet Adopter
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !selectedType && styles.continueButtonDisabled
        ]}
        disabled={!selectedType}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
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
  content: {
    padding: 24,
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20
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
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF8F0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FF6F61',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    margin: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserTypeScreen; 