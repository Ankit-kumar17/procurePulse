import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from './src/utils/theme';
import { AuthProvider } from './src/context/AuthContext';
import { FarmerProvider } from './src/context/FarmerContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <FarmerProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </FarmerProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
