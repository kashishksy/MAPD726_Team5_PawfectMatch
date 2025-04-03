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
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mainContainer}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Image 
              source={require('../assets/images/back_icon.png')} 
              style={styles.inputIcon} 
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Information We Collect</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            We collect information that you provide directly to us, including when you create an account, list a pet, or communicate with other users. This may include your name, email address, phone number, and photos.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>How We Use Your Information</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            We use the information we collect to provide and improve our services, communicate with you, and ensure a safe environment for pet adoption.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Information Sharing</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            We do not sell your personal information. We may share your information with other users as necessary for pet adoption purposes, and with service providers who assist in operating our platform.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Security</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
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
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrivacyPolicyScreen; 