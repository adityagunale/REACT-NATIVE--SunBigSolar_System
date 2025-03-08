/* ss/screens/ProfileScreen.js */
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: '',
    birthday: '',
    tele: '',
    instagram: '',
    email: '',
    password: '',
  });

  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://192.168.43.42:8000/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put('http://192.168.43.42:8000/user', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>{userData.name}</Text>
        <View style={styles.profileImageWrapper}>
          <View style={styles.profileImage}>
            <Icon name="person" size={50} color="#0D1A69" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        {[
          { icon: "person-outline", field: "name", value: userData.name },
          { icon: "call-outline", field: "tele", value: userData.tele },
          { icon: "mail-outline", field: "email", value: userData.email },
          { icon: "eye-outline", field: "password", value: userData.password, secure: true },
        ].map((item, index) => (
          <View key={index} style={styles.infoRow}>
            <Icon name={item.icon} size={20} color="#0D1A69" />
            <TextInput
              value={item.value}
              style={styles.input}
              editable={isEditable}
              secureTextEntry={item.secure && !showPassword}
              onChangeText={(text) => setUserData({ ...userData, [item.field]: text })}
            />
            {item.secure && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#0D1A69" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setIsEditable(!isEditable)}>
        <LinearGradient
          colors={['#0D1A69', '#01C1EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonBackground}
        >
          <Text style={styles.buttonText}>{isEditable ? 'Save Changes' : 'Edit Profile'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {isEditable && (
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <LinearGradient
            colors={['#0D1A69', '#01C1EE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonBackground}
          >
            <Text style={styles.buttonText}>Update Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <BottomNavigation activeScreen="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECEDFF" }, // Updated background color
  header: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    paddingTop: 50,
  },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold", marginTop: 10, marginBottom: 50 },
  profileImageWrapper: {
    position: "absolute",
    bottom: -30,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#F3E5F5",
  },
  infoContainer: { marginTop: 60, padding: 20 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  input: { marginLeft: 10, flex: 1, color: "#333" },
  button: { alignSelf: "center", width: "80%", marginTop: 20 },
  buttonBackground: {
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default ProfileScreen;
