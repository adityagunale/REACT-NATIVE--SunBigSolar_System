import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar , ScrollView,Image, Animated, Dimensions, PanResponder, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from './BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

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
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get('window');
  const [isScrolling, setIsScrolling] = useState(false);
  const animationRef = useRef(null);
  const panResponderRef = useRef(null);
  const imageScale = useRef(new Animated.Value(1)).current;
  const resumeTimerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastScrollPosition = useRef(0);
  const isUserScrolling = useRef(false);

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
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsScrolling(true);
        if (animationRef.current) {
          animationRef.current.stop();
        }
      },
      onPanResponderMove: (_, gestureState) => {
        const newPosition = -gestureState.dx;
        scrollX.setValue(newPosition / width);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsScrolling(false);
        if (!isUserScrolling.current) {
          startAutoScroll();
        }
      },
      onPanResponderTerminate: () => {
        setIsScrolling(false);
        if (!isUserScrolling.current) {
          startAutoScroll();
        }
      },
    });

    return () => {
      if (panResponderRef.current) {
        panResponderRef.current.panHandlers = {};
      }
    };
  }, []);

  const handleScroll = (event) => {
    // Set user scrolling flag
    isUserScrolling.current = true;
    
    // Stop the carousel animation when scrolling starts
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Update last scroll position
    lastScrollPosition.current = event.nativeEvent.contentOffset.y;

    // Set a new timeout to resume after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
      startAutoScroll();
    }, 1000);
  };

  const startAutoScroll = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Get the current position of the carousel
    const currentPosition = scrollX._value;
    
    // Create a new animation starting from the current position
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: 1,
          duration: 40000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    );

    animationRef.current = animation;
    animation.start();
  };

  useEffect(() => {
    startAutoScroll();
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

  const handleCarouselPress = () => {
    // Stop the current animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Clear any existing timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    // Set a new timer to resume after 1 minute
    resumeTimerRef.current = setTimeout(() => {
      startAutoScroll();
    }, 60000); // 60000 ms = 1 minute
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Profile':
        return <ProfileScreen userData={userData} onUpdate={setUserData} />;
      case 'ReferAndEarn':
        return <ReferAndEarnScreen />;
      default:
        return <HomeScreen />;
    }
  };
  

  return (
    <>

     {/* <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          /> */}
<View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
          <LinearGradient
           colors={['#0D1A69', '#01C1EE']}
           start={{ x: 0, y: 0 }}
           end={{ x: 1, y: 0 }}
           style={styles.header}
   
          ></LinearGradient>
                    <View style={styles.he}>

          
          <View style={styles.hellotext}>
        <Icon name="user-circle" size={35} color="white" onPress={() => navigation.navigate('Profile')}/>
          <Text style={styles.greeting}>Hello ! {userData.name}  </Text>
          <Icon name="bars" size={28} color="#8CFEFF" style={styles.menuIcon} onPress={() => {/* Handle menu press */}} />
          {/* <Text style={styles.greeting}>Hello ! User Name</Text> */}
          </View>
          <View style={styles.text}>
          <Text style={styles.subtitle}><Text style={styles.boldText}>{greeting}</Text></Text>
          </View>
          <TouchableOpacity style={styles.proposalButton}>
            <Text style={styles.proposalText}>GET A FREE PROPOSAL</Text>
          </TouchableOpacity>
        </View>
         
         {/* Horizontal Scroll for "Solar for Home" */}
          <View style={styles.carouselContainer}>
            <Animated.View 
              style={[
                styles.carouselContent,
                {
                  transform: [{
                    translateX: scrollX.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -width * 2],
                      extrapolate: 'clamp'
                    })
                  }]
                }
              ]}
              {...panResponderRef.current?.panHandlers}
            >
              {/* Original items */}
              {carouselData.map((item, index) => (
                <TouchableOpacity key={item.id} style={styles.card} onPress={handleCarouselPress}>
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
              {/* Duplicate all items for seamless loop */}
              {carouselData.map((item, index) => (
                <TouchableOpacity key={`duplicate-${item.id}`} style={styles.card} onPress={handleCarouselPress}>
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
            </Animated.View>
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
              <Icon name={item.icon} size={25} color={activeTab === item.key ? 'white' : '#002F7A'} />
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
            <Icon name={item.icon} size={25} color={activeTab === item.key ? '#002F7A' : 'black'} />
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
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",

    // backgroundColor: '#002F7A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height:290
    
  },
  he:{
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",

    // backgroundColor: '#002F7A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop:-300
  },
  menuIcon: {
    marginLeft:110
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    // marginBottom: 5,
    marginLeft:20,
    marginTop:4
    
  },
  subtitle: {
    color: 'white',
    fontSize: 20,
    marginHorizontal:60,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  proposalButton: {
    backgroundColor: 'white',
    padding: 11,
    borderRadius: 15,
    alignItems: 'center',
    marginTop:-15,
    backgroundColor:'#0C1767',
    borderColor:'white',
    borderWidth:4,
    width:350,
    marginLeft:20
   
  },
  proposalText: {
    color:'white',
    fontWeight: 'bold',
    fontSize: 17,
   
  },
  cardContainer: {
    flexDirection: 'row',
    
    justifyContent:
      'space-around',
    marginVertical: 20
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
   
    width: '45%',
    alignItems: 'center',
    marginTop:-15,
    marginBottom:20,
  
  },
  gridContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    // marginTop:15,
    // marginBottom:15,
    // marginHorizontal:20,
    //  backgroundColor:'white',
    // borderWidth:10,
    // borderColor:'white',
    // borderRadius:20,
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom:15,
    marginHorizontal: 18,
    backgroundColor: 'white',
    // borderWidth: 10,
    borderColor: 'white',
    borderRadius: 15,
    borderTopWidth:15,
    borderBottomWidth:10

  },
  gridItem: {
    // backgroundColor: 'white',
    // padding: 20,
    // marginTop:5,
    // margin: 3,
    // borderRadius: 18,
    // alignItems: 'center',
    // width: '31%',
    // height: '31%',
    // backgroundColor:'#ECEDFF'

    backgroundColor: '#ECEDFF',
    padding: 18,
    margin: 2,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
  },
  gridText: {
  //   marginTop: 10,
  //   color: '#002F7A',
  //   fontSize: 13,
  //  fontWeight:500,
  //   textAlign: 'center'

  marginTop: 10,
  color: '#002F7A',
  fontSize: 13,
  textAlign: 'center',
  fontFamily: 'Poppins-Regular',
  

  },
  activeGridItem: {
    backgroundColor: '#C6EAFF'
  },
  activeGridText: {
    color: 'black',
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
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
    marginHorizontal:20,
    marginBottom:10,
    borderRadius:10
  },
  navItem: {
    padding: 10
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: 20,
    padding: 10
  },
  text:{
   marginVertical:70,
   
  },
  hellotext:{
    marginTop:50,
    flexDirection:'row',
    marginHorizontal:20,
  },

  horizontalScroll: {
    
    paddingHorizontal: 10,
   
  },
  card: {
    backgroundColor: 'white',
    width: 180,
    borderRadius: 15,
    borderTopRightRadius:70,
    borderTopLeftRadius:70,
    // padding: 10,
    height:135,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0,
  },
  stext:{
    fontSize:18,
    fontWeight:900,
    textAlign:'center',
    color:"#0C1767",
    marginTop:6
    
    
  },
  stext1:{
    fontSize:18,
    fontWeight:900,
    textAlign:'center',
    color:"#0C1767",
    marginTop:6
    
    
  },
  Image:{
    marginTop:-2,
  },
  im:{
    width: 160,
    height: 100,
    borderRadius: 10,
    resizeMode:"stretch"
  },
  im1:{
    width: 160,
    height: 100,
    borderRadius: 10,
   resizeMode:"stretch"
  
  },
  im2:{
    width: 160,
    height: 100,
    borderRadius: 10,
   resizeMode:"stretch"
  
  },
  carouselContainer: {
    width: '100%',
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: '#ECEDFF',
    marginTop: -10,
  },
  carouselContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },



});

export default MainScreen;