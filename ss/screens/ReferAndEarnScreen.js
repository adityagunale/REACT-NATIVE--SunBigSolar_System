
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavigation from './BottomNavigation';

const ReferAndEarnScreen = () => {
  const [referralCode, setReferralCode] = useState('');

  const handleShare = () => {
    Alert.alert('Share', 'Referral code shared successfully!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Refer and Earn</Text>
        <View style={styles.profileImageWrapper}>
          <View style={styles.profileImage}>
            <Icon name="gift" size={50} color="#0D1A69" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="code-outline" size={20} color="#0D1A69" />
          <TextInput
            value={referralCode}
            style={styles.input}
            placeholder="Enter Referral Code"
            onChangeText={setReferralCode}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <LinearGradient
          colors={['#0D1A69', '#01C1EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonBackground}
        >
          <Text style={styles.buttonText}>Share Code</Text>
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavigation activeScreen="ReferAndEarn" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECEDFF" },
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

export default ReferAndEarnScreen;
