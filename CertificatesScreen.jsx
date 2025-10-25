import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const dummyCertificates = [
  {
    certificate_id: 'cert001',
    course_name: 'Introduction to Programming',
    instructor: 'John Doe',
    issue_date: '2025-06-05',
    certificate_link: 'https://example.com/certificates/course001.pdf',
  },
  {
    certificate_id: 'cert002',
    course_name: 'JavaScript Advanced Concepts',
    instructor: 'Jane Smith',
    issue_date: '2025-07-10',
    certificate_link: 'https://example.com/certificates/course002.pdf',
  },
  {
    certificate_id: 'cert003',
    course_name: 'UI/UX Design Basics',
    instructor: 'Alice Johnson',
    issue_date: '2025-08-01',
    certificate_link: 'https://example.com/certificates/course003.pdf',
  },
];

export default function CertificatesScreen() {
  const renderCertificate = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.courseName}>{item.course_name}</Text>
      <Text style={styles.detail}>Instructor: {item.instructor}</Text>
      <Text style={styles.detail}>Issued: {item.issue_date}</Text>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL(item.certificate_link)}
      >
        <Text style={styles.linkText}>📄 View Certificate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#76aff9ff', '#9eb2d0ff', '#f9fafb']} style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Certificates</Text>
      
      <Image
        source={require('./IMAGES/certificate.png')}
        style={styles.headerImage}
        resizeMode="contain"
      />

      <FlatList
        data={dummyCertificates}
        keyExtractor={(item) => item.certificate_id}
        renderItem={renderCertificate}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,  },
  title: {
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
    height: 175,
    marginBottom: 20,
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  courseName: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  detail: { fontSize: 14, color: '#4b5563', marginBottom: 2 },
  linkButton: { marginTop: 8, paddingVertical: 6 },
  linkText: { fontSize: 14, color: '#1d4ed8', textDecorationLine: 'underline' },
});
