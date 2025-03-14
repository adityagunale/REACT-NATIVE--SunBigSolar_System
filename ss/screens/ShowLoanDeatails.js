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

const LoanDetailsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
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
      <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={70} />
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
      <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={50} />
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
      <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={40} />
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
      <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={110} />
    </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#003F7D', '#00AEEF']} style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.headerText}>Hello ! {loanDetails ? loanDetails.name : 'User Name'}</Text>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
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
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={155} />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="email" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.email : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={170} />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="map-marker" size={28} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.address : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={251} />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="solar-power" size={28} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.solarSystemSize : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={243} />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="briefcase" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.occupation : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={160} />
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="cash-multiple" size={25} color="black" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailText}>{loanDetails ? loanDetails.annualincome : 'Loading...'}</Text>
              <Feather name="edit" size={24} color="black" fontWeight="bold" marginLeft={211} />
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
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    marginLeft: -160
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 40
  },
  profileCard: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: '90%',
    marginLeft: 22,
    marginTop: -40,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#0a1172"
  },
  profileClientId: {
    color: 'black',
  },
  sectionTitle: {
    marginLeft: 15,
    fontSize: 17,
    fontWeight: 'bold',
    color: "#0a1172",
    fontFamily: 'Poppins-Bold',
    marginTop:20
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ensure it takes full width
    borderBottomWidth: 1,
    borderBottomColor: '#D1FCFF',
  },
  iconWrapper: {
    paddingRight: 10, // Add some padding to separate the icon from the text
  },
  detailText: {
    marginLeft: 10,
    fontSize: 19,
    marginBottom:10
  },
  documentsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 5,
    marginTop:20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 16,
    marginBottom: 10,
    color:"#0a1172"
  },
  documentImage: {
    width: 180, height: 180, borderRadius: 5, marginLeft:15, marginRight: 10, resizeMode:"contain", marginBottom:-20, marginTop:-20
  },
  editIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
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
    borderRadius: 10
  },
  navItem: {
    padding: 10
  },
  activeNavItem: {
    backgroundColor: '#C6EAFF',
    borderRadius: 20,
    padding: 10
  },
});

export default LoanDetailsScreen;
