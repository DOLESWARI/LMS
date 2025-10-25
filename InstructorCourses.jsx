import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Linking,
  Image,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MOCK_COURSES = [
  {
    course_id: 'course001',
    course_name: 'Introduction to Programming',
    course_description: 'Learn programming basics, syntax, logic, and problem solving.',
    start_date: '2025-02-01',
    end_date: '2025-06-01',
    image: require('./IMAGES/intro_prgm.jpg'),
    topics: [
      {
        topic_id: 'topic001',
        topic_title: 'Variables & Data Types',
        topic_duration: '2 hours',
        topic_description: 'Basics of variables, types, and operations.',
        subtopics: [
          {
            subtopic_id: 'sub001',
            subtopic_title: 'Primitive Types',
            subtopic_duration: '45 mins',
            video_link: 'https://example.com/primitive-types',
            subtopic_documentation: 'https://docs.example.com/primitive-types',
            subtopic_description: 'Understanding number, string, boolean.',
          },
          {
            subtopic_id: 'sub002',
            subtopic_title: 'Type Conversion',
            subtopic_duration: '30 mins',
            video_link: 'https://example.com/type-conversion',
            subtopic_documentation: 'https://docs.example.com/type-conversion',
            subtopic_description: 'Implicit and explicit conversions.',
          },
        ],
      },
      {
        topic_id: 'topic002',
        topic_title: 'Control Structures',
        topic_duration: '3 hours',
        topic_description: 'Learn about if-else, loops, and switch cases.',
        subtopics: [
          {
            subtopic_id: 'sub003',
            subtopic_title: 'Conditional Statements',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/conditionals',
            subtopic_documentation: 'https://docs.example.com/conditionals',
            subtopic_description: 'Decision making with if, else, switch.',
          },
          {
            subtopic_id: 'sub004',
            subtopic_title: 'Loops',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/loops',
            subtopic_documentation: 'https://docs.example.com/loops',
            subtopic_description: 'For, While, and Do-While loops.',
          },
        ],
      },
    ],
  },
  {
    course_id: 'course002',
    course_name: 'Web Development Fundamentals',
    course_description: 'Build interactive websites using HTML, CSS, and JavaScript.',
    start_date: '2025-03-01',
    end_date: '2025-07-01',
    image: require('./IMAGES/web_dev.jpg'),
    topics: [
      {
        topic_id: 'topic101',
        topic_title: 'HTML Basics',
        topic_duration: '2 hours',
        topic_description: 'Learn structure and semantic elements of web pages.',
        subtopics: [
          {
            subtopic_id: 'sub101',
            subtopic_title: 'HTML Structure',
            subtopic_duration: '45 mins',
            video_link: 'https://example.com/html-structure',
            subtopic_documentation: 'https://docs.example.com/html-structure',
            subtopic_description: 'Head, body, elements, and attributes.',
          },
          {
            subtopic_id: 'sub102',
            subtopic_title: 'Forms & Inputs',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/html-forms',
            subtopic_documentation: 'https://docs.example.com/html-forms',
            subtopic_description: 'Collecting user input with forms.',
          },
        ],
      },
      {
        topic_id: 'topic102',
        topic_title: 'CSS Styling',
        topic_duration: '3 hours',
        topic_description: 'Style web pages with CSS.',
        subtopics: [
          {
            subtopic_id: 'sub103',
            subtopic_title: 'Selectors & Properties',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/css-selectors',
            subtopic_documentation: 'https://docs.example.com/css-selectors',
            subtopic_description: 'Target and style HTML elements.',
          },
          {
            subtopic_id: 'sub104',
            subtopic_title: 'Flexbox & Grid',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/css-layouts',
            subtopic_documentation: 'https://docs.example.com/css-layouts',
            subtopic_description: 'Modern layout techniques.',
          },
        ],
      },
    ],
  },
  {
    course_id: 'course003',
    course_name: 'Data Structures & Algorithms',
    course_description: 'Master arrays, linked lists, trees, graphs, and algorithm design.',
    start_date: '2025-04-01',
    end_date: '2025-08-01',
    image: require('./IMAGES/dsa.jpg'),
    topics: [
      {
        topic_id: 'topic201',
        topic_title: 'Arrays & Strings',
        topic_duration: '3 hours',
        topic_description: 'Understand arrays and string manipulations.',
        subtopics: [
          {
            subtopic_id: 'sub201',
            subtopic_title: 'Array Operations',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/arrays',
            subtopic_documentation: 'https://docs.example.com/arrays',
            subtopic_description: 'Insert, delete, search in arrays.',
          },
          {
            subtopic_id: 'sub202',
            subtopic_title: 'String Manipulation',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/strings',
            subtopic_documentation: 'https://docs.example.com/strings',
            subtopic_description: 'Reversals, substring, pattern matching.',
          },
        ],
      },
      {
        topic_id: 'topic202',
        topic_title: 'Trees & Graphs',
        topic_duration: '4 hours',
        topic_description: 'Non-linear data structures.',
        subtopics: [
          {
            subtopic_id: 'sub203',
            subtopic_title: 'Binary Trees',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/trees',
            subtopic_documentation: 'https://docs.example.com/trees',
            subtopic_description: 'Traversal, insertion, deletion.',
          },
          {
            subtopic_id: 'sub204',
            subtopic_title: 'Graph Algorithms',
            subtopic_duration: '2 hours',
            video_link: 'https://example.com/graphs',
            subtopic_documentation: 'https://docs.example.com/graphs',
            subtopic_description: 'DFS, BFS, shortest path algorithms.',
          },
        ],
      },
    ],
  },
  {
    course_id: 'course004',
    course_name: 'Machine Learning Basics',
    course_description: 'Introduction to ML concepts, algorithms, and real-world applications.',
    start_date: '2025-05-01',
    end_date: '2025-09-01',
    image: require('./IMAGES/ml_basics.jpg'),
    topics: [
      {
        topic_id: 'topic301',
        topic_title: 'ML Foundations',
        topic_duration: '3 hours',
        topic_description: 'Core ideas behind machine learning.',
        subtopics: [
          {
            subtopic_id: 'sub301',
            subtopic_title: 'Supervised vs Unsupervised',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/supervised-unsupervised',
            subtopic_documentation: 'https://docs.example.com/supervised-unsupervised',
            subtopic_description: 'Difference between supervised and unsupervised ML.',
          },
          {
            subtopic_id: 'sub302',
            subtopic_title: 'Training & Testing',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/train-test',
            subtopic_documentation: 'https://docs.example.com/train-test',
            subtopic_description: 'Splitting data for validation.',
          },
        ],
      },
      {
        topic_id: 'topic302',
        topic_title: 'ML Algorithms',
        topic_duration: '4 hours',
        topic_description: 'Learn about core ML algorithms.',
        subtopics: [
          {
            subtopic_id: 'sub303',
            subtopic_title: 'Linear Regression',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/linear-regression',
            subtopic_documentation: 'https://docs.example.com/linear-regression',
            subtopic_description: 'Prediction using regression models.',
          },
          {
            subtopic_id: 'sub304',
            subtopic_title: 'Decision Trees',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/decision-trees',
            subtopic_documentation: 'https://docs.example.com/decision-trees',
            subtopic_description: 'Classification using tree-based models.',
          },
        ],
      },
    ],
  },
];


const CoursesScreen = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCoursePress = (course) => {
    setSelectedCourse(course);
    setExpandedTopicId(null);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setExpandedTopicId(null);
    setShowEditModal(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    // Save changes to state
    const updatedCourses = courses.map((c) =>
      c.course_id === selectedCourse.course_id ? selectedCourse : c
    );
    setCourses(updatedCourses);
    alert('Changes Saved ✅');
    setShowEditModal(false);
  };

  // Add Topic
  const addTopic = () => {
    const newTopic = {
      topic_id: `topic${Date.now()}`,
      topic_title: '',
      topic_duration: '',
      topic_description: '',
      subtopics: [],
    };
    setSelectedCourse({
      ...selectedCourse,
      topics: [...selectedCourse.topics, newTopic],
    });
  };

  // Remove Topic
  const removeTopic = (tIndex) => {
    const updatedTopics = selectedCourse.topics.filter((_, i) => i !== tIndex);
    setSelectedCourse({ ...selectedCourse, topics: updatedTopics });
  };

  // Add Subtopic
  const addSubtopic = (tIndex) => {
    const newSub = {
      subtopic_id: `sub${Date.now()}`,
      subtopic_title: '',
      subtopic_duration: '',
      video_link: '',
      subtopic_documentation: '',
      subtopic_description: '',
    };
    const updated = [...selectedCourse.topics];
    updated[tIndex].subtopics.push(newSub);
    setSelectedCourse({ ...selectedCourse, topics: updated });
  };

  // Remove Subtopic
  const removeSubtopic = (tIndex, sIndex) => {
    const updated = [...selectedCourse.topics];
    updated[tIndex].subtopics = updated[tIndex].subtopics.filter((_, i) => i !== sIndex);
    setSelectedCourse({ ...selectedCourse, topics: updated });
  };

  return (
    <LinearGradient
          colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']}
          style={{ flex: 1 }}
        >
    <View style={styles.container}>
      <Text style={styles.heading}>Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCoursePress(item)}
          >
            <Image source={item.image} style={styles.courseImage} />
            <Text style={styles.courseTitle}>{item.course_name}</Text>
            <Text style={styles.courseDescription}>{item.course_description}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Course Details Modal */}
      <Modal visible={!!selectedCourse && !showEditModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image source={selectedCourse?.image} style={styles.modalCourseImage} />
              <Text style={styles.modalHeading}>{selectedCourse?.course_name}</Text>
              <Text style={styles.courseDescription}>{selectedCourse?.course_description}</Text>

              {selectedCourse?.topics.map((topic) => (
                <View key={topic.topic_id} style={styles.topicContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedTopicId(
                        expandedTopicId === topic.topic_id ? null : topic.topic_id
                      )
                    }
                  >
                    <Text style={styles.topicTitle}>{topic.topic_title}</Text>
                    <Text style={styles.topicDescription}>{topic.topic_description}</Text>
                  </TouchableOpacity>

                  {expandedTopicId === topic.topic_id && (
                    <View style={styles.subtopicList}>
                      {topic.subtopics.map((sub) => (
                        <View key={sub.subtopic_id} style={styles.subtopicCard}>
                          <Text style={styles.subtopicTitle}>{sub.subtopic_title}</Text>
                          <Text style={styles.subtopicMeta}>Duration: {sub.subtopic_duration}</Text>
                          <Text style={styles.subtopicDesc}>{sub.subtopic_description}</Text>
                          <Text
                            style={styles.subtopicLink}
                            onPress={() => Linking.openURL(sub.video_link)}
                          >
                            📺 Watch Video
                          </Text>
                          <Text
                            style={styles.subtopicLink}
                            onPress={() => Linking.openURL(sub.subtopic_documentation)}
                          >
                            📄 Documentation
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.footerButton} onPress={handleCloseModal}>
                <Text style={styles.footerButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.editButton]}
                onPress={handleEdit}
              >
                <Text style={styles.footerButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.editModal}>
          <ScrollView>
            <Text style={styles.modalHeading}>Edit Course</Text>

            {/* Course Fields */}
            <TextInput
              style={styles.input}
              value={selectedCourse?.course_name}
              onChangeText={(text) =>
                setSelectedCourse({ ...selectedCourse, course_name: text })
              }
              placeholder="Course Subject"
            />
            <TextInput
              style={styles.input}
              value={selectedCourse?.course_description}
              onChangeText={(text) =>
                setSelectedCourse({ ...selectedCourse, course_description: text })
              }
              placeholder="Description"
              multiline
            />
            <TextInput
              style={styles.input}
              value={selectedCourse?.start_date}
              onChangeText={(text) =>
                setSelectedCourse({ ...selectedCourse, start_date: text })
              }
              placeholder="Start Date"
            />
            <TextInput
              style={styles.input}
              value={selectedCourse?.end_date}
              onChangeText={(text) =>
                setSelectedCourse({ ...selectedCourse, end_date: text })
              }
              placeholder="End Date"
            />

            {/* Topics */}
            {selectedCourse?.topics.map((topic, tIndex) => (
              <View key={topic.topic_id} style={styles.editSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeading}>Topic {tIndex + 1}</Text>
                  <TouchableOpacity onPress={() => removeTopic(tIndex)}>
                    <Text style={styles.deleteText}>delete</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  value={topic.topic_title}
                  onChangeText={(text) => {
                    const updated = [...selectedCourse.topics];
                    updated[tIndex].topic_title = text;
                    setSelectedCourse({ ...selectedCourse, topics: updated });
                  }}
                  placeholder="Module Title"
                />

                <TextInput
                  style={styles.input}
                  value={topic.topic_duration}
                  onChangeText={(text) => {
                    const updated = [...selectedCourse.topics];
                    updated[tIndex].topic_duration = text;
                    setSelectedCourse({ ...selectedCourse, topics: updated });
                  }}
                  placeholder="Duration"
                />

                <TextInput
                  style={styles.input}
                  value={topic.topic_description}
                  onChangeText={(text) => {
                    const updated = [...selectedCourse.topics];
                    updated[tIndex].topic_description = text;
                    setSelectedCourse({ ...selectedCourse, topics: updated });
                  }}
                  placeholder="Description"
                />

                {/* Subtopics */}
                {topic.subtopics.map((sub, sIndex) => (
                  <View key={sub.subtopic_id} style={styles.editSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeading}>
                        Subtopic {sIndex + 1}
                      </Text>
                      <TouchableOpacity onPress={() => removeSubtopic(tIndex, sIndex)}>
                        <Text style={styles.deleteText}>delete</Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.input}
                      value={sub.subtopic_title}
                      onChangeText={(text) => {
                        const updated = [...selectedCourse.topics];
                        updated[tIndex].subtopics[sIndex].subtopic_title = text;
                        setSelectedCourse({ ...selectedCourse, topics: updated });
                      }}
                      placeholder="Submodule Title"
                    />
                    <TextInput
                      style={styles.input}
                      value={sub.subtopic_duration}
                      onChangeText={(text) => {
                        const updated = [...selectedCourse.topics];
                        updated[tIndex].subtopics[sIndex].subtopic_duration = text;
                        setSelectedCourse({ ...selectedCourse, topics: updated });
                      }}
                      placeholder="Duration"
                    />
                    <TextInput
                      style={styles.input}
                      value={sub.video_link}
                      onChangeText={(text) => {
                        const updated = [...selectedCourse.topics];
                        updated[tIndex].subtopics[sIndex].video_link = text;
                        setSelectedCourse({ ...selectedCourse, topics: updated });
                      }}
                      placeholder="Video Link"
                    />
                    <TextInput
                      style={styles.input}
                      value={sub.subtopic_documentation}
                      onChangeText={(text) => {
                        const updated = [...selectedCourse.topics];
                        updated[tIndex].subtopics[sIndex].subtopic_documentation = text;
                        setSelectedCourse({ ...selectedCourse, topics: updated });
                      }}
                      placeholder="Documentation"
                    />
                    <TextInput
                      style={styles.input}
                      value={sub.subtopic_description}
                      onChangeText={(text) => {
                        const updated = [...selectedCourse.topics];
                        updated[tIndex].subtopics[sIndex].subtopic_description = text;
                        setSelectedCourse({ ...selectedCourse, topics: updated });
                      }}
                      placeholder="Description"
                      multiline
                    />
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addSubtopic(tIndex)}
                >
                  <Text style={styles.addButtonText}>+ Add Subtopic</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addTopic}>
              <Text style={styles.addButtonText}>+ Add Topic</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.footerButton} onPress={handleCloseModal}>
              <Text style={styles.footerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.editButton]}
              onPress={handleSaveChanges}
            >
              <Text style={styles.footerButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
    </LinearGradient>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  heading: { fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 16, color: '#000' ,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',  
    ShadowOffset: { width: 2, height: 2 },  
  textShadowRadius: 4, },
  courseCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  courseImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  courseTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  courseDescription: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', margin: 20, borderRadius: 8, padding: 16, maxHeight: '85%' },
  modalCourseImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  modalHeading: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 8 },
  topicContainer: { marginBottom: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  topicTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  topicDescription: { fontSize: 13, color: '#6b7280' },
  subtopicList: { marginTop: 8, paddingLeft: 12 },
  subtopicCard: { backgroundColor: '#f9fafb', padding: 8, borderRadius: 6, marginBottom: 6 },
  subtopicTitle: { fontSize: 14, fontWeight: '600', color: '#000' },
  subtopicMeta: { fontSize: 12, color: '#374151', marginTop: 2 },
  subtopicDesc: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  subtopicLink: { fontSize: 12, color: '#2563eb', textDecorationLine: 'underline', marginTop: 2 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  footerButton: { flex: 1, padding: 12, backgroundColor: '#6366f1', borderRadius: 6, marginHorizontal: 4 },
  footerButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  editButton: { backgroundColor: '#10b981' },
  editModal: { flex: 1, backgroundColor: '#fff', padding: 16 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, padding: 8, marginBottom: 8, fontSize: 14 },
  editSection: { backgroundColor: '#f9fafb', padding: 10, borderRadius: 8, marginVertical: 8 },
  sectionHeading: { fontWeight: '600', fontSize: 15, marginBottom: 6, color: '#111827' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deleteText: { color: 'red', fontSize: 14, fontWeight: 'bold' },
  addButton: { backgroundColor: '#e0e7ff', padding: 10, borderRadius: 6, marginVertical: 6 },
  addButtonText: { color: '#2563eb', fontWeight: '600', textAlign: 'center' },
});
