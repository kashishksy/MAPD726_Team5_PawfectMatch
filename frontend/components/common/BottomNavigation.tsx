import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    id: 'maps',
    label: 'Maps',
    icon: 'map-outline',
    activeIcon: 'map',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'chatbox-outline',
    activeIcon: 'chatbox',
  },
  {
    id: 'account',
    label: 'Account',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

// Create a mapping of route names to tab IDs
const routeToTabMap: { [key: string]: string } = {
  'Dashboard': 'home',
  'Favorites': 'favorites',
  'MapScreen': 'maps',
  'MessagesScreen': 'messages',
  'ChatDetail': 'messages',
  'Account': 'account',
  'AccountEdit': 'account',
  'Appearance': 'account',
  'HelpSupport': 'account',
  'FAQ': 'account',
  'PrivacyPolicy': 'account',
  'TermsOfService': 'account',
};

const BottomNavigation = React.memo(() => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  // Use useMemo to calculate the active tab only when the route name changes
  const activeTab = useMemo(() => {
    return routeToTabMap[route.name] || 'home';
  }, [route.name]);

  const handleTabPress = React.useCallback((tabId: string) => {
    const targetRoute = Object.entries(routeToTabMap).find(([_, value]) => value === tabId)?.[0] || 'Dashboard';
    navigation.navigate(targetRoute as never);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.tabItem}
          onPress={() => handleTabPress(item.id)}
        >
          <Ionicons
            name={activeTab === item.id ? item.activeIcon : item.icon}
            size={24}
            color={activeTab === item.id ? colors.primary : colors.secondaryText}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === item.id ? colors.primary : colors.secondaryText },
              activeTab === item.id && styles.activeLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  activeLabel: {
    fontWeight: '500',
  },
});

export default BottomNavigation; 