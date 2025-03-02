import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define the params for the stack
type RootStackParamList = {
  SearchScreen: undefined;
  // other screens...
};

const SearchScreen: React.FC = ({ navigation, route }: any) => {
  const [location, setLocation] = useState('');
  const [petType, setPetType] = useState('');
  const [gender, setGender] = useState('');
  const [size, setSize] = useState('');
  const [age, setAge] = useState('');

  const handleSearch = () => {
    // Implement search logic here
    console.log({ location, petType, gender, size, age });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Pet Type</Text>
      <Picker
        selectedValue={petType}
        style={styles.picker}
        onValueChange={(itemValue) => setPetType(itemValue)}
      >
        <Picker.Item label="Dog" value="dog" />
        <Picker.Item label="Cat" value="cat" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
      </Picker>

      <Text style={styles.label}>Size</Text>
      <Picker
        selectedValue={size}
        style={styles.picker}
        onValueChange={(itemValue) => setSize(itemValue)}
      >
        <Picker.Item label="Small" value="small" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Large" value="large" />
      </Picker>

      <Text style={styles.label}>Age</Text>
      <Picker
        selectedValue={age}
        style={styles.picker}
        onValueChange={(itemValue) => setAge(itemValue)}
      >
        <Picker.Item label="Puppy/Kitten" value="puppy_kitten" />
        <Picker.Item label="Adult" value="adult" />
        <Picker.Item label="Senior" value="senior" />
      </Picker>

      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
});

export default SearchScreen;
