import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

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
        setUserDocuments(filesResponse.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const DocumentItem = ({ item }) => (
    <View style={styles.documentItem}>
      <Image
  source={{ uri: item.url }} // Correct way to use the URL
  style={styles.documentImage}
/>
      
      <Text style={styles.documentText}>{item.originalName}</Text>
      <TouchableOpacity>
        <Feather name="edit" size={20} color="black" fontWeight="bold" marginRight={10}/>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userDocuments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <DocumentItem item={item} />}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={['#0D1A69', '#01C1EE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Ionicons name="person-circle-outline" size={35} color="white" />
                <Text style={styles.userName}>Hello ! {userName}</Text>
                <Ionicons name="menu" size={30} color="#8CFEFF" />
              </View>
              <Text style={styles.title}>Project Documents Details</Text>
            </LinearGradient>

            <View style={styles.clientCard}>
              <Ionicons name="person-circle-outline" size={50} color="#0C1767" />
              <View style={styles.client}>
                <Text style={styles.clientName}>{userName}</Text>
                <Text style={styles.clientId}>Client Id: 2001</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Documents Details</Text>
            
          </>
        }
      />

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
              if (item.key === 'home') {
                navigation.navigate('Main');
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
  container: { flex: 1, backgroundColor: "#ECEDFF" },
  header: {
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 200,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: { color: "white", fontSize: 18, marginLeft:-140 },
  title: { fontSize: 20, fontWeight: "bold", color: "white", marginTop: 20 , textAlign: "center"},
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: -40,
  },
  client: {},
  clientName: { fontSize: 18, fontWeight: "bold", marginLeft:10},
  clientId: { fontSize: 14, color: "black" , marginLeft:10},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 20,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  documentImage: { width: 180, height: 180, borderRadius: 5,marginLeft:15, marginRight: 10 , resizeMode:"contain", marginBottom:-20, marginTop:-20},
  documentText: { flex: 1, fontSize: 16 },
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

export default ShowDocuments;
