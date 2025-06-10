import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { studentFormLogin } from './api/index';
import SemesterSelector from './components/SemesterSelector';
import ToastShow from './components/ToastShow';
import YearSelector from './components/YearSelector';
import { FONTS } from './constants/common';
import { useSemesterYear } from './store/SemesterYearContext';

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Select');
  const [selectedYear, setSelectedYear] = useState('Select');
  const [toastProps, setToastProps] = useState<{ type?: string; text1?: string; text2?: string; position?: 'top' | 'bottom'; bottomOffset?: number }>({});

  const { setSemester, setYear } = useSemesterYear();
  const router = useRouter();

  const SEMESTERS = [
    { label: 'Fall', value: 'Fall' },
    { label: 'Spring', value: 'Spring' },
  ];
  const YEARS = [
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  const handleLogin = async () => {
    if (!selectedSemester || selectedSemester === 'Select' || !selectedYear || selectedYear === 'Select' || !password) {
      setToastProps({
        type: 'error',
        text1: 'All fields are required',
        text2: 'Please select semester, year and enter password.',
        position: 'bottom',
        bottomOffset: 80,
      });
      return;
    }
    setLoading(true);
    try {
      const data = await studentFormLogin(password);
      if (data.message === "success") {
        setSemester(selectedSemester);
        setYear(selectedYear);
        router.replace('/DashboardScreen');
      } else {
        setToastProps({
          type: 'error',
          text1: 'Invalid credentials',
          position: 'bottom',
          bottomOffset: 80,
        });
      }
    } catch (error) {
      setToastProps({
        type: 'error',
        text1: 'Invalid credentials',
        position: 'bottom',
        bottomOffset: 80,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./images/bgImage.png')}
      style={styles.bgContainer}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView enableOnAndroid contentContainerStyle={{ flex:1, justifyContent: 'center', alignItems: 'center' }} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBg}>
          <Image
            source={require('./images/login.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to continue to your account.</Text>

          {/* Semester Button & Modal */}
          <SemesterSelector
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            visible={semesterModalVisible}
            setVisible={setSemesterModalVisible}
            semesters={SEMESTERS}
          />

          {/* Year Button & Modal */}
          <YearSelector
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            visible={yearModalVisible}
            setVisible={setYearModalVisible}
            years={YEARS}
          />

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <ToastShow {...toastProps} onHide={() => setToastProps({})} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBg: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  welcome: {
    fontSize: 24,
    fontFamily: FONTS.POPPINS_BOLD,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.POPPINS_MEDIUM,
    color: '#888',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 18,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 17,
    color: '#222',
    textAlign: 'center',
    fontFamily: FONTS.POPPINS_MEDIUM,
  },
  loginButton: {
    backgroundColor: '#5B4DF7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: FONTS.POPPINS_MEDIUM,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
