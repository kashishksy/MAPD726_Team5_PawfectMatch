import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { removeToken } from '../utils/authStorage';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';

type RootStackParamList = {
  AccountEdit: undefined;
  OwnerOrganizationDetails: {
    ownerData: any;
    petId: string | null;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  Appearance: undefined;
  HelpSupport: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { colors } = useTheme();
  const userData = useSelector((state: any) => state.auth.userData);
  
  // Debug log to see user data structure
  console.log('User Data in Account Screen:', JSON.stringify(userData, null, 2));
  
  const isPetOwner = userData?.user_type === 'Pet Owner';

  const menuItems = [
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('AccountEdit')
    },
    ...(isPetOwner ? [{
      id: 'myPets',
      title: 'My Pets',
      icon: 'paw-outline',
      onPress: () => navigation.navigate('OwnerOrganizationDetails', {
        ownerData: {
          _id: userData?.userId || userData?._id,
          fullName: userData?.fullName,
          profileImage: userData?.profileImage,
          mobileNumber: userData?.mobileNumber,
          countryCode: userData?.countryCode,
          userType: userData?.user_type
        },
        petId: null,
        address: userData?.address,
        city: userData?.city,
        state: userData?.state,
        country: userData?.country
      })
    }] : []),
    {
      id: 'appearance',
      title: 'App Appearance',
      icon: 'color-palette-outline',
      onPress: () => navigation.navigate('Appearance')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('HelpSupport')
    }
  ];

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.mainContainer}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Account</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <Ionicons name={item.icon} size={24} color={colors.secondaryText} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.secondaryText} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalBackground }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalContent }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Logout</Text>
            <Text style={[styles.modalText, { color: colors.secondaryText }]}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 12,
  },
  cancelButton: {},
  confirmButton: {},
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AccountScreen; 