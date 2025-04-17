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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';

const TermsOfServiceScreen = () => {
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
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Terms of Service</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Acceptance of Terms</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            By accessing or using PawfectMatch, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Responsibilities</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            You are responsible for maintaining the confidentiality of your account, providing accurate information about pets, and conducting all pet adoption activities in good faith.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pet Listings</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            All pet listings must be accurate and truthful. You must have the legal right to list a pet for adoption. We reserve the right to remove any listing that violates our policies.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Limitation of Liability</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            PawfectMatch serves as a platform to connect pet owners with potential adopters. We are not responsible for the actions of users or the outcome of any adoption arrangements.
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Modifications</Text>
          <Text style={[styles.text, { color: colors.secondaryText }]}>
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
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
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

export default TermsOfServiceScreen; 