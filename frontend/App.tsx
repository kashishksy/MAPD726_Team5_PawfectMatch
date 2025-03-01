//frontend/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { View, SafeAreaView } from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </View>
    </SafeAreaView>
  );
}

export default App;