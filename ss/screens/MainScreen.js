import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Image, Animated, Dimensions, PanResponder, Easing, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const HomeScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Home Screen</Text>
  </View>
);

const MainScreen = () => {
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState('Home');
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [greeting, setGreeting] = useState('');
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get('window');
  const imageScale = useRef(new Animated.Value(1)).current;

  const carouselData = [
    { id: 1, image: require("../assets/solar-panel.webp"), title: "Solar for Home" },
    { id: 2, image: require("../assets/house3.webp"), title: "Housing Society" },
    { id: 3, image: require("../assets/zero.webp"), title: "Zero Cost Solar" },
    { id: 4, image: require("../assets/factory.webp"), title: "Solar for Factory" },
  ];

  useEffect(() => {
    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good Morning';
      } else if (currentHour < 18) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };

    setGreeting(determineGreeting());

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
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const animateImage = () => {
      Animated.sequence([
        Animated.timing(imageScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => animateImage());
    };

    animateImage();
  }, []);

  return (
    <>

     {/* <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          /> */}
<View style={styles.container}>
      
          <LinearGradient
          colors={['#0D1A69', '#01C1EE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}

   
          ></LinearGradient>
                    <View style={styles.he}>

          
          <View style={styles.hellotext}>
        <Icon name="user-circle" size={moderateScale(35)} color="white" onPress={() => navigation.navigate('Profile')}/>
          <Text style={styles.greeting}>Hello ! {userData.name}  </Text>
          <Icon name="bars" size={moderateScale(28)} color="#8CFEFF" style={styles.menuIcon} onPress={() => {/* Handle menu press */}} />
          {/* <Text style={styles.greeting}>Hello ! User Name</Text> */}
          </View>
          <View style={styles.text}>
          <Text style={styles.subtitle}><Text style={styles.boldText}>{greeting}</Text></Text>
          </View>
          <TouchableOpacity style={styles.proposalButton}>
            <Text style={styles.proposalText}>GET A FREE PROPOSAL</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
        style={styles.scrollContainer}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
         
         {/* Horizontal Scroll for "Solar for Home" */}
          <View style={styles.carouselContainer}>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.carouselContent}
            >
              {carouselData.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.card}
                >
                  <View style={styles.Image}>
                    <Animated.Image 
                      source={item.image} 
                      style={[
                        styles.im,
                        {
                          transform: [{ scale: imageScale }],
                        }
                      ]}
                      resizeMode="stretch"
                    />
                    <Text style={styles.stext}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
             key={index} 
             style={[styles.gridItem, activeTab === item.key && styles.activeGridItem]}
             onPress={() => {
              if (item.key === 'call') {
                navigation.navigate('Book A Call');
              } 
              if (item.key === 'documents') {
                navigation.navigate('Upload Documents');
              } 
              if (item.key === 'loan') {
                navigation.navigate('Solar Loan');
              } 
              if (item.key === 'payment') {
                navigation.navigate('Payment');
              } 
              if (item.key === 'track') {
                navigation.navigate('Track Project');
              } 
              if (item.key === 'quote') {
                navigation.navigate('Quote');
              } 
              else {
                setActiveTab(item.key);
              }
            }}
              >
              <Icon name={item.icon} size={moderateScale(25)} color={activeTab === item.key ? 'white' : '#002F7A'} />
              <Text style={[styles.gridText, activeTab === item.key && styles.activeGridText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.navItem, activeTab === item.key && styles.activeNavItem]}
            onPress={() => {
              if (item.key === 'profile') {
                navigation.navigate('Profile');
              } 
              if (item.key === 'documents') {
                navigation.navigate('Show Documents');
              } 
              else {
                setActiveTab(item.key);
              }
            }}
          >
            <Icon name={item.icon} size={moderateScale(25)} color={activeTab === item.key ? '#002F7A' : 'black'} />
          </TouchableOpacity>
        ))}
      </View>
      
    </View>

    </>
  );
};


const menuItems = [
  { key: 'quote', label: 'Get A \nQuote', icon: 'file-text'},
  { key: 'call', label: 'Book a \nCall', icon: 'phone' },
  { key: 'loan', label: 'Solar \nLoan', icon: 'money' },
  { key: 'payment', label: 'Payment', icon: 'credit-card' },
  { key: 'documents', label: 'Project \nDocument', icon: 'folder' },
  { key: 'track', label: 'Track Project', icon: 'map-marker' },
  { key: 'monitor', label: 'Monitor Generation', icon: 'line-chart' },
  { key: 'refer', label: 'Refer & \nEarn', icon: 'users' },
  { key: 'blog', label: 'Solaropedia (Blog)', icon: 'newspaper-o' }
];




const bottomNavItems = [
  { key: 'home', icon: 'home' },
  { key: 'monitor', icon: 'line-chart' },
  { key: 'documents', icon: 'file-text' },
  { key: 'refer', icon: 'users' },
  { key: 'profile', icon: 'user-circle',  } 
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFF',
  },
  scrollContainer: {
    flex: 1
  },
  header: {
    padding: responsiveSpacing(20),
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    height: Platform.OS === 'ios' ? verticalScale(250) : verticalScale(230),
  },
  he: {
    padding: responsiveSpacing(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    marginTop: Platform.OS === 'ios' ? verticalScale(-320) : verticalScale(-300),
    position: 'relative',
    zIndex: 1,
  },
  menuIcon: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    paddingRight: horizontalScale(10),
  },
  greeting: {
    color: 'white',
    fontSize: moderateScale(18),
    marginLeft: horizontalScale(15),
    marginTop: verticalScale(2),
  },
  subtitle: {
    color: 'white',
    fontSize: moderateScale(20),
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? verticalScale(-15) : verticalScale(-15),
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: moderateScale(30),
    textAlign: 'center',
  },
  proposalButton: {
    backgroundColor: '#0C1767',
    padding: responsiveSpacing(11),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    marginTop: verticalScale(-10),
    marginBottom: verticalScale(-40),
    borderColor: 'white',
    borderWidth: moderateScale(2),
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
    position: 'relative',
    zIndex: 2,
  },
  proposalText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(17),
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: verticalScale(20),
  },
  card: {
    backgroundColor: 'white',
    width: horizontalScale(180),
    borderRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(70),
    borderTopLeftRadius: moderateScale(70),
    height: verticalScale(135),
    marginRight: horizontalScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 0,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(15),
    marginHorizontal: horizontalScale(15),
    backgroundColor: 'white',
    borderRadius: moderateScale(15),
    padding: responsiveSpacing(10),
  },
  gridItem: {
    backgroundColor: '#ECEDFF',
    padding: responsiveSpacing(15),
    margin: responsiveSpacing(5),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    width: '30%',
    minHeight: verticalScale(100),
    justifyContent: 'center',
  },
  gridText: {
    marginTop: verticalScale(8),
    color: '#002F7A',
    fontSize: moderateScale(13),
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  activeGridItem: {
    backgroundColor: '#C6EAFF',
  },
  activeGridText: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
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
    marginBottom: Platform.OS === 'ios' ? verticalScale(30) : verticalScale(10),
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
  text: {
    marginVertical: verticalScale(50),
  },
  hellotext: {
    marginTop: Platform.OS === 'ios' ? verticalScale(120) : verticalScale(110),
    flexDirection: 'row',
    marginHorizontal: horizontalScale(20),
    alignItems: 'center',
  },
  horizontalScroll: {
    paddingHorizontal: horizontalScale(10),
  },
  stext: {
    fontSize: moderateScale(16),
    fontWeight: '900',
    textAlign: 'center',
    color: "#0C1767",
    marginTop: verticalScale(6),
    paddingHorizontal: horizontalScale(5),
  },
  stext1: {
    fontSize: moderateScale(18),
    fontWeight: '900',
    textAlign: 'center',
    color: "#0C1767",
    marginTop: verticalScale(6)
  },
  Image: {
    alignItems: 'center',
  },
  im: {
    width: horizontalScale(160),
    height: verticalScale(100),
    borderRadius: moderateScale(10),
  },
  im1: {
    width: horizontalScale(160),
    height: verticalScale(100),
    borderRadius: moderateScale(10),
    resizeMode: "stretch"
  },
  im2: {
    width: horizontalScale(160),
    height: verticalScale(100),
    borderRadius: moderateScale(10),
    resizeMode: "stretch"
  },
  carouselContainer: {
    width: '100%',
    overflow: 'hidden',
    marginVertical: verticalScale(10),
    backgroundColor: '#ECEDFF',
    marginTop: verticalScale(20),
  },
  scrollView: {
    flexGrow: 0,
  },
  carouselContent: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(10),
    marginTop: responsiveSpacing(20),
  },
});

export default MainScreen;