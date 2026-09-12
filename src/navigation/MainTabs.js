import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../utils/theme';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import BookingStack from './BookingStack';
import LiveQueueScreen from '../screens/queue/LiveQueueScreen';
import PaymentStatusScreen from '../screens/payment/PaymentStatusScreen';
import GrievanceStack from './GrievanceStack';
import { useFarmer } from '../context/FarmerContext';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { queueState } = useFarmer();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 12);
  const tabHeight = 55 + bottomInset;

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.65)',
        tabBarStyle: {
          backgroundColor: COLORS.primaryDark,
          borderTopWidth: 1,
          borderTopColor: 'rgba(212, 168, 67, 0.25)',
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="BookSlot"
        component={BookingStack}
        options={{
          tabBarLabel: 'Book Slot',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'calendar-check' : 'calendar-check-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="LiveQueue"
        component={LiveQueueScreen}
        options={{
          tabBarLabel: 'Live Queue',
          tabBarBadge: queueState.hasDelayAlert ? '⚠️' : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error,
            color: COLORS.white,
            fontSize: 9,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'radar' : 'radar'}
              size={24}
              color={queueState.hasDelayAlert ? COLORS.error : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Payments"
        component={PaymentStatusScreen}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cash-multiple' : 'cash'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Grievance"
        component={GrievanceStack}
        options={{
          tabBarLabel: 'Grievance',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'bullhorn' : 'bullhorn-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
