import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const TrackProjectScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('documents');
  const [timelineSteps, setTimelineSteps] = useState([]);
  
  // Create an array of animated values for timeline steps
  const circleAnimations = useRef([]).current;
  const lineAnimations = useRef([]).current;

  useEffect(() => {
    // Fetch project status from the backend
    axios.get('http://192.168.43.42:8000/project-status')
      .then(response => {
        const statusData = response.data;
        const updatedSteps = statusData.map(item => ({
          step: item.step,
          title: item.title,
          completed: item.status === 'completed',
          color: item.status === 'completed' ? '#00C853' : item.status === 'in-progress' ? '#FFA000' : '#002F7A'
        }));
        setTimelineSteps(updatedSteps);

        // Initialize animations for each timeline step
        circleAnimations.current = updatedSteps.map(() => new Animated.Value(0));
        lineAnimations.current = updatedSteps.map(() => new Animated.Value(0));
        
        // Animate timeline steps sequentially
        updatedSteps.forEach((_, index) => {
          // Animate circle with scale and opacity
          Animated.sequence([
            Animated.delay(index * 700), // Stagger the animations
            Animated.parallel([
              Animated.spring(circleAnimations.current[index], {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true
              }),
              Animated.timing(lineAnimations.current[index], {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
              })
            ])
          ]).start();
        });
      })
      .catch(error => {
        console.error('Error fetching project status:', error);
      });
  }, []);

  // Circle animation style
  const getCircleStyle = (index) => {
    return {
      opacity: circleAnimations.current[index]?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
      }),
      transform: [
        {
          scale: circleAnimations.current[index]?.interpolate({
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
      height: lineAnimations.current[index]?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 65]
      }),
      backgroundColor: color
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={45} color="white" />
          <Text style={styles.headerText}>Hello ! User Name</Text>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </View>
        <Text style={styles.headerTitle}>Track Project- 4 KWtt</Text>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.whiteContainer}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <View style={styles.timelineContainer}>
              {timelineSteps.map((item, index) => (
                <View 
                  key={index} 
                  style={styles.timelineItem}
                >
                  <Animated.View 
                    style={[
                      styles.timelineCircle, 
                      { backgroundColor: item.color },
                      getCircleStyle(index)
                    ]}
                  >
                    <FontAwesome name="check" size={35} color="white" />
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
          <FontAwesome name="home" size={25} color={activeTab === 'home' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'monitor' && styles.activeNavItem]}
          onPress={() => setActiveTab('monitor')}
        >
          <FontAwesome name="line-chart" size={25} color={activeTab === 'monitor' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'documents' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Track Project');
            setActiveTab('documents');
          }}
        >
          <FontAwesome name="file-text" size={25} color={activeTab === 'documents' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'refer' && styles.activeNavItem]}
          onPress={() => setActiveTab('refer')}
        >
          <FontAwesome name="users" size={25} color={activeTab === 'refer' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'profile' && styles.activeNavItem]}
          onPress={() => {
            navigation.navigate('Profile');
            setActiveTab('profile');
          }}
        >
          <FontAwesome name="user-circle" size={25} color={activeTab === 'profile' ? '#002F7A' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain the same as in the previous implementation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 230,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  headerText: {
    color: 'white',
    fontSize: 19,
    marginLeft: -150,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
  },
  whiteContainer: {
    backgroundColor: 'white',
    margin: 25,
    marginTop: -55,
    borderRadius: 15,
    padding: 20,
    height: '150%',
    width: '90%',
    alignSelf: 'center',
  },
  scrollView: {
    width: '100%',
    marginBottom: 180
  },
  timelineContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 82,
    position: 'relative',
  },
  timelineCircle: {
    width: 55,
    height: 55,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineContent: {
    marginLeft: 15,
    paddingTop: 5,
  },
  timelineStep: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002F7A',
  },
  timelineLine: {
    position: 'absolute',
    left: 24,
    marginTop: 18,
    top: 46,
    width: 4,
    zIndex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  navItem: {
    padding: 10,
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: 20,
    padding: 10,
  },
});

export default TrackProjectScreen;