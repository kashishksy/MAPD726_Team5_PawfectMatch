import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import BottomNavigation from '../components/common/BottomNavigation';

const AppearanceScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

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
          <Text style={[styles.title, { color: colors.text }]}>App Appearance</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.themeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.themeSection}>
              <Text style={[styles.themeTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.themeDescription, { color: colors.secondaryText }]}>
                Toggle dark mode on or off for a different visual experience.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#FF6F61' }}
              thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>

          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>About Themes</Text>
            <Text style={[styles.infoText, { color: colors.secondaryText }]}>
              Dark mode can reduce eye strain in low light environments and save battery on OLED screens.
            </Text>
            <Text style={[styles.infoText, { color: colors.secondaryText, marginTop: 10 }]}>
              Your theme preference will be saved and applied whenever you use the app.
            </Text>
          </View>
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
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  themeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  themeSection: {
    flex: 1,
    marginRight: 12,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  themeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AppearanceScreen; 