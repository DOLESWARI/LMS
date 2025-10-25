import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import EnrolledCoursesScreen from './EnrolledCoursesScreen';
import AssignmentsGradesScreen from './AssignmentsGradesScreen';
import CertificatesScreen from './CertificatesScreen';
import StudentProfile from './StudentProfile';

const Tab = createBottomTabNavigator();

// Custom two-line label component (same as before)
function TwoLineLabel({ top, bottom, color }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color, fontSize: 11, lineHeight: 14 }}>{top}</Text>
      <Text style={{ color, fontSize: 11, lineHeight: 14 }}>{bottom}</Text>
    </View>
  );
}

function StudentTabs({ name, onLogout }) {
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
          name="EnrolledCourses"
          component={EnrolledCoursesScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <TwoLineLabel top="Enrolled" bottom="Courses" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AssignmentsGrades"
          component={AssignmentsGradesScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <TwoLineLabel top="Assignments" bottom="Grades" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Certificates"
          component={CertificatesScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 11, textAlign: 'center' }}>Certificates</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Student"
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 11, textAlign: 'center' }}>Profile</Text>
            ),
          }}
        >
          {() => <StudentProfile name={name} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default StudentTabs;

