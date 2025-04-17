import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNavigation from '../components/common/BottomNavigation';
import { useTheme } from '../context/ThemeContext';

const faqData = [
  {
    id: '1',
    question: 'How do I adopt a pet?',
    answer: "To adopt a pet, browse through our available pets, select one you're interested in, and click 'Contact' to get in touch with the owner or organization. They will guide you through their adoption process."
  },
  {
    id: '2',
    question: 'What are the adoption fees?',
    answer: 'Adoption fees vary depending on the organization or individual. These fees typically cover vaccinations, microchipping, and spaying/neutering. Contact the specific organization for detailed fee information.'
  },
  {
    id: '3',
    question: 'How do I create an account?',
    answer: "Simply enter your phone number on the login screen. We'll send you a verification code. Once verified, you can set up your profile and start browsing pets!"
  },
  {
    id: '4',
    question: 'Can I list my pet for adoption?',
    answer: 'Yes! Select "Owner" during registration, and you\'ll be able to list your pets. Make sure to provide accurate information and clear photos.'
  }
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionItemProps {
  item: FAQItem;
  isActive: boolean;
  onPress: () => void;
  colors: any;
}

const AccordionItem = ({ item, isActive, onPress, colors }: AccordionItemProps) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={[styles.accordionItem, { backgroundColor: colors.card }]}>
      <TouchableOpacity 
        style={styles.questionContainer} 
        onPress={onPress}
      >
        <Text style={[styles.question, { color: colors.text }]}>{item.question}</Text>
        <Ionicons 
          name={isActive ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color={colors.secondaryText} 
        />
      </TouchableOpacity>
      <Animated.View style={[styles.answerContainer, { maxHeight: bodyHeight }]}>
        <Text style={[styles.answer, { color: colors.secondaryText }]}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const FAQScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { colors } = useTheme();

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
          <Text style={[styles.title, { color: colors.text }]}>FAQ</Text>
        </View>

        <ScrollView style={styles.content}>
          {faqData.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isActive={activeIndex === index}
              onPress={() => setActiveIndex(activeIndex === index ? null : index)}
              colors={colors}
            />
          ))}
        </ScrollView>
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
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  inputIcon: {
    marginRight: 12,
    height: 20,
    width: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  accordionItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  answerContainer: {
    overflow: 'hidden',
  },
  answer: {
    fontSize: 14,
    padding: 16,
    paddingTop: 0,
  },
});

export default FAQScreen; 