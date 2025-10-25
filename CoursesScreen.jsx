import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';


const MOCK_COURSES = [
  {
    course_id: 'course001',
    course_name: 'Introduction to Programming',
    course_description:
      'This course introduces the fundamentals of programming including syntax, logic, and problem solving.',
    start_date: '2025-02-01',
    end_date: '2025-06-01',
    image: require('./IMAGES/intro_prgm.jpg'),
    topics: [
      {
        topic_id: 'topic001',
        topic_title: 'Variables & Data Types',
        topic_duration: '2 hours',
        topic_description: 'Basics of variables, types, and simple operations.',
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
        topic_title: 'Control Flow',
        topic_duration: '3 hours',
        topic_description: 'Ifs, loops, and branching logic.',
        subtopics: [
          {
            subtopic_id: 'sub003',
            subtopic_title: 'Conditional Statements',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/conditionals',
            subtopic_documentation: 'https://docs.example.com/conditionals',
            subtopic_description: 'if/else, switch-case patterns.',
          },
          {
            subtopic_id: 'sub004',
            subtopic_title: 'Loops',
            subtopic_duration: '2 hours',
            video_link: 'https://example.com/loops',
            subtopic_documentation: 'https://docs.example.com/loops',
            subtopic_description: 'For, while, and nested loops.',
          },
        ],
      },
    ],
  },
  {
    course_id: 'course002',
    course_name: 'Advanced JavaScript',
    course_description:
      'Deep dive into modern JavaScript concepts, async programming, and advanced techniques.',
    start_date: '2025-03-01',
    end_date: '2025-07-01',
    image: require('./IMAGES/java_sc1.png'),
    topics: [
      {
        topic_id: 'topic101',
        topic_title: 'Asynchronous JS',
        topic_duration: '4 hours',
        topic_description:
          'Understanding promises, async/await, and callbacks.',
        subtopics: [
          {
            subtopic_id: 'sub101',
            subtopic_title: 'Promises',
            subtopic_duration: '1.5 hours',
            video_link: 'https://example.com/promises',
            subtopic_documentation: 'https://docs.example.com/promises',
            subtopic_description: 'Learn how to work with JS promises.',
          },
          {
            subtopic_id: 'sub102',
            subtopic_title: 'Async/Await',
            subtopic_duration: '2 hours',
            video_link: 'https://example.com/async-await',
            subtopic_documentation: 'https://docs.example.com/async-await',
            subtopic_description: 'Simplify async code using async/await.',
          },
        ],
      },
      {
        topic_id: 'topic102',
        topic_title: 'JavaScript ES6+ Features',
        topic_duration: '3 hours',
        topic_description: 'Explore new syntax and functionalities in modern JS.',
        subtopics: [
          {
            subtopic_id: 'sub103',
            subtopic_title: 'Arrow Functions',
            subtopic_duration: '30 mins',
            video_link: 'https://example.com/arrow-functions',
            subtopic_documentation: 'https://docs.example.com/arrow-functions',
            subtopic_description: 'Concise function syntax using arrow notation.',
          },
          {
            subtopic_id: 'sub104',
            subtopic_title: 'Destructuring',
            subtopic_duration: '45 mins',
            video_link: 'https://example.com/destructuring',
            subtopic_documentation: 'https://docs.example.com/destructuring',
            subtopic_description: 'Easier extraction from objects and arrays.',
          },
        ],
      },
    ],
  },
];

const CoursesScreen = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  const [selectedAction, setSelectedAction] = useState(null); // Add / Edit
  const [modalVisible, setModalVisible] = useState(false);

  // Date pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  // Dynamic form fields
  const [courseForm, setCourseForm] = useState({
    courseId: '',
    courseName: '',
    courseDuration: '',
    courseDescription: '',
    courseImage: '',
    topics: [
      {
        topicId: '',
        topicTitle: '',
        topicDuration: '',
        topicDescription: '',
        subtopics: [
          { subtopicId: '', subtopicTitle: '', subtopicDuration: '', videoLink: '', docLink: '', subtopicDescription: '' },
        ],
      },
    ],
  });

  const actionOptions = [
    { label: 'Add Course', value: 'add' },
    { label: 'Edit Course', value: 'edit' },
  ];

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourse = id => {
    setExpandedCourseId(prev => (prev === id ? null : id));
    setExpandedTopicId(null);
  };

  const toggleTopic = id => {
    setExpandedTopicId(prev => (prev === id ? null : id));
  };

  const handlePlusClick = () => {
    if (selectedAction === 'add') {
      setModalVisible(true);
    } else if (selectedAction === 'edit') {
      setModalVisible(true);
    } else {
      alert('Please select Add Course or Edit Course.');
    }
  };

  // Add new topic
  const addTopic = () => {
    setCourseForm(prev => ({
      ...prev,
      topics: [...prev.topics, { topicId: '', topicTitle: '', topicDuration: '', topicDescription: '', subtopics: [{ subtopicId: '', subtopicTitle: '', subtopicDuration: '', videoLink: '', docLink: '', subtopicDescription: '' }] }],
    }));
  };

  // Add new subtopic
  const addSubtopic = (topicIndex) => {
    const topics = [...courseForm.topics];
    topics[topicIndex].subtopics.push({ subtopicId: '', subtopicTitle: '', subtopicDuration: '', videoLink: '', docLink: '', subtopicDescription: '' });
    setCourseForm(prev => ({ ...prev, topics }));
  };

  const handleSave = () => {
    const newCourse = {
      course_id: courseForm.courseId || `course${courses.length + 1}`,
      course_name: courseForm.courseName,
      course_description: courseForm.courseDescription,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      image: courseForm.courseImage ? { uri: courseForm.courseImage } : null,
      topics: courseForm.topics.map(topic => ({
        topic_id: topic.topicId || `topic${Date.now() + Math.random()}`,
        topic_title: topic.topicTitle,
        topic_duration: topic.topicDuration,
        topic_description: topic.topicDescription,
        subtopics: topic.subtopics.map(sub => ({
          subtopic_id: sub.subtopicId || `sub${Date.now() + Math.random()}`,
          subtopic_title: sub.subtopicTitle,
          subtopic_duration: sub.subtopicDuration,
          video_link: sub.videoLink,
          subtopic_documentation: sub.docLink,
          subtopic_description: sub.subtopicDescription,
        })),
      })),
    };

    if (selectedAction === 'edit') {
      // Replace existing course
      setCourses(prev =>
        prev.map(c => (c.course_id === newCourse.course_id ? newCourse : c))
      );
    } else {
      // Add new course
      setCourses(prev => [...prev, newCourse]);
    }

    setModalVisible(false);

    // Reset form
    setCourseForm({
      courseId: '',
      courseName: '',
      courseDuration: '',
      courseDescription: '',
      courseImage: '',
      topics: [
        {
          topicId: '',
          topicTitle: '',
          topicDuration: '',
          topicDescription: '',
          subtopics: [
            {
              subtopicId: '',
              subtopicTitle: '',
              subtopicDuration: '',
              videoLink: '',
              docLink: '',
              subtopicDescription: '',
            },
          ],
        },
      ],
    });
  };


  return (
    <LinearGradient colors={['#89b9f9ff', '#a9bdd9ff', '#f9fafb']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.header}>Courses</Text>

          <View style={styles.inputRow}>
            <Dropdown
              style={[styles.input, { flex: 1 }]}
              data={actionOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Action"
              value={selectedAction}
              onChange={item => setSelectedAction(item.value)}
            />
            <LinearGradient
              colors={['#818cf8', '#6366f1']}   // violet shades
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}              // left → right
              style={styles.sideButton}
            >
              <TouchableOpacity onPress={handlePlusClick} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={styles.sideButtonText}>＋</Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Search courses"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.input, { flex: 1 }]}
            />
            <LinearGradient
              colors={['#818cf8', '#6366f1']}   // violet shades
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}              // left → right
              style={styles.sideButton}
            >
              <TouchableOpacity onPress={() => { }} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={styles.sideButtonText}>🔍</Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>

          {filteredCourses.map(course => (
            <View key={course.course_id} style={styles.courseCard}>
              <TouchableOpacity onPress={() => toggleCourse(course.course_id)}>
                <View>
                  {course.image && <Image source={course.image} style={styles.courseImage} />}
                  <Text style={styles.courseTitle}>{course.course_name}</Text>
                  <Text style={styles.courseMeta}>{course.start_date} → {course.end_date}</Text>
                  <Text style={styles.courseDesc}>{course.course_description}</Text>
                </View>
              </TouchableOpacity>

              {expandedCourseId === course.course_id &&
                course.topics.map(topic => (
                  <View key={topic.topic_id} style={styles.topicBlock}>
                    <TouchableOpacity onPress={() => toggleTopic(topic.topic_id)}>
                      <View>
                        <Text style={styles.topicTitle}>{topic.topic_title}</Text>
                        <Text style={styles.topicMeta}>{topic.topic_duration}</Text>
                      </View>
                    </TouchableOpacity>

                    {expandedTopicId === topic.topic_id && (
                      <View>
                        <Text style={styles.topicDesc}>{topic.topic_description}</Text>
                        {topic.subtopics.map(sub => (
                          <View key={sub.subtopic_id} style={styles.subtopicBlock}>
                            <Text style={styles.subtopicTitle}>{sub.subtopic_title}</Text>
                            <Text style={styles.subtopicMeta}>{sub.subtopic_duration}</Text>
                            <Text style={styles.subtopicDesc}>{sub.subtopic_description}</Text>
                            <Text style={styles.link}>{sub.video_link}</Text>
                            <Text style={styles.link}>{sub.subtopic_documentation}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
            </View>
          ))}

          {filteredCourses.length === 0 && <Text style={styles.noMatch}>No courses found.</Text>}
        </ScrollView>

        {/* Add Course Modal */}
        <Modal visible={modalVisible} animationType="slide">
          <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.modalHeader}>
              {selectedAction === 'edit' ? 'Edit Course' : 'Add Course'}
            </Text>

            {selectedAction === 'edit' ? (
              <Dropdown
                style={styles.input}
                data={courses.map(c => ({ label: c.course_id, value: c.course_id }))}
                labelField="label"
                valueField="value"
                placeholder="Select Course ID"
                value={courseForm.courseId}
                onChange={item => {
                  setCourseForm(prev => ({ ...prev, courseId: item.value }));

                  // Autofill form fields based on selected course
                  const selectedCourse = courses.find(c => c.course_id === item.value);
                  if (selectedCourse) {
                    setCourseForm({
                      courseId: selectedCourse.course_id,
                      courseName: selectedCourse.course_name,
                      courseDuration: "", // optional
                      courseDescription: selectedCourse.course_description,
                      courseImage: "",
                      topics: selectedCourse.topics.map(t => ({
                        topicId: t.topic_id,
                        topicTitle: t.topic_title,
                        topicDuration: t.topic_duration,
                        topicDescription: t.topic_description,
                        subtopics: t.subtopics.map(s => ({
                          subtopicId: s.subtopic_id,
                          subtopicTitle: s.subtopic_title,
                          subtopicDuration: s.subtopic_duration,
                          videoLink: s.video_link,
                          docLink: s.subtopic_documentation,
                          subtopicDescription: s.subtopic_description,
                        })),
                      })),
                    });
                  }
                }}
              />
            ) : (
              <TextInput
                placeholder="Course ID"
                placeholderTextColor="#6b7280"
                style={styles.input}
                value={courseForm.courseId}
                onChangeText={text =>
                  setCourseForm(prev => ({ ...prev, courseId: text }))
                }
              />
            )}

            <TextInput placeholder="Course Name" placeholderTextColor="#6b7280" style={styles.input} value={courseForm.courseName} onChangeText={text => setCourseForm(prev => ({ ...prev, courseName: text }))} />
            <TextInput placeholder="Duration" placeholderTextColor="#6b7280" style={styles.input} value={courseForm.courseDuration} onChangeText={text => setCourseForm(prev => ({ ...prev, courseDuration: text }))} />
            <TextInput placeholder="Description" placeholderTextColor="#6b7280" style={styles.input} multiline value={courseForm.courseDescription} onChangeText={text => setCourseForm(prev => ({ ...prev, courseDescription: text }))} />
            <TouchableOpacity style={styles.input} onPress={() => setOpenStartDate(true)}>
              <Text>{`Start Date: ${startDate.toISOString().split('T')[0]}`}</Text>
            </TouchableOpacity>
            <DatePicker modal mode="date" open={openStartDate} date={startDate} onConfirm={date => { setOpenStartDate(false); setStartDate(date); }} onCancel={() => setOpenStartDate(false)} />
            <TouchableOpacity style={styles.input} onPress={() => setOpenEndDate(true)}>
              <Text>{`End Date: ${endDate.toISOString().split('T')[0]}`}</Text>
            </TouchableOpacity>
            <DatePicker modal mode="date" open={openEndDate} date={endDate} onConfirm={date => { setOpenEndDate(false); setEndDate(date); }} onCancel={() => setOpenEndDate(false)} />
            <TextInput placeholder="Course Image URL" placeholderTextColor="#6b7280" style={styles.input} value={courseForm.courseImage} onChangeText={text => setCourseForm(prev => ({ ...prev, courseImage: text }))} />

            {courseForm.topics.map((topic, topicIndex) => (
              <View key={topicIndex}>
                <Text style={styles.subHeader}>Topic {topicIndex + 1}</Text>
                <TextInput placeholder="Topic ID" placeholderTextColor="#6b7280" style={styles.input} value={topic.topicId} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].topicId = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                <TextInput placeholder="Topic Title" placeholderTextColor="#6b7280" style={styles.input} value={topic.topicTitle} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].topicTitle = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                <TextInput placeholder="Duration" placeholderTextColor="#6b7280" style={styles.input} value={topic.topicDuration} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].topicDuration = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                <TextInput placeholder="Description" placeholderTextColor="#6b7280" style={styles.input} multiline value={topic.topicDescription} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].topicDescription = text; setCourseForm(prev => ({ ...prev, topics })); }} />

                {topic.subtopics.map((sub, subIndex) => (
                  <View key={subIndex}>
                    <Text style={{ fontWeight: '600', marginTop: 10 }}>SubTopic {subIndex + 1}</Text>
                    <TextInput placeholder="SubTopic ID" placeholderTextColor="#6b7280" style={styles.input} value={sub.subtopicId} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].subtopicId = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TextInput placeholder="Title" placeholderTextColor="#6b7280" style={styles.input} value={sub.subtopicTitle} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].subtopicTitle = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TextInput placeholder="Duration" placeholderTextColor="#6b7280" style={styles.input} value={sub.subtopicDuration} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].subtopicDuration = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TextInput placeholder="Video Link" placeholderTextColor="#6b7280" style={styles.input} value={sub.videoLink} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].videoLink = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TextInput placeholder="Documentation Link" placeholderTextColor="#6b7280" style={styles.input} value={sub.docLink} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].docLink = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TextInput placeholder="Description" placeholderTextColor="#6b7280" style={styles.input} multiline value={sub.subtopicDescription} onChangeText={text => { const topics = [...courseForm.topics]; topics[topicIndex].subtopics[subIndex].subtopicDescription = text; setCourseForm(prev => ({ ...prev, topics })); }} />
                    <TouchableOpacity onPress={() => addSubtopic(topicIndex)}>
                      <Text style={{ color: '#6366f1', marginBottom: 10 }}>＋ Add SubTopic</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity onPress={addTopic}>
                  <Text style={{ color: '#6366f1', marginBottom: 10 }}>＋ Add Topic</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={{ color: '#6366f1', fontSize: 16, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, },
  inner: { padding: 20 },
  header: {
    fontSize: 24, fontWeight: '700',
    marginBottom: 20,
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 12,
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sideButton: {
    height: 50,          // match dropdown/input height
    marginTop: -11,
    backgroundColor: '#6366f1',
    padding: 14,
    marginLeft: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  courseTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  courseMeta: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  courseDesc: { fontSize: 13, color: '#000', marginTop: 6 },
  topicBlock: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftColor: '#ddd',
    borderLeftWidth: 2,
  },
  topicTitle: { fontSize: 15, fontWeight: '600', color: '#000' },
  topicMeta: { fontSize: 12, color: '#6b7280' },
  topicDesc: { fontSize: 13, color: '#374151', marginVertical: 4 },
  subtopicBlock: {
    backgroundColor: '#f9f9fb',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  subtopicTitle: { fontSize: 14, fontWeight: '600', color: '#000' },
  subtopicMeta: { fontSize: 12, color: '#6b7280' },
  subtopicDesc: { fontSize: 13, marginTop: 4, color: '#6b7280' },
  link: { fontSize: 12, color: '#2563eb', marginTop: 2 },
  noMatch: { fontSize: 14, fontStyle: 'italic', color: '#999', textAlign: 'center' },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  modalHeader: {
    fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#000', textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subHeader: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#000' },
});
