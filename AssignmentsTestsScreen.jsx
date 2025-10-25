import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';

const data = {
  assignments: [
    {
      course: 'Mathematics',
      topics: [
        {
          topic: 'Algebra',
          subtopics: [
            {
              subtopic: 'Linear Equations',
              completedBy: ['Alice', 'Bob'],
              appearedBy: ['Charlie'],
              remaining: ['David', 'Eve'],
            },
            {
              subtopic: 'Quadratic Equations',
              completedBy: ['David'],
              appearedBy: [],
              remaining: ['Alice', 'Bob', 'Charlie', 'Eve'],
            },
          ],
        },
        {
          topic: 'Calculus',
          subtopics: [
            {
              subtopic: 'Limits',
              completedBy: ['Alice', 'Eve'],
              appearedBy: ['Bob'],
              remaining: ['Charlie', 'David'],
            },
            {
              subtopic: 'Derivatives',
              completedBy: ['Charlie'],
              appearedBy: ['Alice'],
              remaining: ['Bob', 'David', 'Eve'],
            },
          ],
        },
      ],
    },
    {
      course: 'Physics',
      topics: [
        {
          topic: 'Mechanics',
          subtopics: [
            {
              subtopic: 'Laws of Motion',
              completedBy: ['Eve'],
              appearedBy: ['Alice'],
              remaining: ['Bob', 'Charlie', 'David'],
            },
            {
              subtopic: 'Work and Energy',
              completedBy: ['Bob', 'Charlie'],
              appearedBy: [],
              remaining: ['Alice', 'David', 'Eve'],
            },
          ],
        },
        {
          topic: 'Thermodynamics',
          subtopics: [
            {
              subtopic: 'First Law',
              completedBy: ['David'],
              appearedBy: [],
              remaining: ['Alice', 'Bob', 'Charlie', 'Eve'],
            },
            {
              subtopic: 'Second Law',
              completedBy: ['Charlie'],
              appearedBy: ['Eve'],
              remaining: ['Alice', 'Bob', 'David'],
            },
          ],
        },
      ],
    },
    {
      course: 'Computer Science',
      topics: [
        {
          topic: 'Programming Basics',
          subtopics: [
            {
              subtopic: 'Variables and Data Types',
              completedBy: ['Alice', 'Bob', 'Charlie'],
              appearedBy: ['David'],
              remaining: ['Eve'],
            },
            {
              subtopic: 'Control Structures',
              completedBy: ['Eve'],
              appearedBy: [],
              remaining: ['Alice', 'Bob', 'Charlie', 'David'],
            },
          ],
        },
        {
          topic: 'Data Structures',
          subtopics: [
            {
              subtopic: 'Arrays',
              completedBy: ['David', 'Charlie'],
              appearedBy: [],
              remaining: ['Alice', 'Bob', 'Eve'],
            },
            {
              subtopic: 'Linked Lists',
              completedBy: [],
              appearedBy: ['Alice', 'Bob'],
              remaining: ['Charlie', 'David', 'Eve'],
            },
          ],
        },
      ],
    },
  ],

  tests: [
    {
      course: 'Mathematics',
      topics: [
        {
          topic: 'Geometry',
          subtopics: [
            {
              subtopic: 'Triangles',
              scores: [
                { student: 'Alice', score: 85 },
                { student: 'Bob', score: 78 },
              ],
              remaining: ['Charlie', 'David', 'Eve'],
            },
            {
              subtopic: 'Circles',
              scores: [{ student: 'Charlie', score: 92 }],
              remaining: ['Alice', 'Bob', 'David', 'Eve'],
            },
          ],
        },
        {
          topic: 'Trigonometry',
          subtopics: [
            {
              subtopic: 'Sine and Cosine',
              scores: [
                { student: 'Eve', score: 88 },
                { student: 'Alice', score: 75 },
              ],
              remaining: ['Bob', 'Charlie', 'David'],
            },
          ],
        },
      ],
    },
    {
      course: 'Chemistry',
      topics: [
        {
          topic: 'Organic Chemistry',
          subtopics: [
            {
              subtopic: 'Hydrocarbons',
              scores: [{ student: 'Eve', score: 90 }],
              remaining: ['Alice', 'Bob', 'Charlie', 'David'],
            },
            {
              subtopic: 'Alcohols',
              scores: [{ student: 'David', score: 70 }],
              remaining: ['Alice', 'Bob', 'Charlie', 'Eve'],
            },
          ],
        },
        {
          topic: 'Inorganic Chemistry',
          subtopics: [
            {
              subtopic: 'Periodic Table',
              scores: [
                { student: 'Bob', score: 85 },
                { student: 'Charlie', score: 79 },
              ],
              remaining: ['Alice', 'David', 'Eve'],
            },
          ],
        },
      ],
    },
    {
      course: 'Physics',
      topics: [
        {
          topic: 'Optics',
          subtopics: [
            {
              subtopic: 'Reflection',
              scores: [{ student: 'Alice', score: 91 }],
              remaining: ['Bob', 'Charlie', 'David', 'Eve'],
            },
            {
              subtopic: 'Refraction',
              scores: [{ student: 'Eve', score: 87 }],
              remaining: ['Alice', 'Bob', 'Charlie', 'David'],
            },
          ],
        },
      ],
    },
  ],

  pendingCheckings: [
    {
      type: 'Assignment',
      course: 'Mathematics',
      topic: 'Algebra',
      subtopic: 'Quadratic Equations',
      students: ['Eve','Alia'],
    },
    {
      type: 'Assignment',
      course: 'Mathematics',
      topic: 'Calculus',
      subtopic: 'Limits',
      students: ['Bob'],
    },
    {
      type: 'Assignment',
      course: 'Chemistry',
      topic: 'Inorgnic Chemistry',
      subtopic: 'Periodic Table',
      students: ['Satabdi'],
    },
    {
      type: 'Test',
      course: 'Physics',
      topic: 'Optics',
      subtopic: 'Reflection',
      students: ['Bob'],
    },
  ],
};

const AssignmentsTestsScreen = () => {
  const [expandedAssignments, setExpandedAssignments] = useState({});
  const [expandedAssignmentTopics, setExpandedAssignmentTopics] = useState({});
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedTestTopics, setExpandedTestTopics] = useState({});
  const [expandedPending, setExpandedPending] = useState({});
  const [expandedPendingTopics, setExpandedPendingTopics] = useState({});
  const [dropdownValue, setDropdownValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [pendingCheckings, setPendingCheckings] = useState(data.pendingCheckings);

  // Assignment form states
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [assignmentLink, setAssignmentLink] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // Test form states
  const [testCourse, setTestCourse] = useState(null);
  const [testTopic, setTestTopic] = useState(null);
  const [testLink, setTestLink] = useState('');
  const [testDate, setTestDate] = useState(new Date());
  const [openTestDatePicker, setOpenTestDatePicker] = useState(false);
  const [totalMarks, setTotalMarks] = useState('');
  const [duration, setDuration] = useState('');

  const toggleExpand = (type, index) => {
    if (type === 'assignment') {
      setExpandedAssignments((prev) => ({ ...prev, [index]: !prev[index] }));
    } else if (type === 'test') {
      setExpandedTests((prev) => ({ ...prev, [index]: !prev[index] }));
    } else if (type === 'pending') {
      setExpandedPending((prev) => ({ ...prev, [index]: !prev[index] }));
    }
  };

  const toggleTopicExpand = (type, courseIndex, topicIndex) => {
    if (type === 'assignment') {
      setExpandedAssignmentTopics((prev) => ({
        ...prev,
        [`${courseIndex}-${topicIndex}`]: !prev[`${courseIndex}-${topicIndex}`],
      }));
    } else if (type === 'test') {
      setExpandedTestTopics((prev) => ({
        ...prev,
        [`${courseIndex}-${topicIndex}`]: !prev[`${courseIndex}-${topicIndex}`],
      }));
    } else if (type === 'pending') {
      setExpandedPendingTopics((prev) => ({
        ...prev,
        [`${courseIndex}-${topicIndex}`]: !prev[`${courseIndex}-${topicIndex}`],
      }));
    }
  };

  // Group pending checkings by type and course
  const groupedPending = pendingCheckings.reduce((acc, item) => {
    const key = `${item.type}-${item.course}`;
    if (!acc[key]) {
      acc[key] = { type: item.type, course: item.course, topics: [] };
    }
    let topic = acc[key].topics.find((t) => t.topic === item.topic);
    if (!topic) {
      topic = { topic: item.topic, subtopics: [] };
      acc[key].topics.push(topic);
    }
    topic.subtopics.push({
      subtopic: item.subtopic,
      students: item.students,
    });
    return acc;
  }, {});
  const pendingArray = Object.values(groupedPending);

  const handleSaveAssignment = () => {
    if (!selectedCourse || !selectedTopic) return;
    const newPending = {
      type: 'Assignment',
      course: selectedCourse,
      topic: selectedTopic,
      subtopic: selectedTopic,
      students: [], // Or dynamic input if needed
    };
    setPendingCheckings((prev) => [...prev, newPending]);
    console.log('Assignment Saved:', newPending);

    // Reset
    setModalVisible(false);
    setSelectedCourse(null);
    setSelectedTopic(null);
    setAssignmentLink('');
    setDueDate(new Date());
  };


  const handleSaveTest = () => {
    if (!testCourse || !testTopic) return;
    const newPending = {
      type: 'Test',
      course: testCourse,
      topic: testTopic,
      subtopic: testTopic,
      students: [], // Or dynamic input if needed
    };
    setPendingCheckings((prev) => [...prev, newPending]);
    console.log('Test Saved:', newPending);

    // Reset
    setModalVisible(false);
    setTestCourse(null);
    setTestTopic(null);
    setTestLink('');
    setTestDate(new Date());
    setTotalMarks('');
    setDuration('');
  };


  // Topics dropdowns
  const topicsForSelectedCourse = selectedCourse
    ? data.assignments.find((c) => c.course === selectedCourse)?.topics || []
    : [];

  const topicsForTestCourse = testCourse
    ? data.tests.find((c) => c.course === testCourse)?.topics || []
    : [];

  return (
    <LinearGradient
          colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']}
          style={{ flex: 1 }}
        >
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Assignments & Tests</Text>

      {/* Dropdown with Plus beside */}
      <View style={styles.dropdownRow}>
        <Dropdown
          style={styles.dropdown}
          data={[
            { label: 'Add Assignment', value: 'assignment' },
            { label: 'Add Test', value: 'test' },
          ]}
          labelField="label"
          valueField="value"
          placeholder="Select option"
          value={dropdownValue}
          onChange={(item) => setDropdownValue(item.value)}
        />
        <LinearGradient
                      colors={['#818cf8', '#6366f1']}   // violet shades
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}              // left → right
                      style={styles.sideButton}
                    >
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => dropdownValue && setModalVisible(true)}
        >
          <Text style={styles.sideButtonText}>＋</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {dropdownValue === 'assignment' ? 'Add Assignment' : 'Add Test'}
            </Text>

            {/* Assignment Form */}
            {dropdownValue === 'assignment' && (
              <>
                {/* Course Dropdown */}
                <Dropdown
                  style={styles.input}
                  data={data.assignments.map((c) => ({ label: c.course, value: c.course }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Course"
                  value={selectedCourse}
                  onChange={(item) => {
                    setSelectedCourse(item.value);
                    setSelectedTopic(null);
                  }}
                />

                {/* Topic Dropdown */}
                {selectedCourse && (
                  <Dropdown
                    style={styles.input}
                    data={topicsForSelectedCourse.map((t) => ({ label: t.topic, value: t.topic }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Topic (Assignment Title)"
                    value={selectedTopic}
                    onChange={(item) => setSelectedTopic(item.value)}
                  />
                )}

                {/* Assignment Link */}
                <TextInput
                  style={styles.input}
                  placeholder="Assignment Link"
                  placeholderTextColor="#999"
                  value={assignmentLink}
                  onChangeText={setAssignmentLink}
                />

                {/* Due Date Picker */}
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setOpenDatePicker(true)}
                >
                  <Text style={{ color: '#000' }}>
                    Due Date: {dueDate.toDateString()}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openDatePicker}
                  date={dueDate}
                  onConfirm={(date) => {
                    setOpenDatePicker(false);
                    setDueDate(date);
                  }}
                  onCancel={() => setOpenDatePicker(false)}
                  mode="date"
                />
              </>
            )}

            {/* Test Form */}
            {dropdownValue === 'test' && (
              <>
                {/* Course Dropdown */}
                <Dropdown
                  style={styles.input}
                  data={data.tests.map((c) => ({ label: c.course, value: c.course }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Course"
                  value={testCourse}
                  onChange={(item) => {
                    setTestCourse(item.value);
                    setTestTopic(null);
                  }}
                />

                {/* Topic Dropdown */}
                {testCourse && (
                  <Dropdown
                    style={styles.input}
                    data={topicsForTestCourse.map((t) => ({ label: t.topic, value: t.topic }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Topic"
                    value={testTopic}
                    onChange={(item) => setTestTopic(item.value)}
                  />
                )}

                {/* Total Marks */}
                <TextInput
                  style={styles.input}
                  placeholder="Total Marks"
                  placeholderTextColor="#999"
                  value={totalMarks}
                  onChangeText={setTotalMarks}
                  keyboardType="numeric"
                />

                {/* Test Date Picker */}
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setOpenTestDatePicker(true)}
                >
                  <Text style={{ color: '#000' }}>
                    Test Date: {testDate.toDateString()}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openTestDatePicker}
                  date={testDate}
                  onConfirm={(date) => {
                    setOpenTestDatePicker(false);
                    setTestDate(date);
                  }}
                  onCancel={() => setOpenTestDatePicker(false)}
                  mode="date"
                />

                {/* Duration */}
                <TextInput
                  style={styles.input}
                  placeholder="Duration (e.g., 2 hours)"
                  placeholderTextColor="#999"
                  value={duration}
                  onChangeText={setDuration}
                />

                {/* Test Link */}
                <TextInput
                  style={styles.input}
                  placeholder="Test Link"
                  placeholderTextColor="#999"
                  value={testLink}
                  onChangeText={setTestLink}
                />
              </>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={dropdownValue === 'assignment' ? handleSaveAssignment : handleSaveTest}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pending Checkings Section */}
      <Text style={styles.sectionTitle}>Pending Checkings</Text>
      {pendingArray.map((course, courseIndex) => (
        <View key={`pending-${courseIndex}`} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleExpand('pending', courseIndex)}
          >
            <Text style={styles.courseTitle}>
              {course.type}: {course.course}
            </Text>
          </TouchableOpacity>

          {expandedPending[courseIndex] &&
            course.topics.map((topic, topicIndex) => (
              <View
                key={`pending-topic-${topicIndex}`}
                style={styles.topicContainer}
              >
                <TouchableOpacity
                  onPress={() =>
                    toggleTopicExpand('pending', courseIndex, topicIndex)
                  }
                >
                  <Text style={styles.topicTitle}>{topic.topic}</Text>
                </TouchableOpacity>

                {expandedPendingTopics[`${courseIndex}-${topicIndex}`] &&
                  topic.subtopics.map((sub, subIndex) => (
                    <View
                      key={`pending-sub-${subIndex}`}
                      style={styles.subtopicContainer}
                    >
                      <Text style={styles.subtopicTitle}>{sub.subtopic}</Text>
                      <Text style={{ color: '#000' }}>
                         Submitted by: {sub.students.join(', ') || 'None'}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
        </View>
      ))}

      {/* Assignments Section */}
      <Text style={styles.sectionTitle}>Assignments</Text>
      {data.assignments.map((course, courseIndex) => (
        <View key={`assign-${courseIndex}`} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleExpand('assignment', courseIndex)}
          >
            <Text style={styles.courseTitle}>{course.course}</Text>
          </TouchableOpacity>

          {expandedAssignments[courseIndex] &&
            course.topics.map((topic, topicIndex) => (
              <View
                key={`assign-topic-${topicIndex}`}
                style={styles.topicContainer}
              >
                <TouchableOpacity
                  onPress={() =>
                    toggleTopicExpand('assignment', courseIndex, topicIndex)
                  }
                >
                  <Text style={styles.topicTitle}>{topic.topic}</Text>
                </TouchableOpacity>

                {expandedAssignmentTopics[`${courseIndex}-${topicIndex}`] &&
                  topic.subtopics.map((sub, subIndex) => (
                    <View
                      key={`assign-sub-${subIndex}`}
                      style={styles.subtopicContainer}
                    >
                      <Text style={styles.subtopicTitle}>{sub.subtopic}</Text>
                      <Text style={{ color: '#000' }}>
                        ✅ Completed by: {sub.completedBy.join(', ') || 'None'}
                      </Text>
                      <Text style={{ color: '#000' }}>
                        📝 Appeared by: {sub.appearedBy.join(', ') || 'None'}
                      </Text>
                      <Text style={{ color: '#000' }}>
                        📌 Remaining: {sub.remaining.join(', ') || 'None'}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
        </View>
      ))}

      {/* Tests Section */}
      <Text style={styles.sectionTitle}>Tests</Text>
      {data.tests.map((course, courseIndex) => (
        <View key={`test-${courseIndex}`} style={styles.card}>
          <TouchableOpacity onPress={() => toggleExpand('test', courseIndex)}>
            <Text style={styles.courseTitle}>{course.course}</Text>
          </TouchableOpacity>

          {expandedTests[courseIndex] &&
            course.topics.map((topic, topicIndex) => (
              <View
                key={`test-topic-${topicIndex}`}
                style={styles.topicContainer}
              >
                <TouchableOpacity
                  onPress={() =>
                    toggleTopicExpand('test', courseIndex, topicIndex)
                  }
                >
                  <Text style={styles.topicTitle}>{topic.topic}</Text>
                </TouchableOpacity>

                {expandedTestTopics[`${courseIndex}-${topicIndex}`] &&
                  topic.subtopics.map((sub, subIndex) => (
                    <View
                      key={`test-sub-${subIndex}`}
                      style={styles.subtopicContainer}
                    >
                      <Text style={styles.subtopicTitle}>{sub.subtopic}</Text>
                      <Text style={{ color: '#000' }}>🏆 Scores:</Text>
                      {sub.scores.map((s, i) => (
                        <Text style={{ color: '#000' }} key={i}>
                          {s.student}: {s.score}%
                        </Text>
                      ))}
                      <Text style={{ color: '#000' }}>
                        📌 Remaining: {sub.remaining.join(', ') || 'None'}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
        </View>
        
      ))}
    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,  padding: 16 },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 4, 
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 ,color: '#000',},
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  courseTitle: { fontSize: 16, fontWeight: '600', color: '#4f46e5' },
  topicContainer: { marginLeft: 12, marginTop: 6, },
  topicTitle: { fontSize: 15, fontWeight: '500', color: '#6b7280', },
  subtopicContainer: {
    marginLeft: 12,
    marginTop: 4,
    padding: 6,
    backgroundColor: '#eef2ff',
    borderRadius: 6,
  },
  subtopicTitle: { fontWeight: '600', color: '#4338ca' },
  sideButton: {
    //backgroundColor: '#6366f1',
    width: 40,
  height: 43,
  marginLeft: 8,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
    
  },
  sideButtonText: { fontSize: 20, color: '#fff' , textAlign: 'center', marginRight: 7,},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
    color: '#000',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  width: '100%',
},

saveText: {
  color: '#16a34a',   // green for save
  fontWeight: '600',
  fontSize: 16,
},

closeText: {
  color: '#ef4444',   // red for close
  fontWeight: '600',
  fontSize: 16,
},


  closeButtonText: { color: '#fff', fontWeight: '600' },
});

export default AssignmentsTestsScreen;
