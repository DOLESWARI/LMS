import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const InstructorProfile = ({ name, email, phone, department, age, onLogout }) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Instructor Profile</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name || 'N/A'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>Instructor</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email || 'N/A'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{phone || 'N/A'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{department || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{age || 'N/A'}</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            activeOpacity={0.7}
          >
            < LinearGradient
              colors={['#7497e1ff', '#1940adff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default InstructorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    ///backgroundColor: '#fff',
    borderRadius: 5,
    padding: 24,
    elevation: 3,
    marginTop: 68,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  logoutButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
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
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
