import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { horizontalScale, verticalScale, moderateScale, responsiveSpacing } from '../utils/responsive';

const ShowDocuments = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('documents');
  const [userName, setUserName] = useState('');
  const [userDocuments, setUserDocuments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userResponse = await axios.get(`${config.getApiUrl()}/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUserName(userResponse.data.name);

        const filesResponse = await axios.get(`${config.getApiUrl()}/files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Files Response:', filesResponse.data); // Debug log
        
        // Add index as fallback id if _id is not present
        const documentsWithIds = filesResponse.data.data.map((doc, index) => ({
          ...doc,
          fallbackId: index.toString()
        }));
        setUserDocuments(documentsWithIds);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const DocumentItem = ({ item }) => (
    <View style={styles.documentItem}>
      <Image
        source={{ uri: item.url }}
        style={styles.documentImage}
      />
      <Text style={styles.documentText}>{item.originalName}</Text>
      <TouchableOpacity>
        <Feather 
          name="edit" 
          size={moderateScale(20)} 
          color="black" 
          fontWeight="bold" 
          style={styles.editIcon}
        />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={moderateScale(36)} color="white" />
          <Text style={styles.userName}>Hello ! {userName}</Text>
          <Ionicons name="menu" size={moderateScale(30)} color="#8CFEFF" style={styles.menuIcon} />
        </View>
        <Text style={styles.title}>Project Documents Details</Text>
      </LinearGradient>

      <View style={styles.clientCard}>
        <Ionicons name="person-circle-outline" size={moderateScale(50)} color="#0C1767" />
        <View style={styles.client}>
          <Text style={styles.clientName}>{userName}</Text>
          <Text style={styles.clientId}>Client Id: 2001</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Documents Details</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        data={userDocuments}
        keyExtractor={(item) => item._id?.toString() || item.fallbackId}
        renderItem={({ item }) => <DocumentItem item={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomNav}>
        {bottomNavItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, activeTab === item.key && styles.activeNavItem]}
            onPress={() => {
              if (item.key === 'profile') {
                navigation.navigate('Profile');
              } 
              if (item.key === 'documents') {
                navigation.navigate('Show Documents');
              } 
              if (item.key === 'home') {
                navigation.navigate('Main');
              } 
              else {
                setActiveTab(item.key);
              }
            }}
          >
            <Icon 
              name={item.icon} 
              size={moderateScale(25)} 
              color={activeTab === item.key ? '#002F7A' : 'black'} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const bottomNavItems = [
  { key: 'home', icon: 'home' },
  { key: 'monitor', icon: 'line-chart' },
  { key: 'documents', icon: 'file-text' },
  { key: 'refer', icon: 'users' },
  { key: 'profile', icon: 'user-circle' }
];

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ECEDFF" 
  },
  header: {
    padding: responsiveSpacing(20),
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
    height: verticalScale(200),
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: 'row',
    marginHorizontal: horizontalScale(2),
    alignItems: 'center',
  },
  userName: { 
    color: 'white',
    fontSize: moderateScale(18),
    marginLeft: horizontalScale(10), 
  },
  menuIcon: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    
  },
  title: { 
    fontSize: moderateScale(20), 
    fontWeight: "bold", 
    color: "white", 
    marginTop: verticalScale(20), 
    textAlign: "center"
  },
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: responsiveSpacing(15),
    marginHorizontal: horizontalScale(20),
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
    marginTop: verticalScale(-40),
  },
  client: {
    marginLeft: horizontalScale(10)
  },
  clientName: { 
    fontSize: moderateScale(18), 
    fontWeight: "bold"
  },
  clientId: { 
    fontSize: moderateScale(14), 
    color: "black"
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    margin: responsiveSpacing(20),
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: horizontalScale(10),
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    elevation: 3,
    padding: responsiveSpacing(0),
    height: verticalScale(140),
  },
  documentImage: { 
    width: horizontalScale(180), 
    height: verticalScale(180), 
    borderRadius: moderateScale(5),
    marginLeft: horizontalScale(15), 
    marginRight: horizontalScale(10), 
    resizeMode: "contain"
  },
  documentText: { 
    flex: 1, 
    fontSize: moderateScale(16),
    marginLeft: horizontalScale(10)
  },
  editIcon: {
    marginRight: horizontalScale(10)
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

export default ShowDocuments;
