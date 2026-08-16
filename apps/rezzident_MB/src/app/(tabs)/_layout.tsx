/**
 * Tab layout — bottom navigation for main app.
 * Matches Rezzident Design System Foundations v1.0.0 — 06 Navigation Bar
 *
 * Spec:
 *   Height: 56px  |  Icon: 24×24 outline  |  Label: DM Sans Medium 10px
 *   Active: #FFE022 (Accent Yellow) + #1A1A1A (outline fill)
 *   Inactive: #8A8478 (Warm Gray)
 *   Background: #FFFFFF  |  Corner Radius: 0  |  Elevation: None
 *   Tabs: Home, Bills, Forum, Vote, Settings
 *
 * Icons: Material Design Icons (https://github.com/google/material-design-icons)
 * via @expo/vector-icons MaterialCommunityIcons set.
 */

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const ACTIVE_COLOR = '#FFE022';
const INACTIVE_COLOR = '#8A8478';
const TAB_BAR_HEIGHT = 56;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? 21 : 0),
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 21 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'DMSans-Medium',
          fontSize: 10,
          lineHeight: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarLabel: 'Bills',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'credit-card' : 'credit-card-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarLabel: 'Forum',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'forum' : 'forum-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vote"
        options={{
          title: 'Vote',
          tabBarLabel: 'Vote',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'vote' : 'vote-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cog' : 'cog-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
