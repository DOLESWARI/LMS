import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const MOCK_ENROLLED_STUDENTS = [
  {
    id: "stu001",
    name: "Alice Johnson",
    course: "Introduction to Programming",
    enrolledBy: "Admin John",
    progress: { topics: 8, subtopics: 24, totalTopics: 10, totalSubtopics: 30 },
  },
  {
    id: "stu002",
    name: "Michael Smith",
    course: "Advanced Algorithms",
    enrolledBy: "Admin Sarah",
    progress: { topics: 5, subtopics: 15, totalTopics: 10, totalSubtopics: 25 },
  },
  {
    id: "stu003",
    name: "Priya Patel",
    course: "Data Structures",
    enrolledBy: "Admin John",
    progress: { topics: 10, subtopics: 30, totalTopics: 10, totalSubtopics: 30 },
  },
  {
    id: "stu004",
    name: "David Miller",
    course: "Introduction to Programming",
    enrolledBy: "Admin Sarah",
    progress: { topics: 6, subtopics: 20, totalTopics: 10, totalSubtopics: 30 },
  },
];

// Group students by course
const groupByCourse = (students) => {
  const courseMap = {};
  students.forEach((student) => {
    if (!courseMap[student.course]) {
      courseMap[student.course] = {
        courseName: student.course,
        students: [],
        enrolledBy: new Set(),
      };
    }
    courseMap[student.course].students.push(student);
    courseMap[student.course].enrolledBy.add(student.enrolledBy);
  });

  return Object.values(courseMap).map((course) => ({
    ...course,
    enrolledBy: Array.from(course.enrolledBy),
  }));
};

const EnrolledStudentsScreen = () => {
  const [enrolled] = useState(groupByCourse(MOCK_ENROLLED_STUDENTS));
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentModalVisible, setStudentModalVisible] = useState(false);

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const closeCourseModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setStudentModalVisible(true);
  };

  const closeStudentModal = () => {
    setStudentModalVisible(false);
    setSelectedStudent(null);
  };

  const renderCourse = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openCourseModal(item)}>
      <Text style={styles.courseName}>📘 {item.courseName}</Text>
      <Text style={styles.detail}>👥 Students Enrolled: {item.students.length}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
          colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']}
          style={{ flex: 1 }}
        >
    <View style={styles.container}>
      <Text style={styles.title}>Enrolled Students</Text>

      <FlatList
        data={enrolled}
        keyExtractor={(item) => item.courseName}
        renderItem={renderCourse}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for Course Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeCourseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {selectedCourse && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedCourse.courseName}
                </Text>
                <Text style={styles.modalText}>
                  Total Students: {selectedCourse.students.length}
                </Text>
                <Text style={styles.modalText}>
                  Enrolled By: {selectedCourse.enrolledBy.join(", ")}
                </Text>

                {/* Student list inside course modal */}
                <Text
                  style={[styles.modalText, { fontWeight: "bold", marginTop: 10 }]}
                >
                  Students:
                </Text>
                {selectedCourse.students.map((stu) => (
                  <TouchableOpacity
                    key={stu.id}
                    onPress={() => openStudentModal(stu)}
                  >
                    <Text style={[styles.modalText, { color: "#2563eb" }]}>
                      - {stu.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                <Text style={styles.closeText} onPress={closeCourseModal}>
                  Close
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal for Student Progress */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={studentModalVisible}
        onRequestClose={closeStudentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {selectedStudent && (
              <>
                <Text style={styles.modalTitle}>{selectedStudent.name}</Text>
                <Text style={styles.modalText}>
                  Course: {selectedStudent.course}
                </Text>
                <Text style={styles.modalText}>
                  Topics Covered: {selectedStudent.progress.topics}/
                  {selectedStudent.progress.totalTopics}
                </Text>
                <Text style={styles.modalText}>
                  Subtopics Covered: {selectedStudent.progress.subtopics}/
                  {selectedStudent.progress.totalSubtopics}
                </Text>

                {/* Percentage calculation */}
                {(() => {
                  const totalUnits =
                    selectedStudent.progress.totalTopics +
                    selectedStudent.progress.totalSubtopics;
                  const completedUnits =
                    selectedStudent.progress.topics +
                    selectedStudent.progress.subtopics;
                  const percentageCovered = (
                    (completedUnits / totalUnits) *
                    100
                  ).toFixed(1);
                  const percentagePending = (100 - percentageCovered).toFixed(1);

                  return (
                    <>
                      <Text style={[styles.modalText, { color: "green" }]}>
                        ✅ Course Covered: {percentageCovered}%
                      </Text>
                      <Text style={[styles.modalText, { color: "red" }]}>
                        ⏳ Pending: {percentagePending}%
                      </Text>
                    </>
                  );
                })()}

                <Text style={styles.closeText} onPress={closeStudentModal}>
                  Close
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </View>
    </LinearGradient>
  );
};

export default EnrolledStudentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "transparent" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#000" ,textShadowColor: 'rgba(0, 0, 0, 0.6)',  
  textShadowOffset: { width: 2, height: 2 },  
  textShadowRadius: 4, },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  detail: { fontSize: 14, color: "#4b5563" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  modalText: { fontSize: 16, marginBottom: 6, color: "#000" },
  closeText: { fontSize: 16, color: "#6366f1", marginTop: 15 },
});
