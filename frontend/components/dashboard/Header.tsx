import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList } from '../../navigation/AppNavigator'; // Replace with your actual stack type location
import { NavigationProp } from '@react-navigation/native';

const Header = ({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Image 
          source={require('../../assets/images/shiba_inu.png')}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>PawfectMatch</Text>
      <View style={styles.rightIcons}>
        {/* Navigate to SearchScreen */}
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Icon name="search1" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  leftContainer: {
    width: 24,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    position: 'relative', 
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 16,
    width: 24,
    justifyContent: 'flex-end',
  },
});

export default Header;
