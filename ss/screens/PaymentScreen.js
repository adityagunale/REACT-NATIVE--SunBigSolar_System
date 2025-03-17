import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Path, Text as SvgText, G, Rect } from "react-native-svg";
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const PaymentProcessScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('documents');
  const [activeStep, setActiveStep] = useState(null);
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchUserData();
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

  const handleStepClick = (step) => {
    if (activeStep === step) {
      setActiveStep(null);
    } else {
      setActiveStep(step);
    }
  };

  // Render step content with custom styling for each step
  const renderStepContent = () => {
    if (!activeStep) return null;
    
    switch (activeStep) {
      case 1:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>1</Text>
            <Text style={styles.stepTitle1}>Scan & Pay -</Text>
            <View style={styles.contentContainer1}>
              <Text style={styles.contentText1}>Scan the QR code. Check the name</Text>
              <Text style={styles.companyName1}>Sunbig Solar Private Limited.</Text>
              <Text style={styles.contentText1}>Complete the payment.</Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>2</Text>
            <Text style={styles.stepTitle1}>Save Details</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Write down the <Text style={styles.companyName1}>Transaction ID.</Text></Text>
              <Text style={styles.contentText1}>Take a<Text style={styles.companyName1}> screenshot.</Text></Text> 
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>3</Text>
            <Text style={styles.stepTitle1}>Submit Details</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Send the <Text style={styles.companyName1}>screenshot</Text> and</Text>
             <Text style={styles.companyName1}> Transaction ID</Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepCard1}>
            <Text style={styles.stepNumber1}>4</Text>
            <Text style={styles.stepTitle1}>Check Status</Text>
            <View style={styles.contentContainer2}>
              <Text style={styles.contentText1}> Payment will be verified. Stautus will</Text>
              <Text style={styles.contentText1}>be updated in<Text style={styles.companyName1}> 48 hours.</Text></Text> 
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={45} color="white" />
          <Text style={styles.headerText}>Hello ! {userData ? userData.name : 'Loading...'}</Text>
          <MaterialCommunityIcons name="menu" size={24} color="white" style={styles.menuIcon}/>
        </View>
      </LinearGradient>

      {/* Payment Details */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Process As Follows</Text>

        {/* Step content - shows when a step is clicked */}
        {renderStepContent()}

        {/* Diagram - only show when no step is selected */}
        {!activeStep && (
          <View style={styles.diagramContainer}>
            <Svg height="450" width="450" viewBox="0 0 360 360">
              {/* Circle Path */}
              <Circle cx="180" cy="180" r="120" stroke="#001F5C" strokeWidth="1" fill="none" />

              {/* Arrows */}
              <Path d="M250 105 L270 125" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M270 125 L260 120" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M270 125 L265 115" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M275 230 L255 250" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M255 250 L265 245" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M255 250 L260 240" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M115 265 L95 245" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M95 245 L100 255" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M95 245 L105 250" stroke="#001F5C" strokeWidth="2.5" />

              <Path d="M85 125 L105 105" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M105 105 L95 110" stroke="#001F5C" strokeWidth="2.5" />
              <Path d="M105 105 L100 115" stroke="#001F5C" strokeWidth="2.5" />

              {/* Clickable Step Circles */}
              <G onPress={() => handleStepClick(1)}>
                <Circle cx="180" cy="60" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="180" y="80" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">1</SvgText>
              </G>

              <G onPress={() => handleStepClick(2)}>
                <Circle cx="300" cy="180" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="300" y="197" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">2</SvgText>
              </G>

              <G onPress={() => handleStepClick(3)}>
                <Circle cx="180" cy="300" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="180" y="319" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">3</SvgText>
              </G>

              <G onPress={() => handleStepClick(4)}>
                <Circle cx="60" cy="180" r="35" fill="white" stroke="#001F5C" strokeWidth="2" />
                <SvgText x="59" y="200" textAnchor="middle" fill="#001F5C" fontWeight="bold" fontSize="50">4</SvgText>
              </G>

              {/* Step Labels with backgrounds */}
              <G>
                <Rect x="132" y="85" width="94" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="180" y="105" textAnchor="middle" fill="black" fontSize="15">Scan & Pay</SvgText>
              </G>

              <G>
                <Rect x="196" y="165" width="90" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="245" y="185" textAnchor="middle" fill="black" fontSize="15">Save Details</SvgText>
              </G>

              <G>
                <Rect x="122" y="247" width="113" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="180" y="267" textAnchor="middle" fill="black" fontSize="15">Submit Details</SvgText>
              </G>

              <G>
                <Rect x="75" y="165" width="104" height="30" rx="10" ry="10" fill="white" />
                <SvgText x="126" y="185" textAnchor="middle" fill="black" fontSize="15">Check Status</SvgText>
              </G>
            </Svg>
          </View>
        )}

        <View style={styles.container3}>
          {/* Help Box */}
          <View style={styles.helpBox}>
            <Text style={styles.helpText}>
              Need help? Contact us at{' '}
              accounts@sunbigsolar.com
            </Text>
          </View>

          {/* Add Payment Button */}
          <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <Icon name="add" size={30} color="white" />
            <Text style={styles.buttonText}>Add Payment Details</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

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
            navigation.navigate('Payment');
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
  },
  headerContent: {
      flexDirection: 'row',
      marginHorizontal: horizontalScale(2),
      alignItems: 'center',
    marginTop: verticalScale(30)
  },
  headerText: {
    color: 'white',
    fontSize: moderateScale(18),
    marginLeft: horizontalScale(10),
    
  },
  menuIcon: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20)
  },
  sectionTitle: {
    marginLeft: horizontalScale(15),
    fontSize: moderateScale(18),
    fontWeight: '900',
    color: "#001F5C",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10)
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(20),
    width: '100%',
    height: verticalScale(350)
  },
  
  // Step 1 Styles - Scan & Pay
  stepCard1: {
    backgroundColor: 'white',
    margin: responsiveSpacing(20),
    borderRadius: moderateScale(15),
    padding: responsiveSpacing(20),
    height: verticalScale(400),
    alignItems: 'center',
  },
  stepNumber1: {
    fontSize: moderateScale(70),
    marginTop: verticalScale(10),
    fontWeight: 'bold',
    color: '#001F5C', 
    marginBottom: verticalScale(5),
  },
  stepTitle1: {
    fontSize: moderateScale(26),
    marginTop: verticalScale(14),
    fontFamily: 'Poppins-Bold',
    color: '#001F5C',
    marginBottom: verticalScale(35),
  },
  contentContainer1: {
    width: '100%',
    alignItems: 'center',
  },
  contentText1: {
    fontSize: moderateScale(19),
    color: '#001F5C',
    textAlign: 'center',
  },
  companyName1: {
    fontSize: moderateScale(19),
    fontWeight: 'bold',
    color: '#001F5C',
    textAlign: 'center',
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
    borderRadius: moderateScale(10)
  },
  navItem: {
    padding: responsiveSpacing(10)
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: moderateScale(20),
    padding: responsiveSpacing(10)
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpBox: {
    backgroundColor: 'white',
    padding: responsiveSpacing(15),
    marginLeft: horizontalScale(20),
    marginRight: horizontalScale(20),
    borderRadius: moderateScale(15),
    marginBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  helpText: {
    color: "#0a1172",
    fontFamily: 'Poppins-Bold',
    fontSize: moderateScale(19),
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001F6D',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(60),
    borderRadius: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 5,
    width: horizontalScale(350), // Added responsive width
    alignSelf: 'center', // Center the button horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(25),
    fontWeight: 'bold',
    marginLeft: horizontalScale(4),
  }
});

export default PaymentProcessScreen;