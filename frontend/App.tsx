import React, {useEffect, useState} from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import SplashScreen from './components/SplashScreen';


const App = () => {
  //simulate a loading before presenting the screen
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {

      setIsLoading(false)
    }, 10000); //adding a 3 second delay 


  }, [])

  //render the splash screen while loading
  if(isLoading){

    return <SplashScreen />
  } 

  return (
   
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to PawfectMatch!</Text>
      {/* Add your main app content here */}
    </View>

   


  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4', // Light mode background
  },
  text: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold', // Use your primary font
    color: '#333333', // Light mode text color
  },
});

export default App;