import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requestResetCode = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.42:8000/request-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim() 
        })
      });

      const textResponse = await response.text();
      console.log('Server Response:', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = { message: textResponse };
      }

      if (response.ok) {
        setMessage('Reset code sent to your email');
        setStep(2);
      } else {
        setMessage(data.message || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.43.42:8000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          resetCode: resetCode.trim(),
          newPassword
        })
      });

      const textResponse = await response.text();
      console.log('Server Response:', textResponse);

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        data = { message: textResponse };
      }

      if (response.ok) {
        setMessage('Password reset successful');
        setTimeout(() => {
          navigation.navigate("Login");
        }, 2000); // Navigate to login after 2 seconds
      } else {
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error occurred');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Forgot Password</Text>

          {step === 1 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <TouchableOpacity style={styles.resetButton} onPress={requestResetCode}>
                <Text style={styles.resetButtonText}>Request Reset Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reset Code</Text>
                <TextInput
                  style={styles.input}
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholder="Enter reset code"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
              </View>
              <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
                <Text style={styles.resetButtonText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}

          {message ? (
            <Text style={styles.messageText}>{message}</Text>
          ) : null}

          <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.goBack()}>
            <Text style={styles.backToLoginText}>Back to Login</Text>
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
    fontSize: 28,
    color: '#0a1172',
    marginTop: 70,
    marginBottom: 60,
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#0a1172',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  backToLogin: {
    marginTop: 20,
  },
  backToLoginText: {
    color: '#0a1172',
    fontSize: 18,
  },
});

export default ForgotPassword;
