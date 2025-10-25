import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import InstructorCourses from './InstructorCourses';
import EnrolledStudentsScreen from './EnrolledStudentsScreen';
import AssignmentsTestsScreen from './AssignmentsTestsScreen';
import InstructorProfile from './InstructorProfile';

const Tab = createBottomTabNavigator();

// Custom two-line label component
function TwoLineLabel({ top, bottom, color }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color, fontSize: 11, lineHeight: 14 }}>{top}</Text>
      <Text style={{ color, fontSize: 11, lineHeight: 14 }}>{bottom}</Text>
    </View>
  );
}

function InstructorTabs({ name, onLogout }) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0046a2ff',
          tabBarStyle: { paddingBottom: 6, height: 75 }, // taller for 2 lines
        }}
      >
        <Tab.Screen
          name="Courses"
          component={InstructorCourses}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 11, textAlign: 'center' }}>Courses</Text>
            ),
          }}
        />
        <Tab.Screen
          name="EnrolledStudents"
          component={EnrolledStudentsScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <TwoLineLabel top="Enrolled" bottom="Students" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AssignmentsTests"
          component={AssignmentsTestsScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <TwoLineLabel top="Assignments" bottom="Tests" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Instructor"
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 11, textAlign: 'center' }}>Profile</Text>
            ),
          }}
        >
          {() => <InstructorProfile name={name} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default InstructorTabs;
