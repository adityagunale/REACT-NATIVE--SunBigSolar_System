import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../config';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous error messages

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const user = {
      email: email.trim(),
      password: password,
    };

    try {
      const response = await axios.post(`${config.getApiUrl()}/login`, user);
      const token = response.data.token;
      await AsyncStorage.setItem("userToken", token);
      console.log('Token stored successfully');
      navigation.navigate("Main");
    } catch (error) {
      setErrorMessage("Invalid email or password.");
      console.log("Login Error", error);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const ForgotPassword = () => {
    navigation.navigate('Forgot Password');
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                />
              </View>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword} onPress={ForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.otpButton} onPress={() => navigation.navigate('OtpLogin')}>
              <Text style={styles.otpButtonText}>Login with OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupPrompt} onPress={handleSignUp}>
              <Text style={styles.signupText}>
                Don't have any account? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginBottom: 60
  },
  white: {
    backgroundColor: '#ECEDFF',
    height: '90%',
    width: '100%',
    marginTop: '50%',
    borderTopLeftRadius: 100,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#0a1172',
    marginTop: 70,
    marginBottom: 50,
    fontWeight: '900',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15,
  },
  inputLabel: {
    color: '#0a1172',
    fontSize:18,
    fontWeight: '900',
    marginBottom: 5,
  },
  input: {
    padding: 0, // Remove padding from TextInput to align with label
    fontSize:15
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 5,
    marginLeft: 200,
  },
  forgotPasswordText: {
    color: '#0a1172',
    fontSize: 18,
  },
  signupPrompt: {
    marginTop: 50,
  },
  signupText: {
    color: 'black',
    fontSize: 16,
  },
  signupLink: {
    color: '#0a1172',
    fontWeight: '500',
  },
  otpButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  otpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
