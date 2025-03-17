import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tele, setTele] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!name || !email || !password || !tele) {
        throw new Error("All fields are required.");
      }

      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (!validatePhoneNumber(tele)) {
        throw new Error("Please enter a valid phone number.");
      }

      if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long and include at least one number, one uppercase letter, and one lowercase letter.");
      }

      const user = {
        name: name.trim(),
        email: email.trim(),
        tele: tele.trim(),
        password: password,
      };

      const response = await axios.post(`${config.getApiUrl()}/register`, user);
      console.log(response);
      navigation.navigate("Login");
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during registration.");
      console.log("Registration Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient 
      colors={['#0D1A69', '#01C1EE']} 
      style={styles.blue}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.white}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                value={tele}
                onChangeText={setTele}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={styles.signupPrompt} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={[styles.signupText, isLoading && styles.textDisabled]}>
                Already registered? <Text style={styles.signupLink}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  blue: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  white: {
    backgroundColor: '#ECEDFF',
    flex: 1,
    width: '100%',
    marginTop: '30%',
    borderTopLeftRadius: moderateScale(100),
    padding: responsiveSpacing(15),
    alignItems: 'center',
  },
  title: {
    color: '#0a1172',
    fontSize: moderateScale(28),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
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
    marginLeft: responsiveSpacing(15),
  },
  input: {
    padding: 0,
    fontSize: moderateScale(17),
    height: verticalScale(25),
    color: '#0a1172',
    marginLeft: responsiveSpacing(15),
  },
  errorText: {
    color: 'red',
    marginBottom: verticalScale(15),
    textAlign: 'center',
    fontSize: moderateScale(14),
    width: '100%',
    paddingHorizontal: horizontalScale(20)
  },
  button: {
    width: '92%',
    backgroundColor: '#0a1172',
    padding: responsiveSpacing(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
    minHeight: verticalScale(50),
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center'
  },
  bottomContainer: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: verticalScale(20),
  },
  signupPrompt: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
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
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#0a1172',
  },
  textDisabled: {
    opacity: 0.7,
  }
});

export default RegisterScreen;
