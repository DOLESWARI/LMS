import React, { useState, useMemo } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SectionList,
  Platform,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PRIMARY_VIOLET = '#6366f1';
const PRIMARY_BLUE = '#3b82f6';

const generateRandomPassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const AdminDashboard = ({ name }) => {
  const [masterUsers, setMasterUsers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [formData, setFormData] = useState({
    role: 'Student',
    name: '',
    email: '',
    phone: '',
    department: '',
    course: '',
    age: '',
  });

  const [registrationRequests, setRegistrationRequests] = useState([
    {
      id: 'req1',
      type: 'Instructor',
      name: 'Dr. Jane Doe',
      email: 'jane.doe@lms.com',
      department: 'Physics',
      phone: '1234567890',
    },
    {
      id: 'req2',
      type: 'Student',
      name: 'Alex Johnson',
      email: 'alex.johnson@lms.com',
      course: 'CS101',
      age: 20,
      phone: '0987654321',
    },
  ]);

  const sections = useMemo(() => {
    return [
      {
        title: 'Registration Requests',
        data: registrationRequests,
      },
      {
        title: 'Master Users',
        data: masterUsers,
      },
    ];
  }, [registrationRequests, masterUsers]);

  const handleApproveRequest = (req) => {
    const password = generateRandomPassword();
    const newUser = {
      user_id: `${req.type === 'Instructor' ? 'instr' : 'stud'}${masterUsers.length + 1}`,
      role: req.type.toLowerCase(),
      name: req.name,
      email: req.email,
      password,
      phone: req.phone || '',
      assigned_by_admin: 'admin001',
      assigned_at: new Date().toISOString(),
      department: req.type === 'Instructor' ? req.department : null,
      course: req.type === 'Student' ? req.course : null,
      age: req.age || null,
    };
    setMasterUsers((prev) => [...prev, newUser]);
    Alert.alert('Approved', `${req.type} "${req.name}" approved. Password: ${password}`);
    setRegistrationRequests((prev) => prev.filter((r) => r.id !== req.id));
    setSelectedRequest(null);
  };

  const handleAddMember = () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Validation', 'Please fill Name and Email');
      return;
    }
    const password = generateRandomPassword();
    const newUser = {
      user_id: `${formData.role === 'Instructor' ? 'instr' : formData.role === 'Admin' ? 'admin' : 'stud'}${masterUsers.length + 1}`,
      role: formData.role.toLowerCase(),
      name: formData.name,
      email: formData.email,
      password,
      phone: formData.phone,
      assigned_by_admin: 'admin001',
      assigned_at: new Date().toISOString(),
      department: formData.role === 'Instructor' ? formData.department : null,
      course: formData.role === 'Student' ? formData.course : null,
      age: formData.age || null,
    };
    setMasterUsers((prev) => [...prev, newUser]);
    Alert.alert(
      'Approved',
      `${formData.role} "${formData.name}" added successfully.\nPassword: ${password}`
    );
    setAddModalVisible(false);
    setFormData({ role: 'Student', name: '', email: '', phone: '', department: '', course: '', age: '' });
  };

  const handleSaveEdit = () => {
    setMasterUsers((prev) =>
      prev.map((u) =>
        u.user_id === editUser.user_id
          ? { ...u, ...formData, role: formData.role.toLowerCase() }
          : u
      )
    );
    setEditModalVisible(false);
    setEditUser(null);
    setFormData({ role: 'Student', name: '', email: '', phone: '', department: '', course: '', age: '' });
  };

  const renderItem = ({ item, section }) => {
    if (section.title === 'Registration Requests') {
      return (
        <TouchableOpacity onPress={() => setSelectedRequest(item)} activeOpacity={0.7}>
          <View style={styles.userRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userMeta}>{item.email}</Text>
            <Text style={styles.userMeta}>Role: {item.type}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            setEditUser(item);
            setFormData({
              role:
                item.role === 'instructor'
                  ? 'Instructor'
                  : item.role === 'admin'
                  ? 'Admin'
                  : 'Student',
              name: item.name,
              email: item.email,
              phone: item.phone,
              department: item.department || '',
              course: item.course || '',
              age: item.age ? String(item.age) : '',
            });
            setEditModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.userRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userMeta}>{item.email}</Text>
            <Text style={styles.userMeta}>Role: {item.role}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const GradientButton = ({ text, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ marginTop: 16 }}>
      <LinearGradient
        colors={['#7497e1ff', '#1940adff']}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <Text style={styles.gradientButtonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFormModal = (visible, onClose, onSubmit, title) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{title}</Text>
            <Dropdown
              style={styles.dropdown}
              data={[
                { label: 'Student', value: 'Student' },
                { label: 'Instructor', value: 'Instructor' },
                { label: 'Admin', value: 'Admin' },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Role"
              placeholderStyle={{ color: '#666' }}
              selectedTextStyle={{ color: '#000' }}
              value={formData.role}
              onChange={(item) => setFormData((f) => ({ ...f, role: item.value }))}
            />
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={(t) => setFormData((f) => ({ ...f, name: t }))}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(t) => setFormData((f) => ({ ...f, email: t }))}
              style={styles.input}
              placeholderTextColor="#666"
            />
            <TextInput
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(t) => setFormData((f) => ({ ...f, phone: t }))}
              style={styles.input}
              placeholderTextColor="#666"
            />
            {formData.role === 'Instructor' ? (
              <TextInput
                placeholder="Department"
                value={formData.department}
                onChangeText={(t) => setFormData((f) => ({ ...f, department: t }))}
                style={styles.input}
                placeholderTextColor="#666"
              />
            ) : formData.role === 'Student' ? (
              <TextInput
                placeholder="Course"
                value={formData.course}
                onChangeText={(t) => setFormData((f) => ({ ...f, course: t }))}
                style={styles.input}
                placeholderTextColor="#666"
              />
            ) : null}
            <TextInput
              placeholder="Age"
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(t) => setFormData((f) => ({ ...f, age: t }))}
              style={styles.input}
              placeholderTextColor="#666"
            />

            <GradientButton text="Save" onPress={onSubmit} />
            <GradientButton text="Cancel" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={{ flex: 1 }}
        >
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.user_id || item.id || index.toString()}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            )}
            ListHeaderComponent={
              <View style={styles.topBanner}>
                <Text style={styles.welcome}>Welcome, {name}</Text>
                <Text style={styles.subtitle}>Manage registrations and users.</Text>
                <Image
                  source={require('./IMAGES/starting_img.png')}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
                <View style={styles.buttonRow }>
                  <GradientButton text="➕ Add Member" onPress={() => setAddModalVisible(true)} />
                  <GradientButton
                    text="✏️ Edit Member"
                    onPress={() => {
                      if (masterUsers.length === 0) {
                        Alert.alert('Info', 'No members to edit.');
                      } else {
                        Alert.alert('Tip', 'Tap a user in Master Users list to edit.');
                      }
                    }}
                  />
                </View>
              </View>
            }
            contentContainerStyle={styles.inner}
            stickySectionHeadersEnabled={false}
            extraData={masterUsers}
          />

          {selectedRequest && (
            <Modal visible={true} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <Text style={styles.modalTitle}>Approve {selectedRequest.type}</Text>
                    <Text style={styles.field}>Name: {selectedRequest.name}</Text>
                    <Text style={styles.field}>Email: {selectedRequest.email}</Text>
                    {selectedRequest.type === 'Instructor' ? (
                      <Text style={styles.field}>Department: {selectedRequest.department}</Text>
                    ) : (
                      <Text style={styles.field}>Course: {selectedRequest.course}</Text>
                    )}
                    <Text style={styles.field}>Phone: {selectedRequest.phone}</Text>
                    <GradientButton
                      text="Approve & Send Password"
                      onPress={() => handleApproveRequest(selectedRequest)}
                    />
                    <GradientButton text="Cancel" onPress={() => setSelectedRequest(null)} />
                  </ScrollView>
                </View>
              </View>
            </Modal>
          )}

          {renderFormModal(isAddModalVisible, () => setAddModalVisible(false), handleAddMember, 'Add Member')}
          {renderFormModal(isEditModalVisible, () => setEditModalVisible(false), handleSaveEdit, 'Edit Member')}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 ,backgroundColor: 'transparent'},
  inner: { padding: 16, paddingBottom: 40 },
  topBanner: { marginBottom: 12 },
  headerImage: { width: '100%', height: 260, marginBottom: 12 },
  welcome: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 4, 
    color: '#000',
    // Shadow effect
    textShadowColor: 'rgba(0, 0, 0, 0.6)',  
    textShadowOffset: { width: 2, height: 2 },  
    textShadowRadius: 4,  },
  subtitle: { fontSize: 14, color: '#4b5563', marginBottom: 12 },
  sectionHeader: {
    //backgroundColor: '#f3f4fd',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#000',// shadow effect
    textShadowColor: 'rgba(0,0,0,0.25)',  
    textShadowOffset: { width: 1, height: 1 },  
    textShadowRadius: 3,  },
  userRow: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userName: { fontWeight: '600', fontSize: 16, color: '#000' },
  userMeta: { fontSize: 12, color: '#555', marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#000' },
  field: { fontSize: 16, color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  gradientButton: {
    paddingVertical: 16,   // increased height
    paddingHorizontal: 9, // wider button
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 140,         // ensures both buttons look consistent 
    shadowColor: '#000',
  },
  gradientButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16  
  },
  
});

export default AdminDashboard;
