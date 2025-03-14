import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import config from '../config';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tele, setTele] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex for your phone number format
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = () => {
    setErrorMessage(""); // Clear previous error messages

    if (!name || !email || !password || !tele) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePhoneNumber(tele)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long and include at least one number, one uppercase letter, and one lowercase letter.");
      return;
    }

    const user = {
      name: name.trim(),
      email: email.trim(),
      tele: tele.trim(),
      password: password,
    };

    axios.post(`${config.getApiUrl()}/register`, user)
      .then((response) => {
        console.log(response);
        navigation.navigate("Login"); // Navigate to Login screen after successful registration
      })
      .catch((error) => {
        setErrorMessage("An error occurred during registration.");
        console.log("Registration Error", error);
      });
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
              />
            </View>
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signupPrompt} onPress={handleLogin}>
            <Text style={styles.signupText}>
              Already registered? <Text style={styles.signupLink}>Log In</Text>
            </Text>
          </TouchableOpacity>
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
    marginBottom:60
  },
  white: {
    backgroundColor: '#ECEDFF',
    height: '90%',
    width: '100%',
    marginTop: '30%',
    borderTopLeftRadius: 100,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  title: {
    color: '#0a1172',
    fontSize: 28,
    marginTop: 70,
    marginBottom: 60,
    fontWeight: 'bold',
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
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
  },
  input: {
    padding: 0,
    fontSize: 15
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#0a1172',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupPrompt: {
    marginTop: 80,
  },
  signupText: {
    color: 'black',
    fontSize: 16,
  },
  signupLink: {
    color: '#0a1172',
    fontWeight: '500',
  },
});

export default RegisterScreen;
