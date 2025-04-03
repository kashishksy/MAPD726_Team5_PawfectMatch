import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  FAQ: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

const menuItems = [
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'help-circle-outline',
    screen: 'FAQ' as keyof RootStackParamList
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-outline',
    screen: 'PrivacyPolicy' as keyof RootStackParamList
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: 'document-text-outline',
    screen: 'TermsOfService' as keyof RootStackParamList
  }
];

const HelpSupportScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
          <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name={item.icon} size={24} color={colors.secondaryText} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>
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
  menuContainer: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default HelpSupportScreen; 