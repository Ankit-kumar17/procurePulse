import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectCropLandScreen from '../screens/booking/SelectCropLandScreen';
import CentreRecommendationScreen from '../screens/booking/CentreRecommendationScreen';
import CalendarScreen from '../screens/booking/CalendarScreen';
import TimeSlotScreen from '../screens/booking/TimeSlotScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';

const Stack = createStackNavigator();

export default function BookingStack() {
  return (
    <Stack.Navigator
      initialRouteName="SelectCropLand"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SelectCropLand" component={SelectCropLandScreen} />
      <Stack.Screen name="CentreRecommendation" component={CentreRecommendationScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="TimeSlot" component={TimeSlotScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
}
