import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous error messages
    setIsLoading(true); // Start loading

    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }

      const user = {
        email: email.trim(),
        password: password,
      };

      const response = await axios.post(`${config.getApiUrl()}/login`, user);
      const token = response.data.token;
      await AsyncStorage.setItem("userToken", token);
      console.log('Token stored successfully');
      navigation.navigate("Main");
    } catch (error) {
      setErrorMessage(error.message || "Invalid email or password.");
      console.log("Login Error", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const ForgotPassword = () => {
    navigation.navigate('Forgot Password');
  };

  const handleOtpLogin = async () => {
    setIsOtpLoading(true);
    try {
      // Add your OTP login logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      navigation.navigate('OtpLogin');
    } catch (error) {
      console.log("OTP Navigation Error", error);
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient 
        colors={['#0D1A69', '#01C1EE']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}
      >
        
          <View style={styles.white}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  editable={!isLoading} // Disable input while loading
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  secureTextEntry
                  editable={!isLoading} // Disable input while loading
                />
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={ForgotPassword}
              disabled={isLoading}
            >
              <Text style={[styles.forgotPasswordText, isLoading && styles.textDisabled]}>
                Forgot Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.otpButton, isOtpLoading && styles.buttonDisabled]}
              onPress={handleOtpLogin}
              disabled={isLoading || isOtpLoading}
            >
              {isOtpLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.otpButtonText}>Login with OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupPrompt} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={[styles.signupText, isLoading && styles.textDisabled]}>
                Don't have any account? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  scrollContent: {
    flexGrow: 1,
    marginBottom: verticalScale(60)
  },
  white: {
    backgroundColor: '#ECEDFF',
    minHeight: '100%',
    width: '100%',
    marginTop: '50%',
    borderTopLeftRadius: moderateScale(100),
    padding: responsiveSpacing(15),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(28),
    color: '#0a1172',
    marginTop: verticalScale(40),
    marginBottom: verticalScale(40),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputGroup: {
    width: '92%',
    marginBottom: verticalScale(20),
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: responsiveSpacing(10),
    minHeight: verticalScale(65),
  },
  inputLabel: {
    color: '#0a1172',
    fontSize: moderateScale(18),
    fontWeight: '900',
    marginBottom: verticalScale(5),
      marginLeft:responsiveSpacing(15),
  },
  input: {
    padding: 0,
    fontSize: moderateScale(16),
    height: verticalScale(25),
    color: '#0a1172',
    marginLeft:responsiveSpacing(15),
  },
  errorContainer: {
    width: '92%',
    marginBottom: verticalScale(10),
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: moderateScale(14),
  },
  loginButton: {
    width: '92%',
    backgroundColor: '#0a1172',
    padding: responsiveSpacing(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
    minHeight: verticalScale(50),
    justifyContent: 'center'
  },
  loginButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center'
  },
  forgotPassword: {
    marginTop: verticalScale(15),
    alignSelf: 'flex-end',
    marginRight: horizontalScale(30),
  },
  forgotPasswordText: {
    color: '#0a1172',
    fontSize: moderateScale(17),
    fontWeight: '500'
  },
  signupPrompt: {
    width: '100%',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
    alignItems: 'center'
  },
  signupText: {
    color: 'black',
    fontSize: moderateScale(18),
    textAlign: 'center'
  },
  signupLink: {
    color: '#0a1172',
    fontWeight: '500',
    fontSize: moderateScale(16)
  },
  otpButton: {
    width: '92%',
    backgroundColor: '#0a1172',
    padding: responsiveSpacing(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(15),
    minHeight: verticalScale(50),
    justifyContent: 'center'
  },
  otpButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#0a1172',
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;
