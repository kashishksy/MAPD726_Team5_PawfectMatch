import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const TermsScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.paragraph}>
          Welcome to PawfectMatch! By using this app, you agree to the following terms...
        </Text>
        <Text style={styles.paragraph}>
          1. You must be 18 years or older to use this app.
        </Text>
        <Text style={styles.paragraph}>
          2. The app does not guarantee pet adoption matches.
        </Text>
        <Text style={styles.paragraph}>
          3. You agree not to misuse the platform.
        </Text>
        {/* Add more terms here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#FF6F61",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TermsScreen;
