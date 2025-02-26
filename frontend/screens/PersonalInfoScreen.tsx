import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import ProgressBar from '../components/ProgressBar';

const PersonalInfoScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log({ name, phone, gender, profilePic });
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/images/back_icon.png')}
            style={styles.inputIcon}
          />
        </TouchableOpacity>
        <ProgressBar currentStep={4} totalSteps={4} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.message}>
          We're almost there! Fill in your personal details to create a profile
          and start your journey towards a furry friendship.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={() => {}}>
          <Text style={styles.uploadButtonText}>
            {profilePic ? 'Change Profile Picture' : 'Upload Profile Picture'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
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
  inputIcon: {
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
  message: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#FF6F61',
    padding: 16,
    borderRadius: 8,
    margin: 24,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PersonalInfoScreen;
