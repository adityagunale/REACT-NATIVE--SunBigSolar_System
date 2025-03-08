import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = ({ activeScreen }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#0D1A69', '#01C1EE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.bottomNavigation}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.navItem}>
        <Icon name="home-outline" size={24} color={activeScreen === 'Home' ? '#ffffff' : '#cccccc'} />
        <Text style={{ color: activeScreen === 'Home' ? '#ffffff' : '#cccccc' }}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navItem}>
        <Icon name="person-outline" size={24} color={activeScreen === 'Profile' ? '#ffffff' : '#cccccc'} />
        <Text style={{ color: activeScreen === 'Profile' ? '#ffffff' : '#cccccc' }}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ReferAndEarn')} style={styles.navItem}>
        <Icon name="gift-outline" size={24} color={activeScreen === 'ReferAndEarn' ? '#ffffff' : '#cccccc'} />
        <Text style={{ color: activeScreen === 'ReferAndEarn' ? '#ffffff' : '#cccccc' }}>Refer & Earn</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    right: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default BottomNavigation;
