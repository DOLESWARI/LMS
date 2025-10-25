import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AdminProfile = ({ user, onLogout }) => {
  return (
    <LinearGradient colors={['#8fbdfbff', '#cbd6e5ff', '#f9fafb']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Admin Profile</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user?.name || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{user?.role || 'Admin'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{user?.age || 'N/A'}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <LinearGradient
              colors={['#7497e1ff', '#1940adff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AdminProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    ///backgroundColor: '#fff',
    borderRadius: 5,
    padding: 24,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
    width: 90,
  },
  value: {
    fontSize: 16,
    color: '#111',
    flexShrink: 1,
  },
  logoutButton: {
  borderRadius: 10,
  overflow: 'hidden',
  marginTop: 16,
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
