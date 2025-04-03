import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { removeToken } from '../../utils/authStorage';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const BottomNavigation = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Set initial active tab based on current route
  const [activeTab, setActiveTab] = React.useState(() => {
    switch (route.name) {
      case 'Dashboard':
        return 'home';
      case 'Favorites':
        return 'favorites';
      case 'MapScreen':
        return 'maps';
      // Add other cases as needed
      default:
        return 'home';
    }
  });

  const handleTabPress = async (tabId: string) => {
    if (tabId === 'account') {
      navigation.navigate('Account' as never);
      setActiveTab('account');
    } else if (tabId === 'favorites') {
      navigation.navigate('Favorites' as never);
      setActiveTab('favorites');
    } else if (tabId === 'maps') {
      navigation.navigate('MapScreen' as never);
      setActiveTab('maps');
    } else if (tabId === 'home') {
      navigation.navigate('Dashboard' as never);
      setActiveTab('home');
    } else {
      setActiveTab(tabId);
    }
  };

  // Update active tab when route changes
  React.useEffect(() => {
    switch (route.name) {
      case 'Dashboard':
        setActiveTab('home');
        break;
      case 'Favorites':
        setActiveTab('favorites');
        break;
      // Add other cases as needed
    }
  }, [route.name]);

  return (
    <View style={styles.container}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.tabItem}
          onPress={() => handleTabPress(item.id)}
        >
          <Ionicons
            name={activeTab === item.id ? item.activeIcon : item.icon}
            size={24}
            color={activeTab === item.id ? '#FF6F61' : '#666666'}
          />
          <Text
            style={[
              styles.label,
              activeTab === item.id && styles.activeLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  tabItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  activeLabel: {
    color: '#F4A460',
  },
});

export default BottomNavigation; 