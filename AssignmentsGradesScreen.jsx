// AssignmentsGradesScreen.jsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const AssignmentsGradesScreen = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [assignmentData, setAssignmentData] = useState([
    {
      id: '1',
      title: 'Assignment 1: JavaScript Basics',
      instructor: 'John Doe',
      grade: 'A',
      status: 'Completed',
      feedback: 'Excellent understanding of concepts.',
      submittedOn: '2025-07-15',
    },
    {
      id: '2',
      title: 'Assignment 2: React Components',
      instructor: 'Jane Smith',
      grade: 'B+',
      status: 'Completed',
      feedback: 'Good work, but needs improvement in props usage.',
      submittedOn: '2025-07-20',
    },
    {
      id: '3',
      title: 'Assignment 3: API Integration',
      instructor: 'John Doe',
      grade: 'Pending',
      status: 'Not Submitted',
      feedback: '',
      submittedOn: '',
    },
  ]);

  const [tests, setTests] = useState([
    {
      id: '1',
      title: 'Test 1: HTML & CSS',
      instructor: 'Sarah Lee',
      marks: '85/100',
      status: 'Completed',
      feedback: 'Good understanding of layout and styles.',
      submittedOn: '2025-07-10',
    },
    {
      id: '2',
      title: 'Test 2: React Native Basics',
      instructor: 'David Kim',
      marks: 'Pending',
      status: 'Not Submitted',
      feedback: '',
      submittedOn: '',
    },
  ]);

  const toggleExpandAssignment = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleExpandTest = (id) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  const handleSubmitAssignment = (id) => {
    setAssignmentData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            status: 'Not Checked',
            grade: 'Not Checked',
            submittedOn: new Date().toISOString().split('T')[0],
          }
          : item
      )
    );
    Alert.alert('Submitted', 'Your assignment has been submitted.');
  };

  const handleSubmitTest = (id) => {
    setTests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            status: 'Not Checked',
            marks: 'Not Checked',
            submittedOn: new Date().toISOString().split('T')[0],
          }
          : item
      )
    );
    Alert.alert('Submitted', 'Your test has been submitted.');
  };

  const renderAssignmentItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleExpandAssignment(item.id)}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
          </View>
          <Text
            style={[
              styles.grade,
              (item.status === 'Pending' || item.grade === 'Not Checked') &&
              styles.pendingGrade,
            ]}
          >
            {item.grade}
          </Text>
        </View>
        <Text style={styles.status}>
          Status:{' '}
          <Text
            style={
              item.status === 'Completed'
                ? styles.completed
                : styles.notSubmitted
            }
          >
            {item.status}
          </Text>
        </Text>
      </TouchableOpacity>

      {item.status === 'Not Submitted' && (
        <TouchableOpacity
          style={[styles.submitButton, styles.rightAlignButton]}
          onPress={() => handleSubmitAssignment(item.id)}
        >
          <LinearGradient
            colors={['#7497e1ff', '#1940adff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.submitText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {expandedId === item.id && (
        <View style={styles.details}>
          {item.feedback ? (
            <>
              <Text style={styles.detailText}>Feedback: {item.feedback}</Text>
              <Text style={styles.detailText}>
                Submitted on: {item.submittedOn}
              </Text>
            </>
          ) : (
            <Text style={styles.detailText}>No submission yet.</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderTestItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleExpandTest(item.id)}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.assignmentTitle}>{item.title}</Text>
            <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
          </View>
          <Text
            style={[
              styles.grade,
              (item.status === 'Pending' || item.marks === 'Not Checked') &&
              styles.pendingGrade,
            ]}
          >
            {item.marks}
          </Text>
        </View>
        <Text style={styles.status}>
          Status:{' '}
          <Text
            style={
              item.status === 'Completed'
                ? styles.completed
                : styles.notSubmitted
            }
          >
            {item.status}
          </Text>
        </Text>
      </TouchableOpacity>

      {item.status === 'Not Submitted' && (
        <TouchableOpacity
          style={[styles.submitButton, styles.rightAlignButton]}
          onPress={() => handleSubmitTest(item.id)}
        >
          <LinearGradient
            colors={['#7497e1ff', '#1940adff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.submitText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {expandedTestId === item.id && (
        <View style={styles.details}>
          {item.feedback ? (
            <>
              <Text style={styles.detailText}>Feedback: {item.feedback}</Text>
              <Text style={styles.detailText}>
                Submitted on: {item.submittedOn}
              </Text>
            </>
          ) : (
            <Text style={styles.detailText}>No submission yet.</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>📝 Assignments</Text>
        <Image
          source={require('./IMAGES/assing_img.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <FlatList
          data={assignmentData}
          keyExtractor={(item) => item.id}
          renderItem={renderAssignmentItem}
          scrollEnabled={false}
        />

        <Text style={styles.heading}>⏳ Tests</Text>
        <Image
          source={require('./IMAGES/assing_img1.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <FlatList
          data={tests}
          keyExtractor={(item) => item.id}
          renderItem={renderTestItem}
          scrollEnabled={false}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default AssignmentsGradesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerImage: {
    width: '100%',
    height: 260,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingRight: 10,
    color: '#000',
  },
  instructor: {
    fontSize: 14,
    color: '#666',
  },
  grade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  pendingGrade: {
    color: '#f57c00',
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
  completed: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  notSubmitted: {
    color: '#c62828',
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 5,
    //backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rightAlignButton: {
    alignSelf: 'flex-end',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 4,  
  },
  gradientButton: {
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  
},
});
