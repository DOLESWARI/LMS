import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';

// Dummy data
const MOCK_INSTRUCTORS = [
  { instructor_id: 'instr001', name: 'Alice Instructor' },
  { instructor_id: 'instr002', name: 'Mark Instructor' },
];

const MOCK_STUDENTS = [
  { student_id: 'stud001', name: 'Bob Student' },
  { student_id: 'stud002', name: 'Sara Student' },
];

const MOCK_COURSES = [
  { course_id: 'course001', name: 'Introduction to Programming' },
  { course_id: 'course002', name: 'Advanced Algorithms' },
];

const EnrollmentScreen = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const handleAddEnrollment = () => {
    if (!selectedInstructor || !selectedStudent || !selectedCourse) {
      alert('Please select instructor, student, and course.');
      return;
    }

    const newEnrollment = {
      id: `${selectedInstructor.instructor_id}_${selectedStudent.student_id}_${selectedCourse.course_id}`,
      instructor: selectedInstructor,
      student: selectedStudent,
      course: selectedCourse,
    };

    if (enrollments.some(e => e.id === newEnrollment.id)) {
      alert('This enrollment already exists.');
      return;
    }

    setEnrollments(prev => [...prev, newEnrollment]);
    setSelectedInstructor(null);
    setSelectedStudent(null);
    setSelectedCourse(null);
  };

  return (
    <LinearGradient colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.header}>Enrollment</Text>

        <Text style={styles.label}>Select Instructor:</Text>
        <Dropdown
          data={MOCK_INSTRUCTORS}
          labelField="name"
          valueField="instructor_id"
          placeholder="Select Instructor"
          value={selectedInstructor?.instructor_id}
          onChange={item => setSelectedInstructor(item)}
          style={styles.dropdown}
          placeholderStyle={{ color: '#6b7280' }}
        />

        <Text style={styles.label}>Select Student:</Text>
        <Dropdown
          data={MOCK_STUDENTS}
          labelField="name"
          valueField="student_id"
          placeholder="Select Student"
          value={selectedStudent?.student_id}
          onChange={item => setSelectedStudent(item)}
          style={styles.dropdown}
          placeholderStyle={{ color: '#6b7280' }}
        />

        <Text style={styles.label}>Select Course:</Text>
        <Dropdown
          data={MOCK_COURSES}
          labelField="name"
          valueField="course_id"
          placeholder="Select Course"
          value={selectedCourse?.course_id}
          onChange={item => setSelectedCourse(item)}
          style={styles.dropdown}
          placeholderStyle={{ color: '#6b7280' }}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddEnrollment}>
          <LinearGradient
                  colors={['#7497e1ff', '#1940adff']}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
          <Text style={styles.addButtonText}>Add Enrollment</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Enrollments list */}
        <Text style={[styles.header, { marginTop: 30 }]}>Enrollments List</Text>
        {enrollments.length === 0 ? (
          <Text style={styles.noEnrollment}>No enrollments yet.</Text>
        ) : (
          enrollments.map(enroll => (
            <View key={enroll.id} style={styles.enrollmentCard}>
              <Text style={styles.enrollmentText}>
                Instructor: {enroll.instructor.name} ({enroll.instructor.instructor_id})
              </Text>
              <Text style={styles.enrollmentText}>
                Student: {enroll.student.name} ({enroll.student.student_id})
              </Text>
              <Text style={styles.enrollmentText}>
                Course: {enroll.course.name} ({enroll.course.course_id})
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
};

export default EnrollmentScreen;

const styles = StyleSheet.create({
  container: { flex: 1,  },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12, color: '#000',textShadowColor: 'rgba(0, 0, 0, 0.6)',  
  textShadowOffset: { width: 2, height: 2 },  
  textShadowRadius: 4,  },
  label: { fontSize: 16, marginVertical: 8, color: '#000', },
  dropdown: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 12,
  },
  addButton: {
  borderRadius: 10,
  marginTop: 16,
  overflow: 'hidden', // ensures gradient respects rounded corners
},

  addButtonText: { fontWeight: '700', fontSize: 16, color: '#fff', overflow: 'hidden' },
  enrollmentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  enrollmentText: { fontSize: 14, fontWeight: '600', color: '#000', },
  noEnrollment: { fontStyle: 'italic', color: '#666', marginTop: 8, textAlign: 'center' },
  gradientButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16  
  },
  gradientButton: {
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
},
});
