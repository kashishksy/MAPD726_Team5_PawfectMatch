import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions, // Import Dimensions
  TouchableWithoutFeedback
} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from "react-native";
import { SpinnerSimpleUsageShowcase } from '../components/LoadingSpinner';
import OTPInput from '../components/OTPInput';
import { BlurView } from "@react-native-community/blur";

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleContinue = async () => {
    // Basic phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number");
      return;
    }

    if (!isChecked) {
      Alert.alert("Terms & Conditions", "Please accept the terms and conditions to continue");
      return;
    }

    // Show loading spinner
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setShowOTP(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneNumberChange = (text:string) => {
    const cleanNumber = text.replace(/[^0-9]/g, '');
    const limitedNumber = cleanNumber.slice(0, 10);
    setPhoneNumber(limitedNumber);
  };

  const handleOTPSubmit = (otp:number) => {
    console.log("OTP submitted:", otp);
    // Handle OTP verification
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
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.otpOverlay}>
                <OTPInput onSubmit={handleOTPSubmit} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <View style={[styles.content, showOTP && styles.blurredContent]}>
        <Text style={styles.title}>Join PawfectMatch Today 🐾</Text>
        <Text style={styles.subtitle}>A world of furry possibilities awaits you.</Text>

        {/* Phone Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity style={styles.countryCodeButton}>
              <Text style={styles.countryCode}>+1</Text>
            </TouchableOpacity>
            <View style={styles.phoneNumberInput}>
              <MaterialIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                maxLength={10}
                placeholderTextColor="#999" // Added placeholder text color
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
            {isChecked && (
              <MaterialIcons name="check" size={16} color="#CD9B5C" />
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I agree to PawfectMatch{" "}
            <Text style={styles.termsLink}>Terms & Conditions</Text>.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.signupButton,
            (phoneNumber.length !== 10 || !isChecked) && styles.signupButtonDisabled
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
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* "Or" Text with lines */}
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../assets/images/google-icon.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../assets/images/devicon--apple.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {showOTP && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurAmount={5}
          />
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.05, // Responsive margin
  },
  logo: {
    width: width * 0.3, // 30% of screen width
    height: width * 0.3, //Ensuring it's a square
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06, // Responsive padding
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: 'center', // Centered title
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: 'center', // Centered subtitle
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
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
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    borderColor: "#CD9B5C",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: "#333",
  },
  termsLink: {
    color: "#CD9B5C",
  },
  signupButton: {
    backgroundColor: "#CD9B5C",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signupButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#CD9B5C",
  },
   orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  orText: {
    textAlign: "center",
    color: "#666",
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
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontSize: 16,
    color: "#333",
  },
  signupButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  signupButtonTextDisabled: {
    color: '#999',
  },
  otpOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'white',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
