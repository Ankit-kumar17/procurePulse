import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GrievanceListScreen from '../screens/grievance/GrievanceListScreen';
import GrievanceFormScreen from '../screens/grievance/GrievanceFormScreen';

const Stack = createStackNavigator();

export default function GrievanceStack() {
  return (
    <Stack.Navigator
      initialRouteName="GrievanceList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="GrievanceList" component={GrievanceListScreen} />
      <Stack.Screen name="GrievanceForm" component={GrievanceFormScreen} />
    </Stack.Navigator>
  );
}
