import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progress, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.stepText}>{currentStep}/{totalSteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FF6F61',
    borderRadius: 2,
  },
  stepText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ProgressBar; 