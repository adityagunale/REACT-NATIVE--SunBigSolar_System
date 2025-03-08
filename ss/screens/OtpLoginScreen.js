import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar , TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';

const OtpLoginScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const navigation = useNavigation();
  const webViewRef = useRef(null); // Create a ref using useRef

  const userInfo = {
    iss: 'phmail',
    aud: 'user',
    client_id: '15464443400718027666',
  };

  const URI = `https://auth.phone.email/log-in?client_id=${userInfo.client_id}&auth_type=4&device=${deviceId}`;

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const id = await DeviceInfo.getUniqueId();
        setDeviceId(id);
        console.log('Device ID:', id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      }
    };
    fetchDeviceId();
  }, []);

  const phoneAuthJwt = event => {
    const encodedJWT = event.nativeEvent.data;
    console.log('Received JWT:', encodedJWT);
    navigation.navigate('Main', { token: encodedJWT });
  };

  if (!deviceId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
        <View style={styles.white}>
          <Text style={styles.title}>Login with OTP</Text>
          
          <View style={styles.webViewContainer}>
            {deviceId && (
              <WebView
                source={{ uri: URI }}
                style={styles.webView}
                onMessage={phoneAuthJwt}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                ref={webViewRef} // Use the ref here
              />
            )}
          </View>
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
    paddingTop: StatusBar.currentHeight,
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
    marginBottom: 30,
    fontWeight: 'bold',
  },
  webViewContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: '#ECEDFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom:1
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
  },
  messageText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
  },
  backToLogin: {
    marginTop: 20,
  },
  backToLoginText: {
    color: '#0a1172',
    fontSize: 18,
  },
});

export default OtpLoginScreen;
