//frontend/App.tsx
import React from 'react';
import { Provider } from 'react-redux'; // Step 1: Import Provider
import { store } from './redux/store'; // Step 1: Import store
import AppNavigator from './navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <Provider store={store}> {/* Step 2: Wrap AppNavigator with Provider */}
      <AppNavigator />
    </Provider>
  );
}

export default App;