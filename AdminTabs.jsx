import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AdminDashboard from './AdminDashboard';     // Overview tab
import CoursesScreen from './CoursesScreen';       // Courses tab
import EnrollmentScreen from './Enrollment';       // Enrollment tab
import ProfileScreen from './Profile';             // Profile tab

const Tab = createBottomTabNavigator();

// Accept props from App.jsx
function TabsNavigation({ name, onLogout }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0046a2ff',
          //tabBarActiveTintColor: '#6366f1',
          tabBarStyle: { paddingBottom: 6, height: 60 },
        }}
      >
        <Tab.Screen name="Overview" component={AdminDashboard} />
        <Tab.Screen name="Courses" component={CoursesScreen} />
        <Tab.Screen name="Enrollment" component={EnrollmentScreen} />
        
        {/* Pass props manually to ProfileScreen */}
        <Tab.Screen name="Profile">
          {() => <ProfileScreen name={name} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabsNavigation;
