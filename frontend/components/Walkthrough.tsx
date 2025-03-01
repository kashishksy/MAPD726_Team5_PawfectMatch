import React, { useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Alert } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";


const slides = [
  {
    key: "1",
    title: "Find your PawfectMatch!",
    text: "Embark on a heartwarming journey to find your perfect companion.",
    image: require("../assets/images/Walkthrough_1.png"),
  },
  {
    key: "2",
    title: "Find Your Perfect Match",
    text: "Swipe, match, and open your heart to a new furry friend.",
    image: require("../assets/images/Walkthrough_2.png"),
  },
  {
    key: "3",
    title: "Get Started Today!",
    text: "Start your adoption journey now.",
    image: require("../assets/images/Walkthrough_3.png"),
  },
];

const WalkthroughScreen = ({ navigation }: any) => {
  const sliderRef = useRef<any>(null);

 // Make sure the walkthrough is marked as seen when this screen unmounts
 useEffect(() => {
  return () => {
    // This ensures we mark walkthrough as seen even if the user forces app close
    AsyncStorage.setItem("walkthroughSeen", "true").catch(err => 
      console.warn("Failed to save walkthrough status on unmount:", err)
    );
  };
}, []);

const saveAndNavigate = async () => {
  try {
    await AsyncStorage.setItem("walkthroughSeen", "true");
    navigation.replace("Login");
  } catch (error) {
    console.warn("Error saving walkthrough state:", error);
    // Navigate anyway even if storage fails
    navigation.replace("Login");
  }
};

const onDone = () => {
  saveAndNavigate();
};

const onSkip = () => {
  saveAndNavigate();
};

const onContinue = () => {
  if (sliderRef.current) {
    const currentIndex = sliderRef.current.state.activeIndex;
    if (currentIndex === slides.length - 1) {
      onDone();
    } else {
      sliderRef.current.goToSlide(currentIndex + 1);
    }
  }
};

  const renderItem = ({ item, index }: any) => (
    <View style={styles.slide}>
      <View style={styles.topSection}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.contentBox}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        <View style={styles.paginationContainer}>
          {slides.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[styles.dot, dotIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={onSkip}
          accessible={true}
          accessibilityLabel="Skip walkthrough"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={onContinue}
          accessible={true}
          accessibilityLabel={index === slides.length - 1 ? "Get started" : "Continue to next slide"}
        >
          <Text style={styles.buttonText}>
            {index === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onDone={onDone}
        renderPagination={() => null}
        showSkipButton={false}
        showNextButton={false}
        showDoneButton={false}
      />
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  topSection: {
    height: height * 0.6,
    backgroundColor: "#FF6F61",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  contentBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 100,
    alignItems: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    backgroundColor: "#e0e0e0",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF6F61",
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  image: {
    width: width * 0.8,
    height: height * 0.7,
    resizeMode: "cover",
    position: "absolute",
    bottom: -50,
  },
  skipButton: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 30,
    width: width * 0.4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  nextButton: {
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 30,
    width: width * 0.4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipText: {
    color: "#FF6F61",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WalkthroughScreen;

function customUseEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
