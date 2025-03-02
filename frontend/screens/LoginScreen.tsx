import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Alert } from "react-native";
import { SpinnerSimpleUsageShowcase } from "../components/LoadingSpinner";
import OTPInput from "../components/OTPInput";
import { BlurView } from "@react-native-community/blur";
import { Svg, Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setPhoneNumber,
  setLoading,
  setError,
  setOtpSent,
  setOtpVerified,
  setIsNewUser,
  setLoggedIn,
  setUserData
} from '../redux/slices/authSlice';
import api from '../services/api';
import axios from "axios";
import { storeToken } from '../utils/authStorage';

interface CheckmarkProps {
  color: string; // Define the type of the 'color' prop as a string
}

const Checkmark: React.FC<CheckmarkProps> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path
      d="M20.285 6.705a1 1 0 00-1.414 0l-10.5 10.5-4.285-4.285a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l11-11a1 1 0 000-1.414z"
      fill={color}
    />
  </Svg>
);

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const LoginScreen = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const { isLoading, error, otpSent } = useSelector((state: any) => state.auth);
  const [phoneNumber, setLocalPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleContinue = async () => {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number");
      return;
    }

    if (!isChecked) {
      Alert.alert("Terms & Conditions", "Please accept the terms and conditions to continue");
      return;
    }

    dispatch(setLoading(true));

    try {
      console.log('Attempting to send OTP to:', phoneNumber);
      const response = await api.post('/auth/send-otp', {
        countryCode: '1',
        mobileNumber: phoneNumber,
      });

      console.log('OTP send response:', response.data);

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      dispatch(setOtpSent(true));
      setShowOTP(true);
    } catch (error: any) {
      console.error('OTP send error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send OTP";
      dispatch(setError(errorMessage));
      Alert.alert("Error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePhoneNumberChange = (text:string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '');
    const limitedNumber = cleanNumber.slice(0, 10);
    setLocalPhoneNumber(limitedNumber);
  };

  const handleOTPSubmit = async (otp: string) => {
    dispatch(setLoading(true));

    try {
      const verifyResponse = await api.post('/auth/verify-otp', {
        countryCode: '1',
        mobileNumber: phoneNumber,
        otp,
      });

      if (verifyResponse.data.error) {
        throw new Error(verifyResponse.data.message);
      }

      const { token, exists, user } = verifyResponse.data.data;

      // Store token using the auth storage utility
      await storeToken(token);

      // Update Redux state
      dispatch(setPhoneNumber(phoneNumber));
      dispatch(setOtpVerified(true));

      if (exists) {
        dispatch(setUserData(user));
        dispatch(setLoggedIn(true));
        navigation.replace('Dashboard');
      } else {
        dispatch(setIsNewUser(true));
        navigation.navigate('UserType');
      }

    } catch (error: any) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || "OTP verification failed";
      dispatch(setError(errorMessage));
      Alert.alert("Error", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOutsidePress = () => {
    if (showOTP) {
      setShowOTP(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showOTP && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.otpOverlay}>
                <OTPInput onSubmit={handleOTPSubmit} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/shiba_inu.png")}
          style={styles.logo}
        />
      </View>

      <View style={[styles.content]}>
        <Text style={styles.title}>Find Your Pawfect Match Today!</Text>
        <Text style={styles.subtitle}>A world of furry possibilities awaits you.</Text>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>

          {/* Uncomment this to test walkthrough screen */}
          {/* <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("walkthroughSeen");
              Alert.alert("Walkthrough reset! Restart the app.");
            }}
            style={{ padding: 10, backgroundColor: "red", marginTop: 20 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Reset Walkthrough</Text>
          </TouchableOpacity> */}

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity style={styles.countryCodeButton}>
              <Text style={styles.countryCode}>+1</Text>
            </TouchableOpacity>
            <View style={styles.phoneNumberInput}>
              <Image source={require('../assets/images/phone-call.png')} // Path to your PNG file
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                maxLength={10}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Checkmark color="#FF6F61" />}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to PawfectMatch{" "}
            <Text style={styles.termsLink} onPress={() => navigation.navigate("TermsConditions")}>
              Terms & Conditions
            </Text>

          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.signupButton,
            (phoneNumber.length !== 10 || !isChecked) && styles.signupButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={phoneNumber.length !== 10 || !isChecked || isLoading}
        >
          {isLoading ? (
            <SpinnerSimpleUsageShowcase />
          ) : (
            <Text style={styles.signupButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        {/* <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View> */}

        {/* "Or" Text with lines */}
        {/* <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View> */}

        {/* Social Login Buttons */}
        {/* <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/google-icon.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../assets/images/devicon--apple.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity> */}

        {/* removing blurview for bug fix */}
        {/* {showOTP && <BlurView style={StyleSheet.absoluteFill} blurAmount={5} />} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.03,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  title: {
    fontSize: 24,
    fontFamily: "System",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Merriweather-Regular",
    color: "#666666",
    marginBottom: 32,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    color: "#333333",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginRight: 4,
  },
  phoneNumberInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
    height: 12,
    width: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF6F61",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333333",
  },
  termsLink: {
    color: "#FF6F61",
    fontFamily: "Poppins-Bold",
  },
  signupButton: {
    backgroundColor: "#FF6F61",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666666",
  },
  loginLink: {
    color: "#FF6F61",
    fontFamily: "Poppins-Bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  orText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666666",
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 16,
  },
  socialIcon: {
    marginRight: 12,
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#333333",
  },
  signupButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  otpOverlay: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  blurredContent: {
    opacity: 0.7,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;