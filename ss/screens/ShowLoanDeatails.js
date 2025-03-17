// ShowLoanDeatails.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const LoanDetailsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('documents');
  const [loanDetails, setLoanDetails] = useState(null);
  const [document, setDocument] = useState(null); // Change to a single document

  useEffect(() => {
    fetchLoanDetails();
    fetchLoanDocument(); // Change function name to singular
  }, []);

  const fetchLoanDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await axios.get(`${config.getApiUrl()}/loan/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 && response.data.success) {
        setLoanDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      Alert.alert('Error', 'Failed to fetch loan details.');
    }
  };

  const fetchLoanDocument = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await axios.get(`${config.getApiUrl()}/loan/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 && response.data.success) {
        const documents = response.data.data || [];
        if (documents.length > 0) {
          setDocument(documents[0]); // Set the first document
        }
      }
    } catch (error) {
      console.error('Error fetching loan document:', error);
      Alert.alert('Error', 'Failed to fetch loan document.');
    }
  };

  // Inline component for rendering document details
  const DocumentDetail = ({ document }) => (
    <>
    <View style={styles.documentsCard}>
      <Image 
        source={{ uri: document && document.url ? document.url : 'https://via.placeholder.com/150' }} 
        style={styles.documentImage} 
        resizeMode="contain" 
      />
      <Text style={styles.documentTitle}>
        {document && document.title ? document.title : 'Pan Card'}
      </Text>
      <Feather name="edit" size={24} color="black" fontWeight="bold" />
    </View>
    <View style={styles.documentsCard}>
      <Image 
        source={{ uri: document && document.url ? document.url : 'https://via.placeholder.com/150' }} 
        style={styles.documentImage} 
        resizeMode="contain" 
      />
      <Text style={styles.documentTitle}>
        {document && document.title ? document.title : 'Aadhar Card'}
      </Text>
      <Feather name="edit" size={24} color="black" fontWeight="bold" />
    </View>
    <View style={styles.documentsCard}>
      <Image 
        source={{ uri: document && document.url ? document.url : 'https://via.placeholder.com/150' }} 
        style={styles.documentImage} 
        resizeMode="contain" 
      />
      <Text style={styles.documentTitle}>
        {document && document.title ? document.title : 'Income Proof'}
      </Text>
      <Feather name="edit" size={24} color="black" fontWeight="bold" />
    </View>
    <View style={styles.documentsCard}>
      <Image 
        source={{ uri: document && document.url ? document.url : 'https://via.placeholder.com/150' }} 
        style={styles.documentImage} 
        resizeMode="contain" 
      />
      <Text style={styles.documentTitle}>
        {document && document.title ? document.title : 'ITR'}
      </Text>
      <Feather name="edit" size={24} color="black" fontWeight="bold" />
    </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={40} color="white" />
          <Text style={styles.headerText}>Hello ! {loanDetails ? loanDetails.name : 'User Name'}</Text>
          <MaterialCommunityIcons name="menu" size={24} color="white" style={styles.menuIcon} />
        </View>
        <Text style={styles.headerTitle}>Solar Loan Details</Text>
      </LinearGradient>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }} style={styles.profileImage} />
        <View>
          <Text style={styles.profileName}>{loanDetails ? loanDetails.name : 'Loading...'}</Text>
          <Text style={styles.profileClientId}>Client Id: {loanDetails ? loanDetails.userId : 'Loading...'}</Text>
        </View>
      </View>

      <ScrollView>
        {/* Basic Details */}
        <Text style={styles.sectionTitle}>Basic Details</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="phone" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>+91 {loanDetails ? loanDetails.phone : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="email" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.email : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="map-marker" size={28} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.address : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="solar-power" size={28} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.solarSystemSize : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="briefcase" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.occupation : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="cash-multiple" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.annualincome : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" />
            </View>
          </View>
        </View>

        {/* Document Details */}
        <Text style={styles.sectionTitle}>Document Details</Text>
        {document && <DocumentDetail document={document} />}
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
            navigation.navigate('Loan Details');
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
    backgroundColor: '#F5F5FF',
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
    
  },
  menuIcon: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    
  },
  headerText: {
    color: 'white',
    fontSize: moderateScale(18),
    marginLeft: horizontalScale(10),
  },
  headerTitle: {
    color: 'white',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginTop: verticalScale(20),
    textAlign: 'center',
    marginBottom: verticalScale(40)
  },
  profileCard: {
    backgroundColor: 'white',
    marginBottom: verticalScale(20),
    width: '90%',
    marginLeft: horizontalScale(22),
    marginTop: verticalScale(-40),
    padding: responsiveSpacing(10),
    borderRadius: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
  },
  profileImage: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    marginRight: horizontalScale(15),
  },
  profileName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: "#0a1172"
  },
  profileClientId: {
    color: 'black',
    fontSize: moderateScale(14),
  },
  sectionTitle: {
    marginLeft: horizontalScale(15),
    fontSize: moderateScale(17),
    fontWeight: 'bold',
    color: "#0a1172",
    fontFamily: 'Poppins-Bold',
    marginTop: verticalScale(20)
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: responsiveSpacing(15),
    padding: responsiveSpacing(15),
    borderRadius: moderateScale(10),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FCFF',
    justifyContent: 'space-between',
    paddingRight: horizontalScale(10),
  },
  iconWrapper: {
    paddingRight: horizontalScale(10),
  },
  detailText: {
    marginLeft: horizontalScale(10),
    fontSize: moderateScale(19),
    marginBottom: verticalScale(10),
    color: "#0a1172"

  },
  documentsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: horizontalScale(20),
    marginVertical: verticalScale(5),
    marginTop: verticalScale(20),
    borderRadius: moderateScale(10),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
    justifyContent: 'space-between',
    paddingRight: horizontalScale(15),
  },
  documentTitle: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(10),
    color: "#0a1172",
    flex: 1,
    marginLeft: horizontalScale(10),
  },
  documentImage: {
    width: horizontalScale(180),
    height: verticalScale(180),
    borderRadius: moderateScale(5),
    marginLeft: horizontalScale(15),
    marginRight: horizontalScale(10),
    resizeMode: "contain",
    marginBottom: verticalScale(-20),
    marginTop: verticalScale(-20)
  },
  editIcon: {
    position: 'absolute',
    right: horizontalScale(15),
    top: verticalScale(15),
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
});

export default LoanDetailsScreen;
