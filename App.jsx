// App.jsx

import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';

import AdminTabs from './AdminTabs';
import InstructorTabs from './InstructorTabs';
import StudentTabs from './StudentTabs';

// Import the starting image
import StartingImage from './IMAGES/starting_img.png';

const PRIMARY_VIOLET = '#6366f1';

const DEFAULT_USERS = [
  {
    id: 'admin001',
    name: 'Super Admin',
    email: 'a',
    password: 'A',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: 'inst001',
    name: 'John Instructor',
    email: 'i',
    password: 'I',
    role: 'instructor',
    created_at: new Date().toISOString(),
  },
  {
    id: 'stud001',
    name: 'Jane Student',
    email: 's',
    password: 'S',
    role: 'student',
    created_at: new Date().toISOString(),
  },
];

const App = () => {
  const [current, setCurrent] = useState('welcome'); // 'welcome' | 'login' | dashboard screens
  const [displayName, setDisplayName] = useState('');
  const [users] = useState([...DEFAULT_USERS]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Validation', 'Email and password required.');
      return;
    }
    const emailLower = email.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === emailLower && u.password === password
    );
    if (!matched) {
      Alert.alert('Login failed', 'Invalid credentials.');
      return;
    }
    setDisplayName(matched.name);
    if (matched.role === 'admin') {
      setCurrent('adminDashboard');
    } else if (matched.role === 'instructor') {
      setCurrent('instructorDashboard');
    } else if (matched.role === 'student') {
      setCurrent('studentDashboard');
    }
  };

  const handleLogout = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setCurrent('login');
  };

  // --- Welcome Screen ---
  if (current === 'welcome') {
    return (
      <LinearGradient colors={['#bcd1edff', '#eff6ff', '#f9fafb']} style={styles.linearGradient}>

        <SafeAreaView style={styles.container}>
          <View style={styles.welcomeContainer}>
            <LinearGradient
              colors={['#7497e1ff', '#1940adff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.welcomeTitleGradient}
            >
              <Text style={styles.welcomeTitleText}>Welcome !!!</Text>
              {/*<Text style={styles.welcomeTitleText}>LMS App</Text>*/}
            </LinearGradient>
            <Image source={StartingImage} style={styles.welcomeImage} resizeMode="contain" />

            <TouchableOpacity
              onPress={() => setCurrent('login')}
              activeOpacity={0.6}
            >
              <Text style={styles.linkText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

    );
  }



  // --- Role-based dashboards ---
  if (current === 'adminDashboard') {
    return <AdminTabs name={displayName} onLogout={handleLogout} />;
  }
  if (current === 'instructorDashboard') {
    return <InstructorTabs name={displayName} onLogout={handleLogout} />;
  }
  if (current === 'studentDashboard') {
    return <StudentTabs name={displayName} onLogout={handleLogout} />;
  }

  // --- Login screen ---
  return (
    <LinearGradient
      colors={['#bcd1edff', '#eff6ff', '#f9fafb']}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Title */}
            <LinearGradient
              colors={['#7497e1ff', '#1940adff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextWrapper}
            >
              <Text style={styles.gradientText}>LMS App</Text>
            </LinearGradient>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.passwordRow}>
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { flex: 1 }]}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.showToggle}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.showText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogin}
              style={{ marginTop: 8 }}
            >
              <LinearGradient
                colors={['#7497e1ff', '#1940adff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Note */}
            <View style={styles.note}>
              <Text style={styles.noteText}>
                Default credentials:{"\n"}
                Admin → email "a" / password "A"{"\n"}
                Instructor → email "i" / password "I"{"\n"}
                Student → email "s" / password "S"
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );

};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    color: '#374151',
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    height: 50,
    color: '#111827',
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showToggle: {
    paddingHorizontal: 10,
  },
  showText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  note: {
    marginTop: 24,
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Welcome screen styles part 
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },

  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },

  welcomeSubtitle: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
    marginBottom: 24,
  },

  welcomeImage: {
    width: '120%',
    height: 380,
    marginBottom: 40,
  },


  // --- Welcome screen styles ---
  welcomeTitleWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },

  welcomeTitleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 3,
    alignSelf: 'center',
  },

  welcomeTitleText: {
    fontSize: 28,
  fontWeight: '800',
  color: '#fff',
  textAlign: 'center',
  textShadowColor: 'rgba(0, 0, 0, 0.4)', // shadow color
  textShadowOffset: { width: 2, height: 3 }, // shadow direction
  textShadowRadius: 4, // blur radius
  },

  linkText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1940adff', // same as login button gradient
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  linearGradient: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  welcomeSubtitle: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
    marginBottom: 24,
  },

  gradientTextWrapper: {
    paddingHorizontal: 10,
    borderRadius: 3,
    alignSelf: 'center',
    color: 'transparent',
  },
  gradientText: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    backgroundClip: 'text',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },


});

export default App;
