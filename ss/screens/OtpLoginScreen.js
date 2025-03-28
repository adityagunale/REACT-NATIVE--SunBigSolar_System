import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const OtpLoginScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const navigation = useNavigation();
  const webViewRef = useRef(null);

  const userInfo = {
    iss: 'phmail',
    aud: 'user',
    client_id: '15464443400718027666',
  };

  const URI = `https://auth.phone.email/log-in?client_id=${userInfo.client_id}&auth_type=4&device=${deviceId}`;

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        setIsLoading(true);
        const id = await DeviceInfo.getUniqueId();
        setDeviceId(id);
        console.log('Device ID:', id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeviceId();
  }, []);

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If the number starts with country code (e.g., 91), remove it
    if (cleaned.length > 10 && cleaned.startsWith('91')) {
      cleaned = cleaned.slice(2);
    }
    
    // Ensure we have exactly 10 digits
    if (cleaned.length === 10) {
      return cleaned;
    }
    
    console.error('Invalid phone number format:', phone);
    return null;
  };

  const fetchUserData = async (token) => {
    try {
      setIsLoading(true);
      // First extract the phone number from the token
      const rawPhoneNumber = await extractPhoneFromToken(token);
      if (!rawPhoneNumber) {
        console.error('Could not extract phone number from token');
        return;
      }

      // Format the phone number
      const formattedPhone = formatPhoneNumber(rawPhoneNumber);
      if (!formattedPhone) {
        console.error('Invalid phone number format');
        return;
      }

      console.log('Attempting to verify phone number:', formattedPhone);

      // Verify the phone number first
      const verifyResponse = await axios.post(`${config.getApiUrl()}/verify-mobile`, {
        mobileNumber: formattedPhone
      });
      
      console.log('Verify response:', verifyResponse.data);
      
      if (verifyResponse.data.exists) {
        // Store the new token and user data
        const newToken = verifyResponse.data.token;
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userData', JSON.stringify(verifyResponse.data.user));
        
        // Navigate to Main screen with the verified user data
        navigation.navigate('Main', {
          token: newToken,
          userData: verifyResponse.data.user
        });
      } else {
        console.error('Phone number not registered:', formattedPhone);
        // You might want to show an error message or navigate to registration
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.error('Server returned 404 - phone number not found');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const extractPhoneFromToken = async (token) => {
    try {
      console.log('Attempting to extract phone from token:', token);
      
      // Split the token
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format - expected 3 parts, got:', parts.length);
        return null;
      }

      // Base64 decode the payload
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - base64Payload.length % 4) % 4);
      const normalizedPayload = base64Payload + padding;
      
      // Decode payload using atob
      const decodedPayload = decodeURIComponent(escape(atob(normalizedPayload)));
      console.log('Decoded payload:', decodedPayload);
      
      const payload = JSON.parse(decodedPayload);
      console.log('Parsed payload:', payload);

      // Try different possible phone number fields
      let phoneNumber = payload.phone || payload.sub || payload.phoneNumber || payload.phone_number || payload.mobile;
      
      // If no direct phone number field, try to find any field that might contain a phone number
      if (!phoneNumber) {
        console.log('No standard phone field found, searching all fields...');
        for (const key of Object.keys(payload)) {
          const value = payload[key];
          if (typeof value === 'string' && /^\+?\d{10,}$/.test(value.replace(/[\s-]/g, ''))) {
            console.log('Found potential phone number in field:', key);
            phoneNumber = value;
            break;
          }
        }
      }

      if (!phoneNumber) {
        console.error('No phone number found in payload. Available fields:', Object.keys(payload));
        return null;
      }

      console.log('Extracted raw phone number:', phoneNumber);
      return phoneNumber;

    } catch (error) {
      console.error('Error extracting phone from token:', error);
      // If the error is related to atob, try an alternative decoding method
      try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = decodeURIComponent(
          Array.prototype.map.call(atob(base64), c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );
        const altPayload = JSON.parse(jsonStr);
        console.log('Alternative decoded payload:', altPayload);
        return altPayload.phone || altPayload.sub || altPayload.phoneNumber || altPayload.phone_number || altPayload.mobile;
      } catch (e) {
        console.error('Alternative decoding also failed:', e);
        return null;
      }
    }
  };

  const phoneAuthJwt = async (event) => {
    try {
      setIsLoading(true);
      const encodedJWT = event.nativeEvent.data;
      console.log('Received JWT:', encodedJWT);
      
      const phoneNumber = await extractPhoneFromToken(encodedJWT);
      if (!phoneNumber) {
        console.error('Failed to extract phone number from token');
        return;
      }
      
      console.log('Successfully extracted phone number:', phoneNumber);
      // Fetch user data with the received token
      await fetchUserData(encodedJWT);
    } catch (error) {
      console.error('Error in phoneAuthJwt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!deviceId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a1172" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient 
        colors={['#0D1A69', '#01C1EE']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }} 
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.white}>
            <Text style={styles.title}>Login with OTP</Text>
            
            <View style={styles.webViewContainer}>
              {isWebViewLoading && (
                <View style={styles.webViewLoading}>
                  <ActivityIndicator size="large" color="#0a1172" />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
              <WebView
                source={{ uri: URI }}
                style={[styles.webView, isWebViewLoading && styles.hidden]}
                onMessage={phoneAuthJwt}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                ref={webViewRef}
                onLoadStart={() => setIsWebViewLoading(true)}
                onLoadEnd={() => setIsWebViewLoading(false)}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.backToLogin, isLoading && styles.buttonDisabled]} 
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0a1172" size="small" />
              ) : (
                <Text style={[styles.backToLoginText, isLoading && styles.textDisabled]}>
                  Back to Login
                </Text>
              )}
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
  webViewContainer: {
    width: '92%',
    height: verticalScale(400),
    backgroundColor: '#ECEDFF',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(-5)
  },
  webView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ECEDFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEDFF',
  },
  loadingText: {
    marginTop: verticalScale(10),
    color: '#0a1172',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEDFF',
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  textDisabled: {
    opacity: 0.7,
  },
  backToLogin: {
    marginTop: verticalScale(20),
    padding: responsiveSpacing(10),
    minHeight: verticalScale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#0a1172',
    fontSize: moderateScale(20),
    fontWeight: '500',
  },
});

export default OtpLoginScreen;
