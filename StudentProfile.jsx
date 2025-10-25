import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function StudentProfile({ name, email, phone,age, onLogout }) {
  const role = 'Student';
  const [showModal, setShowModal] = useState(false);

  const handleLogoutPress = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      onLogout();
    }, 2000); // 2 seconds
  };

  return (
    <LinearGradient colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}> My Profile</Text>

        {/* Added Image here */}
        <Image
          source={require('./IMAGES/stud_logout.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{phone || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{age || 'N/A'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress} activeOpacity={0.7}>
          <LinearGradient
            colors={['#7497e1ff', '#1940adff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>


<Modal
  transparent
  visible={showModal}
  animationType="fade"
  onRequestClose={() => {}}
>
  <View style={styles.modalOverlay}>
    <LinearGradient
      colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']}
      style={styles.modalContent}
    >
      <View style={styles.innerContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={require('./IMAGES/instructor_logout.png')}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.modalText}>We will Miss U!!</Text>
      </View>
    </LinearGradient>
  </View>
</Modal>

      </View>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerImage: {
    width: '100%',
    height: 260,
    marginBottom: 24,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 18,
    width: 80,
    color: '#555',
  },
  value: {
    fontSize: 18,
    color: '#222',
    flexShrink: 1,
  },
  logoutButton: {
  borderRadius: 10,
  overflow: 'hidden',
  marginTop: 16,
},
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gradientButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    //backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: 280,
    overflow: 'hidden', // makes gradient corners rounded
  },
  modalImage: {
    width: 180,
    height: 120,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
