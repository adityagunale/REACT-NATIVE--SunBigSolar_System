import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadScreen = () => {
  const navigation = useNavigation();
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileUpload = async (documentType) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [documentType]: res,
      }));

      const formData = new FormData();
      formData.append('file', {
        uri: res.uri,
        type: res.type || 'application/pdf', // Default to 'application/pdf' if type is undefined
        name: res.name,
      });
      formData.append('documentType', documentType);

      console.log('Uploading file:', formData);

      const token = await AsyncStorage.getItem('token'); // Get token from storage

      await axios.post('http://192.168.43.42:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':` Bearer ${token}` // Include token in headers
        },
      });

      Alert.alert('Success', `${documentType} uploaded successfully!`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error uploading file:', err.message);
        if (err.response) {
          console.error('Response data:', err.response.data);
        }
        Alert.alert('Error', 'Failed to upload document. Please try again.');
      }
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#0D1A69', '#01C1EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.iconback}>
          <TouchableOpacity onPress={() => navigation.navigate('Main')}>
            <Icon name="arrow-left" size={24} color="white" style={styles.title} />
          </TouchableOpacity>
          <Text style={styles.title1}>Upload Project Documents</Text>
        </View>

        <View style={styles.white}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Electricity Bill</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Electricity Bill')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Annexure 1 & Perform A</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Annexure 1 & Perform A')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Signed Agreement 1</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Signed Agreement 1')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.downloadText}>Download Sample format</Text>

            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Signed Agreement 2</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Signed Agreement 2')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.downloadText}>Download Sample format</Text>

            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Signed Work Completion Report</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Signed Work Completion Report')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.documentContainer}>
              <Text style={styles.documentTitle}>Customer Photo with Solar Panels</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('Customer Photo with Solar Panels')}>
                <Icon name="cloud-upload" size={20} color="#0a1172" marginLeft={20} />
                <Text style={styles.uploadButtonText}> Upload File</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  iconback: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 25,
    color: 'white',
    fontWeight: '900',
    marginTop: 20,
    marginLeft: 30,
  },
  title1: {
    fontSize: 25,
    color: 'white',
    fontWeight: '900',
    marginLeft: 30,
    marginTop: 15,
  },
  white: {
    backgroundColor: '#ECEDFF',
    height: '100%',
    width: '100%',
    marginTop: '5%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 10,
    alignItems: 'center',
  },
  scrollViewContent: {
    padding: 10,
  },
  documentContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: 380,
  },
  documentTitle: {
    color: '#0a1172',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 5,
    marginLeft: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  uploadButtonText: {
    padding: 0,
    fontSize: 16,
    color: "#0a1172",
    marginLeft: 5,
    fontFamily: "Poppins-Regular",
  },
  downloadText: {
    color: '#0a1172',
    textAlign: 'right',
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    marginTop: -5,
    marginBottom: 4,
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#0a1172',
    padding: 19,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default UploadScreen;
