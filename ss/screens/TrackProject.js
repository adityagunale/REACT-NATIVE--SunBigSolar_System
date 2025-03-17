import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, StatusBar, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const TrackProjectScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('documents');
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState('');
  
  // Initialize animations with empty arrays
  const circleAnimations = useRef(Array(10).fill(null).map(() => new Animated.Value(0))).current;
  const lineAnimations = useRef(Array(10).fill(null).map(() => new Animated.Value(0))).current;

  useEffect(() => {
    fetchUserData();
    fetchProjectStatus();
    determineGreeting();
  }, []);

  const determineGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${config.getApiUrl()}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  const fetchProjectStatus = async () => {
    try {
      const response = await axios.get(`${config.getApiUrl()}/project-status`);
      const statusData = response.data;
      const updatedSteps = statusData.map(item => ({
        step: item.step,
        title: item.title,
        completed: item.status === 'completed',
        color: item.status === 'completed' ? '#00C853' : item.status === 'in-progress' ? '#FFA000' : '#002F7A'
      }));
      setTimelineSteps(updatedSteps);

      // Animate timeline steps sequentially
      updatedSteps.forEach((_, index) => {
        Animated.sequence([
          Animated.delay(index * 700),
          Animated.parallel([
            Animated.spring(circleAnimations[index], {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true
            }),
            Animated.timing(lineAnimations[index], {
              toValue: 1,
              duration: 500,
              useNativeDriver: false
            })
          ])
        ]).start();
      });
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  };

  // Circle animation style
  const getCircleStyle = (index) => {
    return {
      opacity: circleAnimations[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      }),
      transform: [
        {
          scale: circleAnimations[index].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 1.2, 1]
          })
        }
      ]
    };
  };

  // Line animation style
  const getLineStyle = (index, color) => {
    return {
      height: lineAnimations[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, verticalScale(65)]
      }),
      backgroundColor: color
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={moderateScale(45)} color="white" />
          <Text style={styles.headerText}>Hello ! {userData ? userData.name : 'Loading...'}</Text>
          <MaterialCommunityIcons name="menu" size={moderateScale(24)} color="white" />
        </View>
        <Text style={styles.headerTitle}>Track Project- 4 KWtt</Text>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <View style={styles.timelineContainer}>
              {timelineSteps.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <Animated.View 
                    style={[
                      styles.timelineCircle, 
                      { backgroundColor: item.color },
                      getCircleStyle(index)
                    ]}
                  >
                    <FontAwesome name="check" size={moderateScale(35)} color="white" />
                  </Animated.View>
                  
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineStep}>Step {item.step}</Text>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                  </View>
                  
                  {index < timelineSteps.length - 1 && (
                    <Animated.View 
                      style={[
                        styles.timelineLine, 
                        getLineStyle(index, item.color)
                      ]} 
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Main');
            setActiveTab('home');
          }}
        >
          <FontAwesome name="home" size={moderateScale(25)} color={activeTab === 'home' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'monitor' && styles.activeNavItem]}
          onPress={() => setActiveTab('monitor')}
        >
          <FontAwesome name="line-chart" size={moderateScale(25)} color={activeTab === 'monitor' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'documents' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Track Project');
            setActiveTab('documents');
          }}
        >
          <FontAwesome name="file-text" size={moderateScale(25)} color={activeTab === 'documents' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'refer' && styles.activeNavItem]}
          onPress={() => setActiveTab('refer')}
        >
          <FontAwesome name="users" size={moderateScale(25)} color={activeTab === 'refer' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Profile');
            setActiveTab('profile');
          }}
        >
          <FontAwesome name="user-circle" size={moderateScale(25)} color={activeTab === 'profile' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  header: {
    padding: responsiveSpacing(20),
    paddingTop: verticalScale(50),
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
    height: verticalScale(230),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(14),
  },
  headerText: {
    color: 'white',
    fontSize: moderateScale(19),
    marginLeft: horizontalScale(-110),
  },
  headerTitle: {
    color: 'white',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
  },
  whiteContainer: {
    backgroundColor: 'white',
     margin: responsiveSpacing(25),
    marginTop: verticalScale(-55),
    borderRadius: moderateScale(15),
    padding: responsiveSpacing(20),
    height: '110%',
    width: '90%',
    alignSelf: 'center',
  },
  scrollView: {
    width: '100%',
    // marginBottom: verticalScale(180)
  },
  timelineContainer: {
    width: '100%',
    paddingVertical: verticalScale(10),
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(82),
    position: 'relative',
  },
  timelineCircle: {
    width: moderateScale(55),
    height: moderateScale(55),
    borderRadius: moderateScale(36),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineContent: {
    marginLeft: horizontalScale(15),
    paddingTop: verticalScale(5),
  },
  timelineStep: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#333',
  },
  timelineTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#002F7A',
  },
  timelineLine: {
    position: 'absolute',
    left: horizontalScale(24),
    marginTop: verticalScale(18),
    top: verticalScale(46),
    width: moderateScale(4),
    zIndex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: responsiveSpacing(10),
    backgroundColor: 'white',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(10),
    elevation: 5,
    marginHorizontal: horizontalScale(20),
    marginBottom: verticalScale(10),
    borderRadius: moderateScale(10),
  },
  navItem: {
    padding: responsiveSpacing(10),
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: moderateScale(20),
    padding: responsiveSpacing(10),
  },
});

export default TrackProjectScreen;