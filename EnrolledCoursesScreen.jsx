import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Local image import using require
const dummyCourses = [
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
        topic_description: 'If-else, loops, and switch statements.',
        subtopics: [
          {
            subtopic_id: 'sub003',
            subtopic_title: 'If-Else Statements',
            subtopic_duration: '1 hour',
            video_link: 'https://example.com/if-else',
            subtopic_documentation: 'https://docs.example.com/if-else',
            subtopic_description: 'Conditional branching in programs.',
          },
        ],
      },
    ],
  },
  {
    course_id: 'course002',
    course_name: 'JavaScript Advanced Concepts',
    course_description: 'Deep dive into closures, async programming, and ES6 features.',
    start_date: '2025-03-01',
    end_date: '2025-07-01',
    image: require('./IMAGES/java_sc1.png'), // ✅ use require for local image
    topics: [
      {
        topic_id: 'topic101',
        topic_title: 'Closures',
        topic_duration: '2 hours',
        topic_description: 'Understanding closures and scope.',
        subtopics: [
          {
            subtopic_id: 'sub101',
            subtopic_title: 'Definition',
            subtopic_duration: '30 mins',
            video_link: 'https://example.com/closures-def',
            subtopic_documentation: 'https://docs.example.com/closures-def',
            subtopic_description: 'What are closures and how they work.',
          },
        ],
      },
    ],
  },
];

export default function EnrolledCoursesScreen() {
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [expandedSubtopicId, setExpandedSubtopicId] = useState(null);

  // Simulated completed subtopics for progress
  const [completedSubtopics, setCompletedSubtopics] = useState({
    sub001: true,
    sub002: false,
    sub003: false,
    sub101: true,
  });

  const toggleCourseExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
    setExpandedTopicId(null);
    setExpandedSubtopicId(null);
  };

  const toggleTopicExpand = (topicId) => {
    setExpandedTopicId(expandedTopicId === topicId ? null : topicId);
    setExpandedSubtopicId(null);
  };

  const toggleSubtopicExpand = (subtopicId) => {
    setExpandedSubtopicId(expandedSubtopicId === subtopicId ? null : subtopicId);
  };

  const getCourseProgress = (course) => {
    let total = 0;
    let completed = 0;

    course.topics.forEach(topic => {
      topic.subtopics.forEach(sub => {
        total += 1;
        if (completedSubtopics[sub.subtopic_id]) completed += 1;
      });
    });

    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const renderSubtopics = (subtopics) => (
    <View style={{ paddingLeft: 16, marginTop: 4 }}>
      {subtopics.map((sub) => {
        const isSubExpanded = sub.subtopic_id === expandedSubtopicId;
        const isCompleted = completedSubtopics[sub.subtopic_id]; // check completion
        return (
          <View key={sub.subtopic_id} style={styles.subtopicContainer}>
            <TouchableOpacity onPress={() => toggleSubtopicExpand(sub.subtopic_id)}>
              <Text style={styles.subtopicTitle}>
                {isCompleted ? '✅ ' : '• '} {sub.subtopic_title}
              </Text>
            </TouchableOpacity>
            {isSubExpanded && (
              <View style={{ paddingLeft: 12, marginTop: 4 }}>
                <Text style={styles.subtopicDetail}>Duration: {sub.subtopic_duration}</Text>
                <Text style={styles.subtopicDetail}>Description: {sub.subtopic_description}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(sub.video_link)}>
                  <Text style={styles.linkText}>📹 Watch Video</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(sub.subtopic_documentation)}>
                  <Text style={styles.linkText}>📄 View Documentation</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderTopics = (topics) =>
    topics.map((topic) => {
      const isTopicExpanded = topic.topic_id === expandedTopicId;
      return (
        <View key={topic.topic_id} style={styles.topicContainer}>
          <TouchableOpacity onPress={() => toggleTopicExpand(topic.topic_id)}>
            <Text style={styles.topicText}>{topic.topic_title}</Text>
            <Text style={styles.topicDetail}>Duration: {topic.topic_duration}</Text>
            <Text style={styles.topicDetail}>{topic.topic_description}</Text>
          </TouchableOpacity>
          {isTopicExpanded && renderSubtopics(topic.subtopics)}
        </View>
      );
    });

  const renderCourse = ({ item }) => {
    const isExpanded = item.course_id === expandedCourseId;
    return (
      <View style={styles.courseContainer}>
        {/* Course image and title */}
        <View style={styles.courseHeader}>
          <Image source={item.image} style={styles.courseImage} />
          <TouchableOpacity onPress={() => toggleCourseExpand(item.course_id)}>
            <Text style={styles.courseTitle}>{item.course_name}</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <Text style={styles.courseDescription}>{item.course_description}</Text>
            <Text style={styles.duration}>
              Duration: {item.start_date} to {item.end_date}
            </Text>

            {/* Progress */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                Progress: {getCourseProgress(item)}%
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${getCourseProgress(item)}%` },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Topics:</Text>
            {renderTopics(item.topics)}
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']}
      style={{ flex: 1, padding: 16 }}
    >
      <Text style={styles.title}> 📚 Enrolled Courses</Text>
      <FlatList
        data={dummyCourses}
        keyExtractor={(item) => item.course_id}
        renderItem={renderCourse}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, },
   title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 4,  
  },
  courseContainer: {
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  courseHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  courseImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  expandedSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 12 },
  courseDescription: { fontSize: 14, color: '#4b5563', marginBottom: 6 },
  duration: { fontSize: 14, color: '#6b7280', marginBottom: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#374151' },
  topicContainer: { marginBottom: 8, backgroundColor: '#e0f2fe', padding: 8, borderRadius: 8 },
  topicText: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  topicDetail: { fontSize: 13, color: '#374151' },
  subtopicContainer: { marginBottom: 4 },
  subtopicTitle: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
  subtopicDetail: { fontSize: 13, color: '#6b7280' },
  linkText: { fontSize: 13, color: '#1d4ed8', marginTop: 2, textDecorationLine: 'underline' },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
});
