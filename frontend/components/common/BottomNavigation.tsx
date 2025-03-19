import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { removeToken } from '../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';

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
  const [activeTab, setActiveTab] = React.useState('home');
  const navigation = useNavigation();

  const handleTabPress = async (tabId: string) => {
    if (tabId === 'account') {
      await removeToken();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    } else if (tabId === 'favorites') {
      navigation.navigate('Favorites' as never);
      setActiveTab(tabId);
    } else {
      setActiveTab(tabId);
    }
  };

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
            color={activeTab === item.id ? '#F4A460' : '#666666'}
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