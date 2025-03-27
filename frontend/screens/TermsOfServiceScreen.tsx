import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/common/BottomNavigation';

const TermsOfServiceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
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
          <Text style={styles.title}>Terms of Service</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing or using PawfectMatch, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </Text>

          <Text style={styles.sectionTitle}>User Responsibilities</Text>
          <Text style={styles.text}>
            You are responsible for maintaining the confidentiality of your account, providing accurate information about pets, and conducting all pet adoption activities in good faith.
          </Text>

          <Text style={styles.sectionTitle}>Pet Listings</Text>
          <Text style={styles.text}>
            All pet listings must be accurate and truthful. You must have the legal right to list a pet for adoption. We reserve the right to remove any listing that violates our policies.
          </Text>

          <Text style={styles.sectionTitle}>Limitation of Liability</Text>
          <Text style={styles.text}>
            PawfectMatch serves as a platform to connect pet owners with potential adopters. We are not responsible for the actions of users or the outcome of any adoption arrangements.
          </Text>

          <Text style={styles.sectionTitle}>Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </Text>
        </ScrollView>
      </View>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TermsOfServiceScreen; 